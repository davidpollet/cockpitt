import { ObjectId } from "mongodb"
import { TaxRate } from "./addTax"

type Customer = {
  name: string
  adress: string
  siren: string
}

export type Service = {
  detail: string
  quantity: number
  price: number
  id: string
}

export type Bill = {
  _id?: ObjectId
  cashedAt: number | null
  createdAt: number
  customer: Customer
  description?: string
  id: string
  isDummy?: boolean
  number: number
  ownerId: string | null
  remindedAt: number[]
  sentAt: number | null
  services: Service[]
  taxRate: TaxRate
}
