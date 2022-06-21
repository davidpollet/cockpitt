import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import {
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react"
import { IconChevronDown, IconInfo, IconTrashOutline } from "./Icons.index"
import {
  createNewTask,
  placeHolderProjectName,
  sortTasks,
} from "@helpers/tasksHelpers"
import {
  useAddNewTask,
  useDeleteProject,
  useToggleProject,
  useUpdateProject,
} from "@hooks/todosHooks"

import ItemDeleteDialog from "./ItemDeleteDialog"
import Loading from "./Loading"
import Task from "./TodoTask"
import projectProps from "@localTypes/projectProps"
import showToast from "@helpers/showToast"
import { taskProps } from "@localTypes/taskProps"
import useUser from "@hooks/useUser"
import wait from "@helpers/wait"

function TasksProject({ project }: { project: projectProps }) {
  const sortedTask = useMemo(() => sortTasks(project.tasks), [project.tasks])
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const { deleteProject, isDeleting } = useDeleteProject()

  return (
    <motion.section
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`project-wrapper target:scroll-padding-y-6 relative grid gap-1 rounded-md border-2 border-violet-50 px-2 transition-[padding] target:border-violet-200 target:shadow-xl dark:border-violet-600/0 dark:bg-violet-800 dark:target:border-violet-100
      ${showDeleteConfirmation && !project.isExpanded ? "py-6" : "pt-1 pb-2"}`}
      tabIndex={-1}
      id={project.name === "Inbox" ? "inbox" : project.id} // eslint-disable-line
      data-projectid={project.name === "Inbox" ? "inbox" : project.id} // eslint-disable-line
    >
      <div className="flex items-center">
        <ToggleProjectButton project={project} />
        <ProjectTitle project={project} />
        <button
          ref={deleteButtonRef}
          onClick={() => {
            setShowDeleteConfirmation(true)
          }}
          id={`delete-project-${project.id}`}
          className="button is-ghost ml-auto p-2 text-xl text-violet-500 dark:text-violet-100"
          hidden={project.name === "Inbox"}
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
            {sortedTask.length > 0 ? (
              <ul className="grid gap-[2px]">
                <LayoutGroup id={project.id}>
                  {sortedTask.map((task) => (
                    <Task key={task.id} task={task} />
                  ))}
                </LayoutGroup>
              </ul>
            ) : (
              <p className="flex items-center gap-1 p-2 text-violet-500 dark:text-violet-100">
                <IconInfo size={24} />
                Aucune tâche à afficher
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ItemDeleteDialog
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

function AddNewTask({ project }: { project: projectProps }) {
  const { addNewTask, isAdding } = useAddNewTask()
  const { user } = useUser()
  const formRef = useRef<HTMLFormElement>(null)

  const nameTrimed = project.name.replaceAll(/\s/g, "")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formRef.current) return
    const form = formRef.current
    const title = form[`taskTitle-${nameTrimed}`].value
    const task: taskProps = createNewTask({
      title,
      project: project.name,
      owner: user?.id || null,
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
      className={`group flex max-h-8 flex-wrap gap-2 overflow-hidden pr-1 transition-all focus-within:max-h-16`}
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
          className={`w-full rounded-md bg-white/0 p-1 text-gray-900 outline-none transition-all hover:border-violet-400 hover:bg-white/0 hover:bg-gray-50 focus:grow focus:bg-white group-focus-within:bg-white hocus:bg-white hocus:text-currentColor
            dark:text-violet-100 dark:hover:bg-white/10 dark:group-focus-within:bg-white/10 dark:hocus:bg-white/10
          `}
        />
        <Loading
          size={20}
          color="violet-500"
          className={`absolute top-2/4 left-1 transition ${
            isAdding ? "-translate-y-1/2" : "translate-y-full opacity-0"
          }`}
        />
      </div>
      <input type="submit" hidden />
    </form>
  )
}

function ProjectTitle({ project }: { project: projectProps }) {
  const titleRef = useRef<HTMLSpanElement>(null)
  const { updateProject } = useUpdateProject()

  function handleFocusTitle(e: FocusEvent<HTMLSpanElement>) {
    if (e.target.textContent === placeHolderProjectName) {
      e.target.textContent = ""
    }
  }

  async function handleUpdateTitleBlur(titleElement = titleRef.current) {
    if (!titleElement) return
    if (!titleElement.textContent) {
      titleElement.textContent = project.name
      showToast(`Le nom du projet ne peut pas être vide`, "error")
    }

    if (titleElement.textContent !== project.name) {
      updateProject({ ...project, name: titleElement.textContent })
    }
  }

  async function handleUpdateTitleKeyDown(
    event: KeyboardEvent<HTMLSpanElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault()

      const newName = event.currentTarget?.textContent || ""
      if (newName) updateProject({ ...project, name: newName })
      await wait(10)
      document
        .querySelector<HTMLButtonElement>(`#delete-project-${project.id}`)
        ?.focus()
    }
  }

  return (
    <h2 className="text-xl font-bold leading-none text-violet-500 dark:text-white">
      <span
        contentEditable={project.name !== "Inbox"}
        className={`inline-block  rounded-sm outline-none transition-all focus:bg-violet-50 focus:p-1 focus:shadow-sm dark:focus:bg-white/10`}
        spellCheck={false}
        ref={titleRef}
        suppressContentEditableWarning
        onBlur={() => handleUpdateTitleBlur(titleRef.current)}
        onKeyPress={handleUpdateTitleKeyDown}
        onFocus={handleFocusTitle}
      >
        {project.name}
      </span>
    </h2>
  )
}

function ToggleProjectButton({ project }: { project: projectProps }) {
  const { toggleProject } = useToggleProject()

  function handleToggleProject() {
    const isExpanded = !project.isExpanded
    const newProject = { ...project, isExpanded }
    toggleProject(newProject)
  }
  return (
    <button
      className={`button is-ghost p-2 text-violet-500 dark:text-violet-100`}
      aria-label={`${project.isExpanded ? "Réduire" : "Agrandir"} le projet`}
    >
      <IconChevronDown
        className={`translate-y-[2px] transition ${
          project.isExpanded ? null : "-rotate-90"
        }`}
        onClick={handleToggleProject}
      />
    </button>
  )
}
export default TasksProject
