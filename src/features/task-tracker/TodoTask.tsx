import { IconCheck } from "../../ui/icons/Check"
import ItemDeleteDialog from "../../ui/ItemDeleteDialog"
import { motion } from "framer-motion"
import { Task } from "./Task"
import { IconTrashOutline } from "src/ui/icons/Trash"
import { IconPlay } from "src/ui/icons/Play"
import { IconThumbsDown } from "src/ui/icons/Thumbsdown"
import { IconThumbsUp } from "src/ui/icons/Thumbsup"
import { IconRefresh } from "src/ui/icons/Refresh"
import { useProject } from "./useProject"
import React from "react"

function Task({ task }: { task: Task }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false)
  const { deleteTask, isUpdating: isDeleting } = useProject(task.projectId)

  return (
    <motion.li
      layout="position"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-wrap items-center gap-2 rounded-md bg-white px-2 transition-[padding] dark:bg-white/10 dark:text-violet-100 ${
        showDeleteConfirmation ? "<md:py-9 md:py-6" : "py-2"
      }`}
    >
      <h3 className="flex-grow">{task.title}</h3>
      <div className="flex items-center gap-2">
        <TaskStatus task={task} />
        <TaskDelete onClick={() => setShowDeleteConfirmation(true)} />
      </div>
      <ItemDeleteDialog<Task>
        question="Supprimer cette tâche ?"
        itemToDelete={task}
        dialogIsVisible={showDeleteConfirmation}
        setDialogIsVisible={setShowDeleteConfirmation}
        deleteFn={deleteTask}
        isDeleting={isDeleting}
      />
    </motion.li>
  )
}

function TaskDelete({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={`button is-ghost p-2 dark:text-violet-100`}
      onClick={onClick}
      aria-label={`Supprimer la tâche`}
    >
      <IconTrashOutline />
    </button>
  )
}

function TaskStatus({ task }: { task: Task }) {
  const { updateTask: remoteUpdateTask } = useProject(task.projectId)

  function updateTask(
    e: React.MouseEvent<HTMLButtonElement>,
    state: Task["state"],
  ) {
    let element: HTMLButtonElement | HTMLDivElement = e.currentTarget
    if (state === "REJECTED" || state === "VALIDATED") {
      element = e.currentTarget.parentElement as HTMLDivElement
    }
    element.classList.replace("animate-yIn", "animate-yOut")
    element.addEventListener("animationend", () => {
      remoteUpdateTask({ ...task, state })
    })
  }

  return (
    <div className="relative ml-auto shrink-0 overflow-hidden">
      {task.state === "PENDING" && (
        <button
          className={`button is-ghost translate-y-full scale-75 animate-yIn flex-col gap-y-0 px-2 py-1 text-sm leading-none dark:text-violet-100`}
          onClick={(e) => updateTask(e, "STARTED")}
          aria-label={`Démarrer la tâche`}
        >
          <IconPlay /> Démarer
        </button>
      )}
      {task.state === "STARTED" && (
        <button
          className={`button is-ghost translate-y-full scale-75 animate-yIn flex-col gap-y-0 px-2 py-1 text-sm leading-none dark:text-violet-100`}
          aria-label="Terminer la tâche"
          onClick={(e) => updateTask(e, "DONE")}
        >
          <IconCheck className="h-6 w-6" /> Terminée
        </button>
      )}
      {task.state === "DONE" && (
        <div
          className={`flex translate-y-full scale-75 animate-yIn justify-end gap-2 transition`}
        >
          <button
            className={`button is-ghost flex-col gap-y-0 from-red-100 to-red-100 p-1 px-2 py-1 text-sm leading-none text-red-700 hocus:text-red-700 dark:bg-red-500 dark:text-red-100 dark:hocus:text-red-700`}
            aria-label="Marquer comme refusée"
            onClick={(e) => updateTask(e, "REJECTED")}
          >
            <IconThumbsDown className="h-4 w-4" /> Refusée
          </button>
          <button
            className={`button is-ghost flex-col gap-y-0 from-green-100 to-green-100 p-1 px-2 py-1 text-sm leading-none text-green-700 hocus:text-green-700 dark:bg-green-500 dark:text-green-900 dark:hocus:text-green-700`}
            aria-label="Marquer comme Validée"
            onClick={(e) => updateTask(e, "VALIDATED")}
            tabIndex={task.state === "DONE" ? 0 : -1}
          >
            <IconThumbsUp className="h-4 w-4" /> Validée
          </button>
        </div>
      )}
      {task.state === "VALIDATED" && (
        <>
          <span className="text-sm text-violet-500 dark:text-violet-100">
            Validée
          </span>
          <button
            aria-label="La tâche est validée. Recommencer ?"
            className={`button is-ghost ml-2 translate-y-full scale-75 animate-yIn items-center gap-2 rounded-md bg-green-100 from-green-400 to-green-400 bg-w-full/h-0  bg-bottom p-2 text-sm text-green-700 transition-all hocus:text-green-900`}
            onClick={(e) => updateTask(e, "PENDING")}
            title="Recommencer la tâche ?"
          >
            <IconRefresh className="h-4 w-4" />
          </button>
        </>
      )}
      {task.state === "REJECTED" && (
        <button
          aria-label="La tâche est refusée. Recommencer ?"
          className="button is-ghost translate-y-full scale-75 animate-yIn items-center gap-2 rounded-md bg-red-100 from-red-500 to-red-500  bg-w-full/h-0 bg-bottom p-1 text-sm text-red-700 transition-all hocus:text-red-100"
          onClick={(e) => updateTask(e, "PENDING")}
        >
          Recommencer ?
        </button>
      )}
    </div>
  )
}

export default Task
