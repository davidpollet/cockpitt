import { IconTurnover, IncomesPending } from "./Icons.index"

import React from "react"
import { RootState } from "@store/store"
import animateNumbers from "@helpers/animateNumbers"
import formatAmount from "@helpers/formatAmount"
import turnoverFiltered from "@helpers/turnoverFiltered"
import { useSelector } from "react-redux"

function Turnover({
  icon,
  label,
  turnover,
}: {
  icon: React.ReactElement
  label: "Chiffres d'affaires" | "À venir"
  turnover: number
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-sm p-2 text-right">
        <div className="flex justify-end text-3xl text-violet-300 dark:text-violet-100/70">
          {icon}
        </div>
        <h3 className="uppercase text-gray-600 dark:text-violet-100 <md:text-sm">
          {label}
        </h3>
        <p className="min-w-[11ch] text-2xl font-bold leading-none text-violet-500 dark:text-white md:text-3xl">
          {formatAmount(turnover)}
        </p>
      </div>
    </div>
  )
}

function useAnimateNumbers(n: number) {
  const ref = React.useRef(0)
  const [x, setX] = React.useState(0)
  if (ref.current !== n) {
    const memo = ref.current
    ref.current = n
    return animateNumbers(setX, memo, n)
  }

  return x
}

function Turnovers() {
  const bills = useSelector((state: RootState) => state.income.bills)
  const turnovers = {
    current: turnoverFiltered(bills, "CASHED"),
    coming: turnoverFiltered(bills, "NOT CASHED"),
  }

  const turnoverCurrent = useAnimateNumbers(turnovers.current)
  const turnoverComing = useAnimateNumbers(turnovers.coming)

  return (
    <div className="gap-4 <lg:flex <lg:justify-end lg:grid">
      <Turnover
        icon={<IncomesPending />}
        label={"À venir"}
        turnover={turnoverComing}
      />
      <Turnover
        icon={<IconTurnover />}
        label={"Chiffres d'affaires"}
        turnover={turnoverCurrent}
      />
    </div>
  )
}

export default Turnovers
