import React, {
  FormEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { useDispatch, useSelector } from "react-redux"

import { IconPlus } from "@components/Icons.index"
import addNewBill from "@helpers/addNewBill"
import { createBill } from "@store/features/billsSlice"
import { useWindowWidth } from "@react-hook/window-size"

const inputStyles =
  "grow px-4 py-2 bg-gray-200 hover:bg-gray-100 rounded-sm outline-none ring-transparent transition-all duration-100 ease-in focus:ring ring-offset-1 focus-ring-offset-2 focus:ring-violet-100 focus:ring-violet-100 text-gray-600 bg-white dark:bg-violet-900/40 lg:min-w-0"

function BillsFormAddNew() {
  const dispatch = useDispatch()

  const windowWidth = useWindowWidth()

  const [isSmallScreen, setIsSmallScreen] = useState(true)
  const [formIsHidden, setFormIsHidden] = useState(true)
  const firstInputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const { amount, customer, description } = form

    const bill = addNewBill({
      amount: parseFloat(amount.value.replace(",", ".")),
      customer: customer.value,
      description: description.value,
    })

    dispatch(createBill(bill))
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

  return (
    <div className="flex flex-col p-2" role="row">
      <button
        className="button is-outline ml-auto gap-1 lg:hidden"
        hidden={isSmallScreen && !formIsHidden}
        onClick={() => setFormIsHidden(false)}
      >
        Ajouter une facture
        <IconPlus />
      </button>
      <form
        className={`lg:grid-cols-bills grid gap-2`}
        onSubmit={handleSubmit}
        hidden={isSmallScreen && formIsHidden}
      >
        <button
          className="button is-ghost ml-auto lg:hidden"
          onClick={() => setFormIsHidden(true)}
        >
          X
        </button>
        <div className="flex flex-wrap" role="cell">
          <label htmlFor="customer" className="min-w-[12ch] p-1 lg:sr-only">
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
        <div className="flex flex-wrap" role="cell">
          <label htmlFor="amount" className="min-w-[12ch] p-1 lg:sr-only">
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
          <label htmlFor="customer" className="min-w-[12ch] p-1 lg:sr-only">
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
            className="button is-filled mt-2 w-full justify-center bg-center lg:mt-0 lg:ml-2 lg:w-auto lg:rounded-sm"
          >
            <IconPlus />
            <span className="lg:sr-only">Ajouter</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default BillsFormAddNew
