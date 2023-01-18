import { billProps } from "utils/types/billProps"

function turnoverFiltered(
  billsArray: billProps[],
  filterBy: "NOT CASHED" | "CASHED"
) {
  if (filterBy === "CASHED") {
    return billsArray
      .filter((bill) => bill.cashedAt)
      .reduce((acc, bill) => acc + bill.amount, 0)
  } else {
    return billsArray
      .filter((bill) => !bill.cashedAt)
      .reduce((acc, bill) => acc + bill.amount, 0)
  }
}

export default turnoverFiltered
