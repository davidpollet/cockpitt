export type Task = {
  addedAt: number
  startedAt: number | null
  finishedAt: number | null
  validatedAt: boolean | null
  rejectedAt: boolean | null
  description?: string
  id: string
  isDummy: boolean
  isImportant: boolean
  isUrgent: boolean
  ownerId: string | null
  projectName: string
  projectId: string
  state: "PENDING" | "STARTED" | "DONE" | "REJECTED" | "VALIDATED"
  title: string
}
