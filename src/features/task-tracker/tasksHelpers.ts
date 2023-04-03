import { Project } from "./Project"
import { Task } from "./Task"
import { nanoid } from "nanoid"

export function sortTasks(tasks: Task[]) {
  const order: Task["state"][] = [
    "REJECTED",
    "DONE",
    "STARTED",
    "PENDING",
    "VALIDATED",
  ]
  const sortedTasks = tasks.sort((task1, task2) => {
    return order.indexOf(task1.state) - order.indexOf(task2.state)
  })
  return sortedTasks
}

export const NEW_PROJECT_PLACEHOLDER_NAME = "_Nouveau Project"

type taskSubmited = {
  title: string
  projectId: string
  description?: string
  isImportant?: boolean
  isUrgent?: boolean
  projectName: string
  owner?: string
  isDummy: boolean
}

export function createNewTask(taskSubmited: taskSubmited): Task {
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
    ownerId: taskSubmited.owner || null,
    projectName: taskSubmited.projectName,
    state: "PENDING",
    title: taskSubmited.title,
    projectId: taskSubmited.projectId,
  }
}

export function createNewProject(
  projectName: string,
  ownerId: string,
): Project {
  return {
    id: nanoid(),
    name: projectName,
    tasks: [],
    isDummy: false,
    isExpanded: true,
    ownerId: ownerId,
  }
}

export function sortProjects(projects: Project[]): Project[] {
  projects = [...projects].sort(({ name: a }, { name: b }) =>
    a.localeCompare(b),
  )
  return projects
}
