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
import styles from "./BillStatus.module.scss"
import time from "@helpers/dateHelpers"
import { updateBill } from "@store/features/billsSlice"
import { useDispatch } from "react-redux"

function BillStatus({ bill }: { bill: billProps }) {
  const dispatch = useDispatch()
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

    dispatch(updateBill(updatedBill))
  }

  function handleMarkAsReminded() {
    const todayTime = new Date().getTime()
    const remindedAt = [todayTime, ...bill.remindedAt]
    dispatch(updateBill({ ...bill, remindedAt, updatedAt: todayTime }))
  }

  const stepIsDisabled =
    time().diff(bill.sentAt, "days") > 1 ||
    time().diff(bill.remindedAt[0], "days") > 1

  const stepSentClassNames = classnames(styles.step, styles.sent, {
    [styles["is-fullfilled"]]: bill.sentAt,
    [styles["is-late"]]: isLate,
    [styles["is-disabled"]]: stepIsDisabled,
  })

  const stepCashedClassNames = classnames(styles.step, styles.cashed, {
    [styles["is-fullfilled"]]: bill.cashedAt,
    [styles["is-disabled"]]: time().diff(bill.cashedAt, "days") > 1,
  })

  return (
    <div className={`flex items-center text-sm`}>
      <label
        htmlFor={`${bill.id}-sentAt`}
        className={`${stepSentClassNames} ${styles["step-sent"]}`}
      >
        <span className={styles["step-icon"]} aria-hidden>
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
        <span className={styles["step-fake-checkbox"]} aria-hidden>
          {isLate && <IconExclamation />}
          {!isLate && bill.remindedAt[0] && !bill.cashedAt && <IconRepeat />}
          {((!isLate && !bill.remindedAt[0]) || bill.cashedAt) && <IconCheck />}
        </span>
        <span className="leading-none">Envoyée</span>
      </label>

      <label
        htmlFor={`${bill.id}-cashedAt`}
        className={`${stepCashedClassNames} ${styles["step-cashed"]}`}
      >
        <span className={styles["step-icon"]} aria-hidden>
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
        <span className={styles["step-fake-checkbox"]} aria-hidden>
          <IconCheck />
        </span>
        <span className="leading-none">Encaissée</span>
      </label>

      <div className="flex flex-wrap items-center gap-2 px-2">
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
    </div>
  )
}

export default BillStatus
