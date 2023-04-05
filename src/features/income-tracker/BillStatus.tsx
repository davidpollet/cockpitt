import { Bill } from "./Bill"
import { IconCashed } from "src/ui/icons/Cashed"
import { IconCheck } from "src/ui/icons/Check"
import { IconExclamation } from "src/ui/icons/Exclamation"
import { IconPaperPlane } from "src/ui/icons/PaperPlane"
import { IconRepeat } from "src/ui/icons/Repeat"
import cn from "classnames"
import { getStatusLabel } from "./getStatusLabel"
import time from "src/lib/utils/dateHelpers"
import { useBill } from "./useBill"

type Status = keyof Pick<Bill, "cashedAt" | "sentAt">

export function BillStatus({ bill }: { bill: Bill }) {
  const { updateBill } = useBill(bill.id)

  const isLate =
    !bill.cashedAt &&
    (bill.remindedAt[0]
      ? time().diff(bill.remindedAt[0], "days") > 8
      : time().diff(bill.sentAt, "days") > 8)

  function handleCheckStepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const todayTime = new Date().getTime()
    const property: Status = e.target.id.match("sentAt|cashedAt")?.at(0) as Status
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
    time().diff(bill.sentAt, "days") > 1 || time().diff(bill.remindedAt[0], "days") > 1

  return (
    <div className={`flex text-sm`}>
      <div className="flex grow flex-wrap items-center gap-x-2 gap-y-1 dark:text-violet-100 xl:order-1 xl:justify-start">
        <p>{getStatusLabel(bill)}</p>
        {isLate && (
          <button
            className={`
            ${!isLate && "hidden"}
            button is-filled bg-violet-25 from-violet-500 to-violet-500 p-1 text-violet-500 dark:bg-violet-100 dark:text-violet-700 dark:hocus:text-violet-100`}
            onClick={() => {
              if (confirm("Marqué la facture comme relancée ?")) {
                handleMarkAsReminded()
              }
            }}
          >
            Relancée ?
          </button>
        )}
      </div>
      <label
        htmlFor={`${bill.id}-sentAt`}
        className={`${cn("bill-step step-sent", {
          "is-fullfilled": bill.sentAt,
          "is-late": isLate,
          "is-disabled": stepIsDisabled,
        })}`}
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
        className={`${cn("bill-step", "step-cashed", {
          "is-fullfilled": bill.cashedAt,
          "is-disabled": time().diff(bill.cashedAt, "days") > 1,
        })} step-cashed`}
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
