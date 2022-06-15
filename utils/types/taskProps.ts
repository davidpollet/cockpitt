export type taskProps = {
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
  owner: string | null
  project: string | "Inbox"
  projectId: string
  state: "PENDING" | "STARTED" | "DONE" | "REJECTED" | "VALIDATED"
  title: string
}
