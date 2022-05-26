import { IconTurnover, IncomesPending } from "./Icons.index"
import { SVGProps, useEffect, useState } from "react"

import { RootState } from "@store/store"
import animateNumber from "@helpers/animateNumbers"
import formatAmount from "@helpers/formatAmount"
import { useSelector } from "react-redux"

function Turnover({
  icon,
  label,
  turnover,
}: {
  icon: SVGProps<SVGElement>
  label: "Chiffres d'affaires" | "À venir"
  turnover: number
}): JSX.Element {
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

function Turnovers() {
  const turnovers = useSelector(
    (store: RootState): { coming: number; current: number } =>
      store.income.turnovers
  )
  const [turnoverCurrent, setTurnoverCurrent] = useState(turnovers.current)
  const [turnoverComing, setTurnoverComing] = useState(turnovers.coming)

  useEffect(() => {
    const animateTurnoverCurrent = animateNumber(
      setTurnoverCurrent,
      turnoverCurrent,
      turnovers.current
    )
    const animateTurnoverComing = animateNumber(
      setTurnoverComing,
      turnoverComing,
      turnovers.coming
    )

    return () => {
      cancelAnimationFrame(animateTurnoverCurrent)
      cancelAnimationFrame(animateTurnoverComing)
    }
  }, [turnovers]) // eslint-disable-line react-hooks/exhaustive-deps

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
