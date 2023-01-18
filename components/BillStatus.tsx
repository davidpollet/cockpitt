import {
  IconCashed,
  IconCheck,
  IconExclamation,
  IconPaperPlane,
  IconRepeat,
} from "./Icons.index"

import { billProps } from "@localTypes/billProps"
import classnames from "classnames"
import getRelativeTime from "@helpers/getRelativeTime"
import time from "@helpers/dateHelpers"
import { useUpdateBill } from "@hooks/billsHooks"

function BillStatus({ bill }: { bill: billProps }) {
  const { updateBill } = useUpdateBill()

  const isLate =
    !bill.cashedAt &&
    (bill.remindedAt[0]
      ? time().diff(bill.remindedAt[0], "days") > 8
      : time().diff(bill.sentAt, "days") > 8)

  function handleCheckStepChange(e: any) {
    const todayTime = new Date().getTime()
    const [property]: ["sentAt" | "cashedAt"] =
      e.target.id.match("sentAt|cashedAt")
    let { sentAt, cashedAt } = bill
    if (property === "cashedAt" && !sentAt && !cashedAt) {
      sentAt = sentAt || todayTime
    }

    if (property === "sentAt" && sentAt && cashedAt) {
      cashedAt = null
    }

    const value = bill[property] ? null : todayTime

    const updatedBill = {
      ...bill,
      sentAt,
      cashedAt,
      [property]: value,
      updatedAt: todayTime,
    }

    updateBill(updatedBill)
  }

  function handleMarkAsReminded() {
    const todayTime = new Date().getTime()
    const remindedAt = [todayTime, ...bill.remindedAt]
    const updatedBill = { ...bill, remindedAt, updatedAt: todayTime }
    updateBill(updatedBill)
  }

  const stepIsDisabled =
    time().diff(bill.sentAt, "days") > 1 ||
    time().diff(bill.remindedAt[0], "days") > 1

  const stepSentClassNames = classnames("bill-step", "step-sent", {
    "is-fullfilled": bill.sentAt,
    "is-late": isLate,
    "is-disabled": stepIsDisabled,
  })

  const stepCashedClassNames = classnames("bill-step", "step-cashed", {
    "is-fullfilled": bill.cashedAt,
    "is-disabled": time().diff(bill.cashedAt, "days") > 1,
  })

  return (
    <div className={`flex items-center text-sm`}>
      <div className="xl flex grow flex-wrap items-center gap-2 px-2 dark:text-violet-100 md:justify-end md:px-4 lg:text-base xl:order-1 xl:justify-start">
        <p>{getRelativeTime(bill)}</p>
        {isLate && (
          <button
            className={`
            ${!isLate && "hidden"}
            button is-filled bg-violet-25 from-violet-500 to-violet-500 text-violet-500`}
            onClick={handleMarkAsReminded}
          >
            Relancée ?
          </button>
        )}
      </div>
      <label
        htmlFor={`${bill.id}-sentAt`}
        className={`${stepSentClassNames} step-sent`}
      >
        <span className={"step-icon"} aria-hidden>
          <IconPaperPlane />
        </span>
        <input
          type="checkbox"
          id={`${bill.id}-sentAt`}
          name={`${bill.id}-status`}
          checked={bill.sentAt ? true : false}
          className="sr-only"
          disabled={stepIsDisabled}
          onChange={handleCheckStepChange}
          title="Marqué comme envoyée"
        />
        <span className={`step-fake-checkbox`} aria-hidden>
          {isLate && <IconExclamation />}
          {!isLate && bill.remindedAt[0] && !bill.cashedAt && <IconRepeat />}
          {((!isLate && !bill.remindedAt[0]) || bill.cashedAt) && <IconCheck />}
        </span>
        <span className="leading-none">
          {bill.remindedAt.length > 0 ? "Relancée" : "Envoyée"}
        </span>
      </label>

      <label
        htmlFor={`${bill.id}-cashedAt`}
        className={`${stepCashedClassNames} step-cashed`}
      >
        <span className={"step-icon"} aria-hidden>
          <IconCashed />
        </span>
        <input
          type="checkbox"
          id={`${bill.id}-cashedAt`}
          name={`${bill.id}-status`}
          checked={bill.cashedAt ? true : false}
          className={"sr-only"}
          title="Marqué comme encaissée"
          onChange={handleCheckStepChange}
        />
        <span className={`step-fake-checkbox`} aria-hidden>
          <IconCheck />
        </span>
        <span className="leading-none">Encaissée</span>
      </label>
    </div>
  )
}

export default BillStatus
