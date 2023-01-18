import BillsFormAddNew from "@components/BillsFormAddNew"
import BillsList from "@components/BillsList"
import Turnovers from "@components/Turnovers"

function IncomesTracker() {
  return (
    <div className="lg:grid lg:grid-cols-[1fr_auto] xl:gap-4">
      <div className="lg:order-2">
        <Turnovers />
      </div>
      <div
        className="self-start rounded-md bg-white ring-2 ring-gray-300/10 dark:bg-violet-800 dark:ring-0"
        role="table"
      >
        <BillsFormAddNew />
        <BillsList />
      </div>
    </div>
  )
}

export default IncomesTracker
