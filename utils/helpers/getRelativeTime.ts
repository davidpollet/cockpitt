import { billProps } from "utils/types/billProps"
import time from "./dateHelpers"

function getRelativeTime(bill: billProps) {
  if (bill.cashedAt) return relativeDateExp("Encaissée", bill.cashedAt)
  if (bill.sentAt && !bill.remindedAt[0])
    return relativeDateExp("Envoyée", bill.sentAt)
  if (bill.remindedAt[0]) return relativeDateExp("Relancée", bill.remindedAt[0])
  return relativeDateExp("Créée", bill.createdAt)
}

const relativeDateExp = (expression: string, TimeValue: number) => {
  const isToday = time(TimeValue).isToday()
  const isYesterday = time(TimeValue).isYesterday()
  const diff = time().diff(TimeValue, "days")

  if (isToday) return `${expression} aujourd'hui`
  else if (isYesterday) return `${expression} hier`
  else return `${expression} il y a ${diff} jours`
}

export default getRelativeTime
