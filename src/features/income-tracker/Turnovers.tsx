import { IconCardCheckList } from "src/ui/icons/CardCheckList"
import { IconPending } from "src/ui/icons/Pending"
import React from "react"
import { formatAmount } from "src/lib/utils/formatAmount"
import { getFilteredTurnovers } from "./getFilteredTurnovers"
import { useAnimateNumber } from "src/lib/hooks/useAnimateNumbers"
import { useBills } from "./useBills"

export function Turnovers() {
  const { bills } = useBills()
  const turnovers = getFilteredTurnovers(bills)

  return (
    <div className="gap-4 <lg:flex <lg:justify-end lg:grid">
      <Turnover
        icon={<IconPending />}
        label={"À venir"}
        turnover={turnovers.coming}
      />
      <Turnover
        icon={<IconCardCheckList />}
        label={"Chiffres d'affaires"}
        turnover={turnovers.current}
      />
    </div>
  )
}

function Turnover({
  icon,
  label,
  turnover,
}: {
  icon: React.ReactElement
  label: "Chiffres d'affaires" | "À venir"
  turnover: number
}) {
  const animatedTurnover = useAnimateNumber(turnover)

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
          {formatAmount(animatedTurnover)}
        </p>
      </div>
    </div>
  )
}
