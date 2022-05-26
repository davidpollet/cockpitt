import { FormEvent, useEffect, useRef, useState } from "react"
import { IconCheck, IconClose, IconPlus } from "@components/Icons.index"
import { useDispatch, useSelector } from "react-redux"

import FetchWrapper from "@helpers/FetchWrapper"
import Loading from "./Loading"
import { RootState } from "@store/store"
import { addNewBill } from "@store/features/incomeSlice"
import classNames from "classnames"
import createBill from "@helpers/createBill"
import isValidNumber from "@helpers/isValidNumber"
import toast from "react-hot-toast"
import { useWindowWidth } from "@react-hook/window-size"

const inputStyles = classNames([`input-text grow lg:min-w-0`])

const buttonSubmitClassName = classNames([
  "button is-filled relative w-full justify-center overflow-hidden bg-center",
  "<lg:mt-4 lg:ml-2 lg:w-auto lg:rounded-sm",
])

function BillsFormAddNew() {
  const dispatch = useDispatch()
  const user = useSelector((store: RootState) => store.user.data)

  const windowWidth = useWindowWidth()

  const billsApi = new FetchWrapper("/api/bills")

  const [isSmallScreen, setIsSmallScreen] = useState(true)
  const [formIsHidden, setFormIsHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmited, setIsSubmited] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const showToast = (message: string, type: "error" | "success" | "") => {
    type ? toast[type](message) : toast(message, { duration: 3000 })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    let { amount, customer, description } = form
    const isValidAmount = isValidNumber(amount.value)

    if (!isValidAmount) {
      return showToast("Le montant n'est pas valide", "error")
    }

    amount = parseFloat(amount.value.replace(",", "."))
    setIsLoading(true)

    const bill = createBill({
      amount,
      customer: customer.value,
      description: description.value,
    })

    if (user.id) {
      bill.owner = user.id
      await billsApi.post("/", bill).then((res) => {
        if (res.ok) {
          dispatch(addNewBill(bill))
          setIsSubmited(true)
        } else {
          showToast(
            "La facture n'a pas pu être envoyé à la base de donnée. Réessayez s'il vous plait",
            "error"
          )
        }
      })
    } else {
      dispatch(addNewBill(bill))
      setIsSubmited(true)
    }

    setIsLoading(false)
    form.reset()
  }

  useEffect(() => {
    if (!formIsHidden) {
      const waitforFocus = setTimeout(() => {
        firstInputRef?.current?.focus()
      }, 0)
      return () => clearTimeout(waitforFocus)
    }
  }, [formIsHidden])

  useEffect(() => {
    setIsSmallScreen(windowWidth < 1024)
    setFormIsHidden(windowWidth < 1024)
  }, [windowWidth])

  useEffect(() => {
    const submitedFeedback = setTimeout(() => {
      setIsSubmited(false)
    }, 1000)
    return () => clearTimeout(submitedFeedback)
  }, [isSubmited])

  return (
    <div className="flex flex-col p-2" role="row">
      <button
        className="button is-filled mx-auto gap-1 dark:text-white lg:hidden"
        hidden={isSmallScreen && !formIsHidden}
        onClick={() => setFormIsHidden(false)}
      >
        Ajouter une facture
        <IconPlus />
      </button>
      <form
        className={`xl:grid-cols-bills grid gap-2 lg:grid-cols-[25ch_15ch_1fr_4em]`}
        onSubmit={handleSubmit}
        hidden={isSmallScreen && formIsHidden}
      >
        <button
          className="button is-ghost ml-auto dark:text-violet-100 lg:hidden"
          onClick={() => setFormIsHidden(true)}
        >
          <IconClose />
        </button>
        <div className="flex flex-wrap" role="cell">
          <label
            htmlFor="customer"
            className="min-w-[12ch] p-1 dark:text-violet-100"
          >
            Client
          </label>
          <input
            type="text"
            id="customer"
            placeholder="Google"
            required
            name="customer"
            aria-label="client"
            ref={firstInputRef}
            className={inputStyles}
          />
        </div>
        <div className="flex flex-wrap lg:grid lg:text-right" role="cell">
          <label
            htmlFor="amount"
            className="min-w-[12ch] p-1 dark:text-violet-100"
          >
            Montant
          </label>
          <input
            type="text"
            aria-label="montant"
            id="amount"
            placeholder="1250"
            inputMode="decimal"
            required
            className={`${inputStyles} lg:text-right`}
            name="amount"
          />
        </div>
        <div className="flex flex-wrap lg:col-span-2 xl:col-span-3" role="cell">
          <label
            htmlFor="description"
            className="min-w-[12ch] p-1 dark:text-violet-100 lg:w-full lg:px-0"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Détails de votre projet"
            aria-label="description"
            name="description"
            rows={1}
            className={`${inputStyles} resize-none`}
            style={{ scrollbarWidth: "none" }}
          />
          <button
            type="submit"
            className={buttonSubmitClassName}
            disabled={isLoading}
          >
            <IconPlus
              className={`${
                isLoading || isSubmited
                  ? "translate-y-3 scale-0"
                  : "scale-1 translate-y-0"
              } transition-all`}
            />
            <Loading
              size={24}
              color="stroke-white"
              className={`absolute transition-all ${
                isLoading ? "scale-1 translate-y-0" : "translate-y-3 scale-0"
              }`}
            />
            <IconCheck
              className={`absolute text-2xl transition-all ${
                !isSubmited && "translate-y-3 scale-0 opacity-0"
              }`}
            />
            <span className={`lg:sr-only ${isSubmited && "opacity-0"}`}>
              Ajouter
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default BillsFormAddNew
