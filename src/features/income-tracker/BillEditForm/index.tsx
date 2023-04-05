import { DialogMain, DialogOverlay } from "src/ui/Dialog"

import { Bill } from "../Bill"
import { BillCustomer } from "./BillCustomer"
import { BillDownload } from "./BillDownload"
import { BillForm } from "./BillForm"
import { BillHeader } from "./BillHeader"
import { BillInfos } from "./BillInfos"
import { BillLogo } from "./BillLogo"
import { BillPayment } from "./BillPayment"
import { BillServices } from "./BillServices"
import { BillSums } from "./BillSums"
import { ColorAccentSetter } from "./ColorAccentSetter"
import { DEFAULT_ACCENT_COLOR } from "src/features/user-auth/defaultUser"
import { Dialog } from "@headlessui/react"
import { FormContext } from "./billFormContext"
import { IconClose } from "src/ui/icons/Close"
import { IconErrorCircle } from "src/ui/icons/ErrorCircle"
import React from "react"
import { billEditMotionOptions } from "./BillMotionOptions"
import { useBill } from "../useBill"
import { useDebounce } from "react-use"
import { useFocusFirstEmptyInput } from "src/lib/hooks/useFocusFirstEmptyInput"
import { useFormModalBill } from "../IncomesTracker"
import { useOpenedBill } from "./useOpenedBill"
import { useUser } from "src/features/user-auth/useUser"

const DEBOUNCE_MS = 400

export const billFormInputStyle =
  "rounded-sm py-0 px-1 text-gray-600 outline-none ring-offset-1 transition duration-100 ease-in hover:bg-black/5 focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"

export function BillFormLegend(props: React.ComponentPropsWithoutRef<"legend">) {
  return <legend className={`${props.className} font-sans`}>{props.children}</legend>
}

export function BillFormErrorHint({ message }: { message: string }) {
  return (
    <span className="flex items-center font-sans text-sm text-red-500">
      <IconErrorCircle className="h-4 w-4" />
      {message}
    </span>
  )
}

function CloseModalButton() {
  const { closeBillForm } = useFormModalBill()

  return (
    <button
      onClick={closeBillForm}
      className="button is-ghost absolute top-2 right-2 z-20 ml-auto from-violet-500 to-violet-500 p-2"
    >
      <IconClose />
    </button>
  )
}

export default function BillEditForm() {
  const { openedBill } = useOpenedBill()
  const { updateBill, isUpdating: billIsUpdating } = useBill(openedBill?.id || "")
  const [bill, setBill] = React.useState(openedBill as Bill)

  const { user: userHook, updateUser, isUpdating: userIsUpdating, dummyUser } = useUser()
  const [user, setUser] = React.useState(openedBill?.isDummy ? dummyUser : userHook)

  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [invalidNamesInputs, setInvalidNamesInputs] = React.useState<string[]>([])

  const { closeBillForm } = useFormModalBill()

  const contextValue = {
    bill,
    invalidNamesInputs,
    isDownloading,
    isUpdating,
    setBill,
    setUser,
    user,
    setIsDownloading,
    setInvalidNamesInputs,
  }

  useFocusFirstEmptyInput()

  React.useEffect(() => {
    if (!bill && openedBill) {
      setBill(openedBill)
    }
  }, [openedBill, bill, setBill])

  useDebounce(() => typeof user !== "undefined" && updateUser(user), DEBOUNCE_MS, [user])
  useDebounce(() => typeof bill !== "undefined" && updateBill(bill), DEBOUNCE_MS, [bill])

  React.useEffect(() => {
    setIsUpdating(billIsUpdating)
  }, [billIsUpdating])

  React.useEffect(() => {
    setIsUpdating(userIsUpdating)
  }, [userIsUpdating])

  return (
    <Dialog
      open={true}
      onClose={closeBillForm}
      className="fixed inset-0 z-50 overflow-auto"
    >
      <DialogOverlay />
      <div className="flex min-h-screen flex-col pt-4">
        <DialogMain
          {...billEditMotionOptions}
          className="m-w-xs relative z-10 mx-auto w-11/12 max-w-4xl grow gap-2 bg-white px-4 pt-4 pb-20 font-serif text-gray-500 shadow-2xl sm:px-8"
        >
          <CloseModalButton />
          <FormContext.Provider value={contextValue}>
            <BillForm>
              <ColorAccentSetter />
              <BillLogo />
              <BillHeader />
              <hr
                className="mx-auto my-6 h-[2px] w-8"
                style={{
                  backgroundColor: user.accentColor || DEFAULT_ACCENT_COLOR,
                }}
              />
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-8">
                <BillInfos />
                <BillCustomer />
              </div>
              <BillServices />
              <div className="mt grid gap-2 sm:grid-cols-2 sm:items-start">
                <BillPayment />
                <BillSums />
              </div>
              <BillDownload />
            </BillForm>
          </FormContext.Provider>
        </DialogMain>
      </div>
    </Dialog>
  )
}
