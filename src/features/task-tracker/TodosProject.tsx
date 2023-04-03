import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import {
  NEW_PROJECT_PLACEHOLDER_NAME,
  createNewTask,
  sortTasks,
} from "./tasksHelpers"

import { IconChevronDown } from "src/ui/icons/ChevronDown"
import { IconInfo } from "src/ui/icons/Info"
import { IconTrashOutline } from "src/ui/icons/Trash"
import ItemDeleteDialog from "../../ui/ItemDeleteDialog"
import { LOCAL_USER_ID } from "src/lib/utils/localStorage"
import { Project } from "./Project"
import React from "react"
import Spinner from "../../ui/Spinner"
import Task from "./TodoTask"
import cn from "classnames"
import { create } from "zustand"
import { showToast } from "src/lib/utils/showToast"
import { useProject } from "./useProject"
import { useUser } from "../user-auth/useUser"

export const getProjectIdAttr = (projectId: string) => `project-${projectId}`

type SelectedProject = {
  selectedProject: string | undefined
  setSelectedProject: (projectId: string) => void
}

export const useSelectedProject = create<SelectedProject>((set) => ({
  selectedProject: undefined,
  setSelectedProject: (projectId: string) =>
    set((state) => ({ ...state, selectedProject: projectId })),
}))

export function TasksProject({ project }: { project: Project }) {
  const tasks = sortTasks(project.tasks)
  const { selectedProject } = useSelectedProject()
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false)
  const deleteButtonRef = React.useRef<HTMLButtonElement>(null)
  const { deleteProject, isUpdating: isDeleting } = useProject(project.id)
  const projectIdAttr = getProjectIdAttr(project.id)
  const classnames = cn(
    "project-wrapper relative grid gap-1 rounded-md border-2 border-violet-50 px-2 transition-[padding,border,box-shadow]  dark:border-violet-600/0 dark:bg-violet-800",
    {
      "border-violet-200 shadow-xl dark:border-violet-100":
        project.id === selectedProject,
      "py-6": showDeleteConfirmation && !project.isExpanded,
      "pt-1 pb-2": !showDeleteConfirmation && project.isExpanded,
    },
  )
  return (
    <motion.section
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={classnames}
      id={projectIdAttr}
    >
      <div className="flex items-center">
        <ToggleProjectButton project={project} />
        <ProjectTitle project={project} />
        <button
          ref={deleteButtonRef}
          onClick={() => {
            setShowDeleteConfirmation(true)
          }}
          className="button is-ghost ml-auto p-2 text-xl text-violet-500 dark:text-violet-100"
          aria-label={`Effacer le projet ${project.name}`}
        >
          <IconTrashOutline />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {project.isExpanded && (
          <motion.div
            className="grid gap-1"
            key={project.name}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <AddNewTask project={project} />
            {tasks.length > 0 ? (
              <LayoutGroup id={project.id}>
                {tasks.map((task) => (
                  <Task key={task.id} task={task} />
                ))}
              </LayoutGroup>
            ) : (
              <p className="flex items-center gap-1 p-2 text-violet-500 dark:text-violet-100">
                <IconInfo className="w-6" />
                Aucune tâche à afficher
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ItemDeleteDialog<Project>
        question={`Supprimer le projet ${project.name} ?`}
        itemToDelete={project}
        dialogIsVisible={showDeleteConfirmation}
        setDialogIsVisible={setShowDeleteConfirmation}
        deleteFn={deleteProject}
        isDeleting={isDeleting}
      />
    </motion.section>
  )
}

function AddNewTask({ project }: { project: Project }) {
  const { addNewTask, isUpdating: isAdding } = useProject(project.id)
  const { user } = useUser()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { selectedProject, setSelectedProject } = useSelectedProject()

  const nameTrimed = project.name.replaceAll(/\s/g, "")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formRef.current) return
    const form = formRef.current
    const title = form[`taskTitle-${nameTrimed}`].value
    const task = createNewTask({
      title,
      projectName: project.name,
      owner: user?.id || LOCAL_USER_ID,
      projectId: project.id,
      isDummy: project.isDummy,
    })

    addNewTask(task)
    form.reset()
  }

  return (
    <form
      ref={formRef}
      data-project={nameTrimed}
      onSubmit={handleSubmit}
      aria-label={`Ajoutez une tâche pour le projet ${nameTrimed}`}
      id={`add-task-${nameTrimed}`}
      className={`group flex flex-wrap gap-2 transition-all`}
    >
      <div className="relative grow">
        <label htmlFor={`taskTitle-${nameTrimed}`} className="sr-only">
          Titre de la tâche
        </label>
        <input
          id={`taskTitle-${nameTrimed}`}
          type="text"
          required
          disabled={isAdding}
          name={`taskTitle-${nameTrimed}`}
          placeholder="+ Ajouter une tâche"
          className="input-text w-full rounded-md border-0 bg-transparent outline-none ring-1 ring-inset ring-violet-100 ring-offset-0 dark:bg-transparent dark:ring-white/10"
          ref={(node) =>
            selectedProject === project.id &&
            !document.activeElement?.closest(`#project-${project.id}`) &&
            project.name !== NEW_PROJECT_PLACEHOLDER_NAME &&
            node?.focus()
          }
          onFocus={() =>
            selectedProject !== project.id && setSelectedProject("")
          }
        />
        {isAdding ? (
          <Spinner
            size={20}
            color="violet"
            className={`absolute top-2/4 left-1 transition ${
              isAdding ? "-translate-y-1/2" : "translate-y-full opacity-0"
            }`}
          />
        ) : null}
      </div>
      <input type="submit" hidden />
    </form>
  )
}

function ProjectTitle({ project }: { project: Project }) {
  const { updateProject } = useProject(project.id)
  const { selectedProject, setSelectedProject } = useSelectedProject()

  function handleFocusTitle(e: React.FocusEvent<HTMLSpanElement>) {
    setSelectedProject(project.id)
    if (e.target.textContent === NEW_PROJECT_PLACEHOLDER_NAME) {
      e.target.textContent = ""
      if (selectedProject !== project.id) setSelectedProject("")
    }
  }

  async function handleUpdateTitleBlur(
    e: React.SyntheticEvent<HTMLSpanElement>,
  ) {
    const element = e.currentTarget
    if (!element.textContent) {
      element.textContent = project.name
      showToast(`Le nom du projet ne peut pas être vide`, "error")
    }

    if (element.textContent !== project.name) {
      updateProject({ ...project, name: element.textContent })
    }
  }

  async function handleUpdateTitleKeyDown(
    event: React.KeyboardEvent<HTMLSpanElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault()

      const newName = event.currentTarget?.textContent || ""
      if (newName) updateProject({ ...project, name: newName })
    }
  }

  return (
    <h2 className="text-xl font-bold leading-none text-violet-500 dark:text-white">
      <span
        className={`inline-block rounded-sm outline-none transition-all focus:bg-violet-50 focus:p-1 focus:shadow-sm dark:focus:bg-white/10`}
        spellCheck={false}
        contentEditable
        ref={(node) =>
          selectedProject === project.id &&
          project.name === NEW_PROJECT_PLACEHOLDER_NAME &&
          node?.focus()
        }
        suppressContentEditableWarning
        onBlur={handleUpdateTitleBlur}
        onKeyDown={handleUpdateTitleKeyDown}
        onFocus={handleFocusTitle}
      >
        {project.name}
      </span>
    </h2>
  )
}

function ToggleProjectButton({ project }: { project: Project }) {
  const { updateProject } = useProject(project.id)

  function handleToggleProject() {
    const isExpanded = !project.isExpanded
    const newProject = { ...project, isExpanded }
    updateProject(newProject)
  }
  return (
    <button
      className={`button is-ghost p-2 text-violet-500 dark:text-violet-100`}
      aria-label={`${project.isExpanded ? "Réduire" : "Agrandir"} le projet`}
      onClick={handleToggleProject}
    >
      <IconChevronDown
        className={`translate-y-[2px] transition ${
          project.isExpanded ? null : "-rotate-90"
        }`}
      />
    </button>
  )
}
