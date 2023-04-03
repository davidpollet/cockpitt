import { Customer } from "./Customer"
import { Society } from "./Society"
import { TaxRate } from "../income-tracker/addTax"

export type User = {
  email: string
  id: string
  image: string
  name: string
  customers: Customer[]
  society: Society
  lastBillNumber: number
  iban: string
  bic: string
  showPaymentInformation: boolean
  accentColor: string
  taxRate: TaxRate
}
