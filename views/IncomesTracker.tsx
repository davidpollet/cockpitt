import BillsFormAddNew from "@components/BillsFormAddNew"
import BillsHeader from "@components/BillsHeader"
import BillsList from "@components/BillsList"
import Turnovers from "@components/Turnovers"
import { useSelector } from "react-redux"
import { useState } from "react"

function IncomesTracker() {
  return (
    <div className="lg:grid lg:grid-cols-[1fr_auto] xl:gap-4">
      <div className="lg:order-2">
        <Turnovers />
      </div>
      <div
        className="dark:text-current-50 self-start rounded-md bg-white ring-2 ring-gray-300/10 dark:bg-violet-850 dark:ring-violet-800"
        role="table"
      >
        <BillsHeader />
        <BillsFormAddNew />
        <BillsList />
      </div>
    </div>
  )
}

export default IncomesTracker
