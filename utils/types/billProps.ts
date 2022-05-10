export type billProps = {
  amount: number
  cashedAt: number | null
  cashedAtMonth: number | null
  cashedAtYear: number | null
  createdAt: number
  customer: string
  description?: string
  id: string
  isDummy?: boolean
  remindedAt: number[]
  sentAt: number | null
  updatedAt: number | null
}
