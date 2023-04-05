import { Bill } from "../Bill"
import { FormData } from "./BillFormData"
import { IconErrorCircle } from "src/ui/icons/ErrorCircle"
import { User } from "src/features/user-auth/User"
import { generatePdfFromComponent } from "src/lib/utils/generatePdfFromComponent"
import { getPdfBillName } from "src/lib/utils/getPdfBillName"
import { useBillFormContext } from "./billFormContext"

export function BillForm({ children }: { children: React.ReactNode }) {
  const { user, setIsDownloading, setInvalidNamesInputs, invalidNamesInputs, bill } =
    useBillFormContext()

  async function handleFormSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setIsDownloading(true)
    const userBill = { ...(user as User) }
    const userLogoIsSVG = userBill.society?.logo?.endsWith("svg")
    if (userLogoIsSVG)
      userBill.society.logo = userBill?.society.logo?.replace(".svg", ".png")

    const BillPdf = (await import("../BillPdf")).default
    await generatePdfFromComponent(
      <BillPdf user={userBill as User} bill={bill as Bill} />,
      getPdfBillName(bill as Bill),
    ).then(() => setIsDownloading(false))
  }

  function handleFormInvalid(e: React.InvalidEvent<HTMLFormElement>) {
    e.preventDefault()
    setInvalidNamesInputs([
      ...invalidNamesInputs.filter((n) => n !== e.target.name),
      e.target.name,
    ])
  }

  function handleFormChange(e: React.ChangeEvent<HTMLFormElement>) {
    const targetEl = e.target
    const targetName = e.target.name as FormData
    const inputWasInvalid =
      invalidNamesInputs.includes(targetName) && targetEl.checkValidity()

    if (inputWasInvalid) {
      setInvalidNamesInputs(invalidNamesInputs.filter((n) => n !== targetName))
    }
  }
  return (
    <form
      className="mt-2 py-2 lining-nums"
      onSubmit={handleFormSubmit}
      onChange={handleFormChange}
      onInvalid={handleFormInvalid}
    >
      {invalidNamesInputs.length > 0 && (
        <div className="sticky top-1 z-10 mb-2 flex items-center gap-1 rounded bg-red-100 p-1 font-sans text-red-500">
          <IconErrorCircle className="h-6 w-6" />{" "}
          {invalidNamesInputs.length === 1
            ? `${invalidNamesInputs.length} erreur présente`
            : `${invalidNamesInputs.length} erreurs présentes`}
        </div>
      )}
      {children}
    </form>
  )
}
