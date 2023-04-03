import time from "./dateHelpers"

export const getRelativeTimeDate = (n: number): number =>
  time().add(n, "day").toDate().getTime()

export const getRelativeDateLabel = (expression: string, timeValue: number) => {
  const isToday = time(timeValue).isToday()
  const isYesterday = time(timeValue).isYesterday()
  const diff = time().diff(timeValue, "days")

  if (isToday) return `${expression} aujourd'hui`
  else if (isYesterday) return `${expression} hier`
  else return `${expression} il y a ${diff} jours`
}
