import { Task } from "./Task"

export type Project = {
  name: string
  isDummy: boolean
  ownerId: string | null
  tasks: Task[]
  id: string
  isExpanded: boolean
}
