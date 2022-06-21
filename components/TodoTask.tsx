import {
  IconCheck,
  IconPlay,
  IconRefresh,
  IconThumbsDown,
  IconThumbsUp,
  IconTrashOutline,
} from "./Icons.index"
import { memo, useState } from "react"
import { useDeleteTask, useUpdateTask } from "@hooks/todosHooks"

import ItemDeleteDialog from "./ItemDeleteDialog"
import { motion } from "framer-motion"
import { taskProps } from "@localTypes/taskProps"

function Task({ task }: { task: taskProps }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { deleteTask, isDeleting } = useDeleteTask()

  return (
    <motion.li
      layout="position"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative flex gap-2 rounded-md bg-white px-2 transition-[padding] dark:bg-white/10 dark:text-violet-100 <sm:flex-col ${
        showDeleteConfirmation ? "<md:py-9 md:py-6" : "py-2"
      }`}
    >
      <h3 className="sm:flex-grow">{task.title}</h3>
      <div className="flex">
        <TaskStatus task={task} />
        <TaskDelete onClick={() => setShowDeleteConfirmation(true)} />
      </div>
      <ItemDeleteDialog
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

function TaskStatus({ task }: { task: taskProps }) {
  const { updateTask } = useUpdateTask()

  return (
    <div className="relative ml-auto overflow-hidden">
      <button
        tabIndex={task.state === "PENDING" ? 0 : -1}
        className={`button is-ghost absolute top-1/2 right-0 -translate-y-2/4 text-lg
        ${task.state === "PENDING" ? null : "pointer-events-none opacity-0"}
        px-2 py-1 dark:text-violet-100`}
        onClick={() => updateTask({ ...task, state: "STARTED" })}
        aria-label={`Démarrer la tâche`}
      >
        <IconPlay />
      </button>
      <button
        tabIndex={task.state === "STARTED" ? 0 : -1}
        className={`button is-ghost absolute top-1/2 right-0 text-2xl
          ${task.state === "STARTED" ? "-translate-y-2/4" : "translate-y-full"}
          ${
            task.state === "DONE"
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }
          px-2 py-1 dark:text-violet-100`}
        aria-label="Terminer la tâche"
        onClick={() => updateTask({ ...task, state: "DONE" })}
      >
        <IconCheck />
      </button>
      <div
        className={`
          absolute top-1/2 right-0 left-0 flex justify-end
          ${task.state === "DONE" ? "-translate-y-2/4" : "translate-y-full"}
          ${
            task.state === "VALIDATED" || task.state === "REJECTED"
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }
          gap-2 transition`}
      >
        <button
          className={`button is-ghost from-red-100 to-red-100 p-1 px-2 py-1 text-lg text-red-700 hocus:text-red-700 dark:bg-red-500 dark:text-red-100 dark:hocus:text-red-700`}
          aria-label="Marquer comme refusée"
          onClick={() => updateTask({ ...task, state: "REJECTED" })}
          tabIndex={task.state === "DONE" ? 0 : -1}
        >
          <IconThumbsDown />
        </button>
        <button
          className={`button is-ghost from-green-100 to-green-100 p-1 px-2 py-1 text-lg text-green-700 hocus:text-green-700 dark:bg-green-500 dark:text-green-900 dark:hocus:text-green-700`}
          aria-label="Marquer comme Validée"
          onClick={() => updateTask({ ...task, state: "VALIDATED" })}
          tabIndex={task.state === "DONE" ? 0 : -1}
        >
          <IconThumbsUp />
        </button>
      </div>
      <button
        tabIndex={task.state === "VALIDATED" ? 0 : -1}
        aria-label="La tâche est validée. Recommencer ?"
        className={`absolute top-1/2 right-0 flex items-center gap-2 rounded-md bg-green-100 p-1 text-sm text-green-700 transition
            ${
              task.state === "VALIDATED"
                ? "-translate-y-1/2"
                : "translate-y-full"
            }`}
        onClick={() => updateTask({ ...task, state: "PENDING" })}
      >
        Validée
        <IconRefresh />
      </button>
      <button
        tabIndex={task.state === "REJECTED" ? 0 : -1}
        aria-label="La tâche est refusée. Recommencer ?"
        className={`button bg-right-center flex items-center gap-2 rounded-md bg-gradient-to-r from-red-100 to-red-100 bg-w-0/h-0 p-1 text-sm text-red-500 transition-all hocus:bg-w-full/h-full dark:bg-red-300 dark:text-red-700 ${
          task.state === "REJECTED"
            ? "translate-y-0"
            : "pointer-events-none translate-y-8"
        }`}
        onClick={() => updateTask({ ...task, state: "PENDING" })}
      >
        Recommencer ?
        <IconRefresh className="box-content rounded-md border-4 border-red-100 bg-red-100 dark:border-red-300 dark:bg-red-300" />
      </button>
    </div>
  )
}

export default memo(Task)
