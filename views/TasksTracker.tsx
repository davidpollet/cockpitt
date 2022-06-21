import {
  addDummiesProjects,
  removeDummyProjects,
} from "@store/features/todosSlice"
import {
  createNewProject,
  placeHolderProjectName,
  sortProjects,
} from "@helpers/tasksHelpers"
import { useDispatch, useSelector } from "react-redux"

import { IconPlus } from "@components/Icons.index"
import Loading from "@components/Loading"
import { MouseEvent } from "react"
import { RootState } from "@store/store"
import TasksProject from "@components/TodosProject"
import { motion } from "framer-motion"
import projectProps from "@localTypes/projectProps"
import { testDemoButtonTwClass } from "@components/BillsList"
import { useAddNewProject } from "@hooks/todosHooks"
import useIsMounted from "@hooks/useIsMounted"
import useUser from "@hooks/useUser"
import { userProps } from "@localTypes/userProps"

function TasksTracker() {
  const isMounted = useIsMounted()
  let { user } = useUser()
  const projects = useSelector((state: RootState) => state.todos)
  const projectsSorted = sortProjects(projects)
  const inboxProject = projects.find((p) => p.name === "Inbox")

  if (!isMounted) {
    return (
      <div className="flex justify-center p-2">
        <Loading />
      </div>
    )
  }

  return (
    <div className="grid gap-2 lg:grid-cols-main-layout xl:gap-4">
      {projectsSorted.length > 0 && <ProjectsNav projects={projectsSorted} />}
      <div className="grid gap-4">
        {inboxProject && (
          <TasksProject key={inboxProject.id} project={inboxProject} />
        )}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <MyProjectsTitle title="Mes projets" />
            <AddNewProjectButton user={user} />
          </div>
          {projects.some((project: projectProps) => project.isDummy) && (
            <RemoveDummyProjectsBox projects={projects} />
          )}
          <div className="grid gap-5 pt-2">
            {projectsSorted.map((project: projectProps) => {
              if (project.name === "Inbox") return null
              return <TasksProject key={project.id} project={project} />
            })}
          </div>
        </div>
        {!projects.some((p) => p.name !== "Inbox") && <TestDemoWrapper />}
      </div>
    </div>
  )
}

function ProjectsNav({ projects }: { projects: projectProps[] }) {
  const navItemClass = `button is-ghost py-1 dark:text-violet-100 <lg:whitespace-nowrap <lg:px-2`

  function handleNavProjectClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    const link = event.currentTarget as HTMLAnchorElement
    const projectId = link.hash.slice(1)
    const project = document.querySelector(
      `[data-projectid="${projectId}"]`
    ) as HTMLElement
    if (project) {
      document
        .querySelector(".project-wrapper.is-target")
        ?.classList.remove("is-target")
      project.classList.add("is-target")
      project.scrollIntoView({ behavior: "smooth" })
    }
  }
  return (
    <nav className="grid items-start lg:order-1">
      <div
        className="sticky top-1 flex max-h-[95vh] gap-1 overflow-auto rounded-md  p-1 ring-1 ring-inset ring-violet-500 dark:ring-0 lg:flex-col"
        style={{ scrollbarWidth: "none", overscrollBehavior: "contain" }}
      >
        <a href="#inbox" className={navItemClass}>
          Inbox
        </a>
        {projects.map(
          (project) =>
            project.name !== "Inbox" && (
              <motion.a
                layout="position"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={navItemClass}
                key={"link-" + project.id}
                href={`#${project.id}`}
                onClick={handleNavProjectClick}
              >
                {project.name}
              </motion.a>
            )
        )}
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

function TestDemoWrapper() {
  const dispatch = useDispatch()

  return (
    <div
      role="row"
      className="flex flex-wrap justify-center gap-2 bg-white p-2 text-center dark:bg-violet-850 lg:p-4"
    >
      <p className="text-xl font-bold text-violet-500 dark:text-white lg:text-2xl">
        Aucun projects à afficher
      </p>
      <button
        className={testDemoButtonTwClass}
        onClick={() => dispatch(addDummiesProjects())}
      >
        Tester la démo
      </button>
    </div>
  )
}

function AddNewProjectButton({ user }: { user: userProps }) {
  const { addNewProject, isAdding } = useAddNewProject()

  function handleCreateNewProject() {
    const owner = user.id || null
    const newProject = createNewProject(placeHolderProjectName, owner)
    addNewProject(newProject)
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
        <span>Ajouter</span>
      </span>
      <Loading
        color="white"
        size={24}
        className={`absolute left-2/4 top-2/4 -translate-x-2/4 transition ${
          isAdding ? "-translate-y-2/4" : "translate-y-full opacity-0"
        }`}
      />
    </button>
  )
}

function RemoveDummyProjectsBox({ projects }: { projects: projectProps[] }) {
  const dispatch = useDispatch()
  return (
    <div role="row" className="my-2 dark:bg-violet-850">
      <button
        className={testDemoButtonTwClass}
        onClick={() => dispatch(removeDummyProjects(projects))}
      >
        Retirer les projets fictifs
      </button>
    </div>
  )
}

export default TasksTracker
