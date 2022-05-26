import { billProps } from "utils/types/billProps"
import { nanoid } from "nanoid"

interface newBillProps {
  customer: string
  amount: number
  description: string
}

function createBill({
  customer,
  amount,
  description,
}: newBillProps): billProps {
  return {
    amount,
    customer,
    description,
    cashedAt: null,
    cashedAtMonth: null,
    cashedAtYear: null,
    createdAt: new Date().getTime(),
    id: nanoid(),
    remindedAt: [],
    sentAt: null,
    updatedAt: new Date().getTime(),
  }
}

export default createBill
