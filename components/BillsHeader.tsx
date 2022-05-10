import React, { useMemo } from "react"

import { RootState } from "@store/store"
import { billProps } from "@localTypes/billProps"
import classnames from "classnames"
import { useSelector } from "react-redux"
import { useWindowWidth } from "@react-hook/window-size"

const labels: ["Client", "Montant", "Details de la facture", "Statut"] = [
  "Client",
  "Montant",
  "Details de la facture",
  "Statut",
]

function Label({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode
  align?: "left" | "center" | "right"
  className?: string
}) {
  const classNames = classnames(
    className,
    `font-semibold text-violet-500 dark:text-violet-200/80 pt-1 pl-2`,
    {
      "text-right": align === "right",
    }
  )
  return (
    <div role="columnheader" className={classNames}>
      {children}
    </div>
  )
}

function BillsHeader() {
  const bills = useSelector(
    (store: RootState): billProps[] => store.income.bills
  )

  return (
    <div role="rowgroup">
      <div
        role="row"
        className="lg:grid-cols-bills <lg:hidden lg:grid lg:gap-2"
      >
        <Label>
          Client
          <span className="xl:hidden"> - Description</span>
        </Label>
        <Label align="right">Montant</Label>
        <Label className="<xl:hidden">Description</Label>
        <Label
          className={`${bills.length === 0 && "opacity-0"} transition-opacity`}
        >
          Statut
        </Label>
      </div>
    </div>
  )
}

export default BillsHeader
