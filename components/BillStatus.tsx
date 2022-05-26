import {
  IconCashed,
  IconCheck,
  IconExclamation,
  IconPaperPlane,
  IconRepeat,
} from "./Icons.index"
import { useDispatch, useSelector } from "react-redux"

import FetchWrapper from "@helpers/FetchWrapper"
import { RootState } from "@store/store"
import { billProps } from "@localTypes/billProps"
import classnames from "classnames"
import getRelativeTime from "@helpers/getRelativeTime"
import time from "@helpers/dateHelpers"
import toast from "react-hot-toast"
import { updateBill } from "@store/features/incomeSlice"

function BillStatus({ bill }: { bill: billProps }) {
  const user = useSelector((state: RootState) => state.user.data)
  const dispatch = useDispatch()
  const billsApi = new FetchWrapper("/api/bills")
  const showToast = (message: string, type: "error" | "success" | "") => {
    type ? toast[type](message) : toast(message, { duration: 3000 })
  }

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
    const savedBill = bill
    const updatedBill = {
      ...bill,
      sentAt,
      cashedAt,
      [property]: value,
      updatedAt: todayTime,
    }

    dispatch(updateBill(updatedBill))
    if (user.id) {
      billsApi.put(`/${bill.id}`, updatedBill).then(async (response) => {
        if (!response.ok) {
          await response.text().then((text) => {
            const { message } = JSON.parse(text)
            dispatch(updateBill(savedBill))
            showToast(message, "error")
          })
        }
      })
    }
  }

  function handleMarkAsReminded() {
    const todayTime = new Date().getTime()
    const remindedAt = [todayTime, ...bill.remindedAt]
    dispatch(updateBill({ ...bill, remindedAt, updatedAt: todayTime }))
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
            className="button is-filled bg-violet-25 from-violet-500 to-violet-500 text-violet-500"
            onClick={handleMarkAsReminded}
            hidden={!isLate}
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
