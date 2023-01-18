import { nanoid } from "nanoid"
import projectProps from "@localTypes/projectProps"
import { taskProps } from "@localTypes/taskProps"

function sortTasks(tasks: taskProps[]) {
  const validatedTasks = tasks.filter(({ state }) => state === "VALIDATED")
  const notValidatedTasks = tasks.filter(({ state }) => state !== "VALIDATED")

  const sortedTasksArr = [
    ...notValidatedTasks.sort(({ addedAt: a }, { addedAt: b }) => b - a),
    ...validatedTasks,
  ]

  return sortedTasksArr
}

const placeHolderProjectName = "_Nouveau Project"

type taskSubmited = {
  title: string
  projectId: string
  description?: string
  isImportant?: boolean
  isUrgent?: boolean
  project: string | "Inbox"
  owner?: string | null
  isDummy: boolean
}

function createNewTask(taskSubmited: taskSubmited): taskProps {
  return {
    addedAt: Date.now(),
    startedAt: null,
    finishedAt: null,
    validatedAt: null,
    rejectedAt: null,
    description: taskSubmited.description || "",
    id: nanoid(),
    isDummy: false,
    isImportant: taskSubmited.isImportant || false,
    isUrgent: taskSubmited.isUrgent || false,
    owner: taskSubmited.owner || null,
    project: taskSubmited.project,
    state: "PENDING",
    title: taskSubmited.title,
    projectId: taskSubmited.projectId,
  }
}

function createNewProject(
  projectName: string,
  owner: string | null
): projectProps {
  return {
    id: nanoid(),
    name: projectName,
    tasks: [],
    isDummy: false,
    isExpanded: true,
    owner: owner || null,
  }
}

function sortProjects(projects: projectProps[]): projectProps[] {
  projects = [...projects].sort(({ name: a }, { name: b }) =>
    a.localeCompare(b)
  )
  return projects
}

export {
  sortProjects,
  sortTasks,
  createNewTask,
  createNewProject,
  placeHolderProjectName,
}
