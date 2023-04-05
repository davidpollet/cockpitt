import { Customer } from "./Customer"
import { Society } from "./Society"
import { TaxRate } from "../income-tracker/addTax"

export type User = {
  accentColor: string
  bic: string
  customers: Customer[]
  email: string
  iban: string
  id: string
  image: string
  lastBillNumber: number
  name: string
  showPaymentInformation: boolean
  society: Society
  taxRate: TaxRate
}
