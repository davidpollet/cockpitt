import {
  NEW_PROJECT_PLACEHOLDER_NAME,
  createNewProject,
  sortProjects,
} from "./tasksHelpers"
import { TasksProject, getProjectIdAttr, useSelectedProject } from "./TodosProject"

import { IconPlus } from "src/ui/icons/Plus"
import { LayoutGroup } from "framer-motion"
import { Project } from "./Project"
import React from "react"
import Spinner from "src/ui/Spinner"
import { motion } from "framer-motion"
import { useProject } from "./useProject"
import { useProjects } from "./useProjects"
import { useUser } from "../user-auth/useUser"

export function TasksTracker() {
  const { projects: projectsRaw, isLoading } = useProjects()

  const projects = sortProjects(projectsRaw)

  if (isLoading) {
    return (
      <div className="flex justify-center p-2">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="grid gap-2 lg:grid-cols-main-layout xl:gap-4">
      {projects.length > 0 && <ProjectsNav projects={projects} />}
      <div className="grid gap-4">
        <div>
          {projects.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <MyProjectsTitle title="Mes projets" />
                {projectsRaw.some((project: Project) => project.isDummy) && (
                  <RemoveDummyProjectsBox />
                )}
                <AddNewProjectButton />
              </div>
            </>
          ) : (
            <EnableDemoWrapper />
          )}

          <div className="grid gap-5 pt-2">
            {projects.map((project: Project) => {
              return <TasksProject key={project.id} project={project} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectsNav({ projects }: { projects: Project[] }) {
  const { setSelectedProject, selectedProject } = useSelectedProject()
  const navItemClass =
    "button is-ghost py-1 dark:text-violet-100 <lg:whitespace-nowrap <lg:px-2"
  const projectsNavRef = React.useRef<HTMLElement>(null)
  const [projectToFocus, setProjectToFocus] = React.useState(selectedProject || "")
  const { updateProject, project } = useProject(projectToFocus)
  const [hasClicked, setHasClicked] = React.useState(false)

  React.useEffect(() => {
    if (project === undefined || !hasClicked) return
    if (!project.isExpanded && hasClicked) {
      updateProject({ ...project, isExpanded: true })
      setHasClicked(false)
    }
  }, [project, updateProject, hasClicked])

  function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const projectHash = e.currentTarget.hash
    const projectId = e.currentTarget.dataset.projectid
    const projectElTarget = document.querySelector(projectHash) as HTMLElement
    const navEl = projectsNavRef.current as HTMLElement
    const navElIsOnSide = Number(window.getComputedStyle(navEl).getPropertyValue("order"))
    setSelectedProject(projectId || "")
    setProjectToFocus(projectId || "")
    setHasClicked(true)

    const paddingScroll = 12

    if (projectElTarget) {
      window.scrollTo({
        top: navElIsOnSide
          ? projectElTarget.offsetTop - paddingScroll
          : projectElTarget.offsetTop - navEl.clientHeight - paddingScroll,
        behavior: "smooth",
      })
    }
  }

  return (
    <nav
      ref={projectsNavRef}
      className="z-20 grid items-start rounded-md bg-violet-25 dark:bg-violet-850 <lg:sticky <lg:top-1 lg:order-1"
    >
      <div
        className="flex max-h-[95vh] gap-1 overflow-auto overscroll-contain rounded-md p-1  ring-1 ring-inset ring-violet-500 dark:ring-0 lg:sticky lg:top-1 lg:flex-col"
        style={{ scrollbarWidth: "none" }}
      >
        <LayoutGroup id="nav">
          {projects.map((project) => (
            <motion.a
              layout="position"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={navItemClass}
              key={project.id}
              href={`#${getProjectIdAttr(project.id)}`}
              onClick={handleLinkClick}
              data-projectid={project.id}
            >
              {project.name}
            </motion.a>
          ))}
        </LayoutGroup>
      </div>
    </nav>
  )
}

function MyProjectsTitle({ title }: { title: string }) {
  return (
    <h2 className="relative flex grow items-center font-bold text-violet-500 opacity-100 transition-all dark:text-white">
      <span className="relative z-10 text-2xl xl:text-3xl">{title}</span>
      <span
        className="absolute whitespace-nowrap text-2xl uppercase opacity-10 sm:text-4xl xl:text-5xl"
        aria-hidden
      >
        {title}
      </span>
    </h2>
  )
}

function EnableDemoWrapper() {
  const { addDummyProjects } = useProjects()
  return (
    <div className="flex flex-wrap justify-center gap-2 bg-white p-2 text-center dark:bg-violet-850 lg:p-4">
      <p className="basis-full text-xl font-bold text-violet-500 dark:text-white lg:text-2xl">
        Aucun projects à afficher
      </p>
      <button
        className="button is-outline justify-self-center dark:from-violet-300 dark:to-violet-300 dark:text-violet-100 dark:ring-violet-100 dark:hover:text-violet-600"
        onClick={addDummyProjects}
      >
        Tester la démo
      </button>
      <AddNewProjectButton />
    </div>
  )
}

function AddNewProjectButton() {
  const { addNewProject, isUpdating: isAdding } = useProjects()
  const { user } = useUser()
  const { setSelectedProject } = useSelectedProject()
  function handleCreateNewProject() {
    const newProject = createNewProject(NEW_PROJECT_PLACEHOLDER_NAME, user?.id || "")
    addNewProject(newProject)
    setSelectedProject(newProject.id)
  }

  return (
    <button
      className="button is-filled relative"
      onClick={handleCreateNewProject}
      disabled={isAdding}
    >
      <span
        className={`
          flex items-center gap-1 transition
          ${isAdding ? "opacity-0" : null}
        `}
      >
        <IconPlus />
        <span>Ajouter un projet</span>
      </span>
      <Spinner
        color="white"
        size={24}
        className={`absolute left-2/4 top-2/4 -translate-x-2/4 transition ${
          isAdding ? "-translate-y-2/4" : "translate-y-full opacity-0"
        }`}
      />
    </button>
  )
}

function RemoveDummyProjectsBox() {
  const { removeDummyProjects } = useProjects()
  return (
    <div className="my-2 dark:bg-violet-850">
      <button
        className="button is-outline justify-self-center dark:from-violet-300 dark:to-violet-300 dark:text-violet-100 dark:ring-violet-100 dark:hocus:text-violet-600"
        onClick={removeDummyProjects}
      >
        Retirer les projets fictifs
      </button>
    </div>
  )
}
