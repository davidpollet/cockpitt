import { Bill } from "./Bill"
import { addTax } from "./addTax"
import { calcBillSum } from "./calcBillSum"

type Turnovers = {
  coming: number
  current: number
}
export function getFilteredTurnovers(bills: Bill[] = []): Turnovers {
  const turnovers: Turnovers = {
    coming: 0,
    current: 0,
  }
  for (const bill of bills) {
    bill.cashedAt
      ? (turnovers.current =
          turnovers.current + addTax(calcBillSum(bill), bill.taxRate))
      : (turnovers.coming =
          turnovers.coming + addTax(calcBillSum(bill), bill.taxRate))
  }
  return turnovers
}
