/* eslint-disable @next/next/no-img-element */

import { Bill, Service } from "./Bill"
import { Dialog, Listbox, Popover } from "@headlessui/react"
import { addTax, taxRates } from "./addTax"
import { formatAmount, formatPercent } from "src/lib/utils/formatAmount"
import { useDebounce, useToggle } from "react-use"

import { Customer } from "../user-auth/Customer"
import { DEFAULT_ACCENT_COLOR } from "../user-auth/defaultUser"
import { HexColorPicker } from "react-colorful"
import { IconChevronDown } from "src/ui/icons/ChevronDown"
import { IconClose } from "../../ui/icons/Close"
import { IconErrorCircle } from "src/ui/icons/ErrorCircle"
import { IconImageUpload } from "src/ui/icons/ImageUpload"
import { IconPlus } from "src/ui/icons/Plus"
import { IconTrashOutline } from "src/ui/icons/Trash"
import { IconVisibilityOff } from "src/ui/icons/VisibilityOff"
import { IconVisibilityOn } from "src/ui/icons/VisibilityOn"
import { InputAutoWidth } from "../../ui/InputAutoWidth"
import { REGEX_BIC } from "src/lib/regex/bic"
import { REGEX_COLOR_HEX } from "src/lib/regex/color"
import { REGEX_EMAIL } from "src/lib/regex/email"
import { REGEX_IBAN } from "src/lib/regex/iban"
import { REGEX_PHONE } from "src/lib/regex/phone"
import { REGEX_SIREN } from "src/lib/regex/siren"
import React from "react"
import { Society } from "../user-auth/Society"
import Spinner from "../../ui/Spinner"
import { User } from "../user-auth/User"
import { calcBillSum } from "./calcBillSum"
import { dummyUser } from "../user-auth/dummyUser"
import { generatePdfFromComponent } from "src/lib/utils/generatePdfFromComponent"
import { getPdfBillName } from "src/lib/utils/getPdfBillName"
import { getRelativeTimeDate } from "src/lib/utils/getRelativeTime"
import { motion } from "framer-motion"
import { nanoid } from "nanoid"
import parseString from "src/lib/utils/parseStringAmount"
import { showToast } from "src/lib/utils/showToast"
import { uploadImageAndGetUrl } from "src/lib/utils/uploadImageAndGetUrl"
import { useBill } from "./useBill"
import { useBills } from "./useBills"
import { useFormModalBill } from "./IncomesTracker"
import { useUser } from "../user-auth/useUser"
import wait from "src/lib/utils/wait"

type InputInfos = keyof Pick<Bill, "number" | "description">

const customerLabelPlaceHolder = {
  adress: "Adresse de votre client",
  name: "Nom de votre client",
  siren: "123 456 789",
}

const DEBOUNCE_MS = 400

function useOpenedBill() {
  const { openedBillId } = useFormModalBill()
  const { bill: openedBill } = useBill(openedBillId)
  return { openedBill }
}

export function useUserByBillSource(bill: Bill | undefined) {
  const { user, dummyUser, localUser } = useUser()
  if (typeof bill === "undefined") return
  if (bill.isDummy) return dummyUser
  if (user?.email) return user
  return localUser
}

const inputStyle =
  "rounded-sm py-0 px-1 text-gray-600 outline-none ring-offset-1 transition duration-100 ease-in hover:bg-black/5 focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"

type FormContextProps = {
  isUpdating: boolean
  invalidNamesInputs: string[]
  user: User | undefined
  setUser: React.Dispatch<React.SetStateAction<User>>
  bill: Bill | undefined
  setBill: React.Dispatch<React.SetStateAction<Bill>>
  isDownloading: boolean
}
const FormContext = React.createContext<FormContextProps | null>(null)

function useFormContext(): FormContextProps {
  const formContext = React.useContext(FormContext)
  if (!formContext) {
    throw new Error(
      "useFormContext has to be used within <FormContext.Provider>",
    )
  }
  return formContext
}

function Legend(props: React.ComponentPropsWithoutRef<"legend">) {
  return (
    <legend className={`${props.className} font-sans`}>{props.children}</legend>
  )
}

function ErrorHint({ message }: { message: string }) {
  return (
    <span className="flex items-center font-sans text-sm text-red-500">
      <IconErrorCircle className="h-4 w-4" />
      {message}
    </span>
  )
}

enum FormData {
  userAccentColor = "userAccentColor",
  userBic = "userBic",
  userIban = "userIban",
  societyName = "societyName",
  userSocietyLogo = "userSocietyLogo",
  societyBaseline = "societyBaseline",
  societyAdress = "societyAdress",
  societyPhone = "societyPhone",
  societyEmail = "societyEmail",
  societySiren = "societySiren",
  customerName = "customerName",
  customerAdress = "customerAdress",
  customerSiren = "customerSiren",
  serviceDetails = "serviceDetails",
  serviceQuantity = "serviceQuantity",
  servicePrice = "servicePrice",
  billNumber = "billNumber",
}

export default function BillEditForm() {
  const { closeBillForm } = useFormModalBill()
  const { openedBill } = useOpenedBill()
  const { updateBill, isUpdating: billIsUpdating } = useBill(
    openedBill?.id || "",
  )
  const { updateUser, isUpdating: userIsUpdating } = useUser()
  const lastServiceRowRef = React.useRef<HTMLInputElement>(null)
  const customerInputRef = React.useRef<HTMLInputElement>(null)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [invalidNamesInputs, setInvalidNamesInputs] = React.useState<string[]>(
    [],
  )
  const { user: userHook } = useUser()
  const [user, setUser] = React.useState(
    openedBill?.isDummy ? dummyUser : userHook,
  )
  const [bill, setBill] = React.useState(openedBill as Bill)

  useDebounce(
    () => typeof user !== "undefined" && updateUser(user),
    DEBOUNCE_MS,
    [user],
  )
  useDebounce(
    () => typeof bill !== "undefined" && updateBill(bill),
    DEBOUNCE_MS,
    [bill],
  )

  React.useEffect(() => {
    setIsUpdating(billIsUpdating)
  }, [billIsUpdating])

  React.useEffect(() => {
    setIsUpdating(userIsUpdating)
  }, [userIsUpdating])

  async function handleFormSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setIsDownloading(true)
    const userBill = { ...user }
    const userLogoIsSVG = userBill?.society?.logo?.endsWith("svg")
    if (userLogoIsSVG)
      userBill.society.logo = userBill?.society.logo?.replace(".svg", ".png")

    const BillPdf = (await import("./BillPdf")).default
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
    <Dialog
      open={true}
      onClose={closeBillForm}
      className="fixed inset-0 z-50 overflow-auto"
      // initialFocus={bill?.customer.name ? lastServiceRowRef : customerInputRef}
    >
      <DialogOverlay />
      <div className="flex min-h-screen flex-col pt-4">
        <DialogMain>
          <button
            onClick={closeBillForm}
            className="button is-ghost absolute top-2 right-2 z-20 ml-auto from-violet-500 to-violet-500 p-2"
          >
            <IconClose />
          </button>
          <FormContext.Provider
            value={{
              bill,
              invalidNamesInputs,
              isDownloading,
              isUpdating,
              setBill,
              setUser,
              user,
            }}
          >
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
                <BillCustomer ref={customerInputRef} />
              </div>
              <BillItems ref={lastServiceRowRef} />
              <div className="mt grid gap-2 sm:grid-cols-2 sm:items-start">
                <BillPayment />
                <BillSums />
              </div>
              <BillDownload />
            </form>
          </FormContext.Provider>
        </DialogMain>
      </div>
    </Dialog>
  )
}

function DialogMain({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: "96px" }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          delay: 0.3,
          duration: 0.3,
          easings: [0.77, 0, 0.175, 1],
        },
        y: 0,
      }}
      exit={{
        filter: "blur(10px)",
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
      }}
      className="m-w-xs relative z-10 mx-auto w-11/12 max-w-4xl grow gap-2 bg-white px-4 pt-4 pb-20 font-serif text-gray-500 shadow-2xl sm:px-8"
    >
      {children}
    </motion.div>
  )
}

function DialogOverlay() {
  return (
    <Dialog.Overlay
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
      }}
      className="fixed inset-0 bg-gradient-to-tr from-violet-500/75 to-violet-300/75"
    />
  )
}

function ColorAccentSetter() {
  const { invalidNamesInputs, user, setUser } = useFormContext()
  const isValidColor = (c: string) => REGEX_COLOR_HEX.test(c)
  return (
    <div className="relative flex items-center justify-center pb-4">
      <Popover className="relative">
        <Popover.Button
          className={
            "block h-8 w-8 rounded-l border-none outline-none ring-2 ring-inset ring-black/10"
          }
          style={{ backgroundColor: user?.accentColor || DEFAULT_ACCENT_COLOR }}
          aria-label="Définir votre couleur d'accent"
        ></Popover.Button>

        <Popover.Panel className="absolute z-10">
          <HexColorPicker
            color={user?.accentColor || DEFAULT_ACCENT_COLOR}
            onChange={(accentColor) =>
              isValidColor(accentColor) &&
              setUser({ ...(user as User), accentColor })
            }
          />
        </Popover.Panel>
      </Popover>

      <label>
        <span className="sr-only">Couleur principal de votre entreprise</span>
        <input
          type="text"
          className={`${inputStyle} h-8 w-[9ch] rounded-l-none bg-none py-0`}
          placeholder="#bada55"
          onChange={({ currentTarget: { value: accentColor } }) =>
            isValidColor(accentColor) &&
            setUser({ ...(user as User), accentColor })
          }
          value={user?.accentColor || DEFAULT_ACCENT_COLOR}
          name={FormData.userAccentColor}
          pattern={`${REGEX_COLOR_HEX}`.replaceAll("/", "")}
        />
        {invalidNamesInputs.includes(FormData.userAccentColor) && (
          <ErrorHint message="La couleur n'est pas au format hexadecimal" />
        )}
      </label>
    </div>
  )
}

function BillLogo() {
  const { user } = useFormContext()
  return user?.society?.logo ? <Logo /> : <LogoUpload />
}

function Logo() {
  const logoRef = React.useRef<HTMLImageElement>(null)
  const { user, setUser } = useFormContext()

  function resetLogo() {
    const logo = logoRef.current as HTMLImageElement
    logo.classList.add("opacity-0", "scale-50")

    setUser({
      ...user,
      society: { ...user?.society, logo: "" } as Society,
    } as User)
  }

  function handleImageLoaded() {
    const logo = logoRef.current as HTMLImageElement
    logo.classList.remove("opacity-0", "scale-50")
  }

  return (
    <div className="mb-2 flex justify-center">
      <div className="relative h-11">
        <img
          src={user?.society.logo as string}
          onLoad={handleImageLoaded}
          alt="logo"
          ref={logoRef}
          height={44}
          className="h-11 w-auto scale-50 opacity-0 transition"
        />
        <button
          className="button is-ghost absolute left-full top-1/2 translate-x-2 -translate-y-1/2 p-2"
          onClick={resetLogo}
          type="button"
        >
          <IconTrashOutline />
        </button>
      </div>
    </div>
  )
}

function LogoUpload() {
  const { setUser, user } = useFormContext()
  const [showUploadLimitTip, setShowUploadLimitTip] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleUpdateLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget
    if (!files?.length) return
    const IMAGE_UPLOAD_LIMIT = 1_000_000 // 1mo en octet
    const newLogo = files[0]

    if (newLogo.size > IMAGE_UPLOAD_LIMIT) {
      showToast("Taille de l'image trop lourde", "error")
      setShowUploadLimitTip(true)
      return
    }

    try {
      setIsLoading(true)
      const logoUrl = await uploadImageAndGetUrl(newLogo)
      const newUser: User = {
        ...user,
        society: { ...user?.society, logo: logoUrl } as Society,
      } as User
      setUser(newUser)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="relative">
      <label
        className={`relative mx-auto mb-2 flex cursor-pointer flex-col items-center justify-center border-2 border-dotted border-gray-200 p-4 font-sans transition-all hover:border-violet-300  hover:text-violet-500 focus:border-violet-300 focus:text-violet-300 ${
          isLoading ? "scale-75 opacity-0" : null
        }`}
      >
        <IconImageUpload className="h-8 w-8" />
        <span className="font-bold uppercase">Votre logo</span>
        <span className="text-sm text-violet-500">
          Taille recommandée : au moins 64 &times; 64px
          <br /> Taille maximum: 1024 ko
        </span>
        <input
          type="file"
          name="logo"
          id="logo"
          className="sr-only"
          onChange={handleUpdateLogo}
          accept="image/*, image/svg+xml"
        />
      </label>
      {isLoading && (
        <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
      {showUploadLimitTip && (
        <div className="mx-auto -mt-2 flex w-fit min-w-0 items-center gap-1 bg-violet-50 p-1 text-center font-sans text-sm text-violet-500">
          💡 Redimentionnez votre image sur{" "}
          <a
            href="https://imageresizer.com/"
            target="blank"
            title="aller sur image resizer, ouvre un nouvel onglet"
          >
            imageresizer.com
          </a>
          <button
            className="button is-ghost p-1"
            onClick={() => setShowUploadLimitTip(false)}
            type="button"
          >
            <IconClose />
          </button>
        </div>
      )}
    </div>
  )
}

function BillHeader() {
  type HeaderInputs = keyof Omit<
    Society,
    "turnoverCurrent" | "turnoverComing" | "logo"
  >

  const { invalidNamesInputs, setUser, user } = useFormContext()

  function handleInputChange(type: HeaderInputs, value: string) {
    setUser({
      ...(user as User),
      society: {
        ...(user?.society as Society),
        [type]: value,
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 font-sans">
      <div className="flex items-center text-lg">
        <div className="relative">
          <label>
            <span className="sr-only">Nom de votre société</span>
            <InputAutoWidth
              type="text"
              className={`${inputStyle} font-bold text-black`}
              onChange={(e) => handleInputChange("name", e.currentTarget.value)}
              value={user?.society?.name}
              placeholder={"John Doe"}
              name={FormData.societyName}
              required
            />
            {invalidNamesInputs.includes(FormData.societyName) && (
              <ErrorHint message="Nom commercial obligatoire" />
            )}
          </label>
        </div>

        <hr
          aria-hidden
          className="mx-2 inline-block h-4 w-[1px] bg-gray-300 align-middle"
        />
        <label>
          <span className="sr-only">Slogan ou activité</span>
          <InputAutoWidth
            style={{ color: user?.accentColor || DEFAULT_ACCENT_COLOR }}
            className={inputStyle + "flex-shrink-0"}
            onChange={(e) =>
              handleInputChange("baseline", e.currentTarget.value)
            }
            value={user?.society?.baseline}
            placeholder={"Photographe de portrait"}
            name={FormData.societyBaseline}
          />
        </label>
      </div>
      <p className="flex gap-1">
        <label>
          <span className="sr-only">Téléphone</span>
          <InputAutoWidth
            inputMode="numeric"
            className={inputStyle}
            placeholder="06.12.34.56.78"
            value={user?.society?.phone}
            onChange={(e) => handleInputChange("phone", e.currentTarget.value)}
            name={FormData.societyPhone}
            pattern={`${REGEX_PHONE}`.replaceAll("/", "")}
          />
          {invalidNamesInputs.includes(FormData.societyPhone) && (
            <ErrorHint message="Le téléphone est incorrect" />
          )}
        </label>
        -
        <label>
          <span className="sr-only">Email</span>
          <InputAutoWidth
            type="email"
            className={inputStyle}
            placeholder="hey@johndoe.me"
            value={user?.society?.email}
            onChange={(e) => handleInputChange("email", e.currentTarget.value)}
            name={FormData.societyEmail}
            pattern={`${REGEX_EMAIL}`.replaceAll("/", "")}
          />
          {invalidNamesInputs.includes(FormData.societyEmail) && (
            <ErrorHint message="L'email est incorrect" />
          )}
        </label>
      </p>
      <label>
        <span className="sr-only">Adresse</span>
        <InputAutoWidth
          className={inputStyle}
          placeholder="144 rue des templiers, 59000 Lille"
          value={user?.society?.adress}
          onChange={(e) => handleInputChange("adress", e.currentTarget.value)}
          name={FormData.societyAdress}
          required
        />
        {invalidNamesInputs.includes(FormData.societyAdress) && (
          <ErrorHint message="L'adresse est requise" />
        )}
      </label>

      <label className={inputStyle}>
        SIREN :
        <InputAutoWidth
          className={inputStyle}
          placeholder="123 456 789"
          value={user?.society?.siren}
          onChange={(e) => handleInputChange("siren", e.currentTarget.value)}
          name={FormData.societySiren}
          pattern={`${REGEX_SIREN}`.replaceAll("/", "")}
          required
        />
        {invalidNamesInputs.includes(FormData.societySiren) && (
          <ErrorHint message="Le SIREN est requis et doit être de 9 chiffres" />
        )}
      </label>
    </div>
  )
}

function BillInfos() {
  const { bills } = useBills()
  const { invalidNamesInputs, bill, setBill } = useFormContext()
  const [billNumberErrorMessage, setBillNumberErrorMessage] = React.useState("")
  const billCreatedDate = Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  }).format(bill?.createdAt)
  function checkNumberHasError(value: string) {
    const isEmpty = value === ""
    const isNotNumber = isNaN(Number(value))
    return isEmpty || isNotNumber
  }

  function handleChangeInput(value: string, type: InputInfos) {
    if (!bill?.id) return
    if (type === "number") {
      const valueIsWrong = checkNumberHasError(value)
      if (valueIsWrong)
        return setBillNumberErrorMessage(
          "Le numéro de facture doit être un chiffre",
        )

      const numberExist = bills.some(
        (b) => b.number === Number(value) && b.id !== bill.id,
      )
      if (numberExist)
        return setBillNumberErrorMessage("Une facture avec ce numéro existe")
      setBill({ ...bill, number: Number(value) })
      setBillNumberErrorMessage("")
    } else if (type === "description") {
      setBill({ ...bill, description: value })
    } else {
      throw new Error("shoud not happen")
    }
  }

  return (
    <fieldset className="grid gap-1">
      <Legend className="contents">Votre facture</Legend>
      <label className="justify-self-start font-sans font-bold text-black">
        Facture N°
        <InputAutoWidth
          inputMode="numeric"
          className={`${inputStyle} text-[inherit]`}
          onChange={(e) => handleChangeInput(e.currentTarget.value, "number")}
          value={bill?.number}
          name={FormData.billNumber}
          required
          pattern="\d+"
        />
        {invalidNamesInputs.includes(FormData.billNumber) && (
          <ErrorHint message="Numéro de facture requis" />
        )}
        {billNumberErrorMessage && (
          <ErrorHint message={billNumberErrorMessage} />
        )}
      </label>
      <ul className="grid gap-1">
        <li>Date d'émission : {billCreatedDate || getRelativeTimeDate(0)}</li>
        <li>
          <label>
            <p className="flex items-baseline gap-2 font-sans">
              <span className="font-bold text-black">Description</span>{" "}
              <span className="text-sm">Invisible sur la facture</span>
            </p>
            <input
              type="text"
              className={`${inputStyle} mt-1 w-full bg-gray-100`}
              value={bill?.description}
              placeholder="Ex: refonte du site web"
              onChange={(e) =>
                handleChangeInput(e.currentTarget.value, "description")
              }
              name="bill_description"
            />
          </label>
        </li>
      </ul>
    </fieldset>
  )
}

const BillCustomer = React.forwardRef<HTMLInputElement>(function BillCustomer(
  _,
  ref,
) {
  const { invalidNamesInputs, setBill, bill, user } = useFormContext()

  function handleInputChange(type: keyof Customer, value: string) {
    setBill({
      ...(bill as Bill),
      customer: { ...bill?.customer, [type]: value } as Customer,
    })
  }

  return (
    <fieldset className="grid place-content-start gap-1 bg-gray-100 p-2">
      <Legend className="contents">Votre client</Legend>
      <label>
        <span className="sr-only">Nom du client :</span>
        <input
          ref={ref}
          className={`${inputStyle} bg-[transparent] font-sans font-bold text-black`}
          placeholder={customerLabelPlaceHolder.name}
          value={bill?.customer?.name}
          onChange={(e) => {
            if (!bill) return
            const inputValue = e.currentTarget.value
            const customer = user?.customers.find((c) => c.name === inputValue)
            if (customer) {
              setBill({
                ...bill,
                customer: {
                  adress: customer.adress,
                  name: inputValue,
                  siren: customer.siren,
                },
              })
              return
            }
            handleInputChange("name", e.currentTarget.value)
          }}
          name={FormData.customerName}
          list="customers"
          required
        />
        {invalidNamesInputs.includes(FormData.customerName) && (
          <ErrorHint message="Nom du client requis" />
        )}
      </label>
      <label>
        <span className="sr-only">Adresse du client</span>
        <input
          className={`${inputStyle} bg-[transparent]`}
          name={FormData.customerAdress}
          onChange={(e) => handleInputChange("adress", e.currentTarget.value)}
          placeholder={customerLabelPlaceHolder.adress}
          required
          type="tel"
          value={bill?.customer?.adress}
        />
        {invalidNamesInputs.includes(FormData.customerAdress) && (
          <ErrorHint message="Nom du client requis" />
        )}
      </label>
      <label>
        <span>SIREN :</span>
        <input
          className={`${inputStyle} bg-[transparent] lining-nums`}
          name={FormData.customerSiren}
          onChange={(e) => handleInputChange("siren", e.currentTarget.value)}
          pattern={`${REGEX_SIREN}`.replaceAll("/", "")}
          placeholder={customerLabelPlaceHolder.siren}
          required
          type="tel"
          value={bill?.customer?.siren}
        />
        {invalidNamesInputs.includes(FormData.customerSiren) && (
          <ErrorHint message="Le SIREN est requis et doit être de 9 chiffres" />
        )}
      </label>
    </fieldset>
  )
})

const BillItems = React.forwardRef<HTMLInputElement>(function BillItems(
  _,
  ref,
) {
  const { bill, setBill } = useFormContext()

  function addNewServiceRow() {
    if (!bill?.id) return
    const newRow: Service = {
      detail: "",
      id: nanoid(),
      price: 0,
      quantity: 1,
    }

    const billWithNewServiceRow: Bill = {
      ...bill,
      services: [...bill.services, newRow],
    }

    setBill(billWithNewServiceRow)
  }

  return (
    <div className="relative z-10 -ml-2 overflow-auto pl-2 <sm:-mr-4 sm:-mr-8 lg:mr-0">
      <table className="mt-8 w-full">
        <thead>
          <tr>
            <th className="min-w-[15ch] text-left font-sans text-black">
              Prestation
            </th>
            <th className="w-14 px-1 py-1 text-right font-sans text-black">
              <abbr title="quantity">Qté</abbr>
            </th>
            <th className="w-20 whitespace-nowrap px-1 py-1 text-right font-sans text-black">
              Prix Unitaire
            </th>
            <th className="w-28 whitespace-nowrap px-1 py-1 text-right font-sans text-black">
              Total HT
            </th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {bill?.services.map((row, index) => (
            <BillRow
              key={row.id}
              row={row}
              ref={index === bill.services.length - 1 ? ref : null}
            />
          ))}
        </tbody>
      </table>
      <hr />

      <button
        className="button is-ghost bg-w-0/h-full bg-left font-sans"
        onClick={addNewServiceRow}
        type="button"
      >
        <IconPlus /> Ajouter une ligne
      </button>
    </div>
  )
})

const BillRow = React.forwardRef<HTMLInputElement, { row: Service }>(
  function BillRow({ row }, ref) {
    const { invalidNamesInputs, setBill, bill } = useFormContext()
    const [showDeleteRow, setShowDeleteRow] = React.useState(false)
    const sum = row.price * row.quantity
    const deleteRowRef = React.useRef<HTMLTableCellElement>(null)

    React.useEffect(() => {
      async function toggleDeleteBox() {
        if (showDeleteRow) {
          deleteRowRef?.current?.classList.remove("hidden")
          deleteRowRef?.current?.classList.add("flex")
        }
        if (!showDeleteRow) {
          deleteRowRef?.current?.classList.add("hidding")
          await wait(1000)
          deleteRowRef?.current?.classList.add("hidden")
          deleteRowRef?.current?.classList.remove("hidding", "flex")
        }
      }
      toggleDeleteBox()
    }, [showDeleteRow])

    function removeRow() {
      if (typeof bill === "undefined") return null
      setBill({
        ...bill,
        services: bill?.services.filter((s) => s.id !== row.id),
      })
    }

    type BillInput = keyof Pick<
      Bill["services"][number],
      "quantity" | "price" | "detail"
    >

    function handleChange(type: BillInput, value: string) {
      if (typeof bill === "undefined") return
      const updatedRow: Service = {
        ...row,
      }

      switch (type) {
        case "detail":
          if (value.trim().length === 0) return
          updatedRow.detail = value
          break
        case "price":
          updatedRow.price = parseString(value)
          break
        case "quantity": {
          const parsedQty = Number(value)
          if (isNaN(parsedQty) || parsedQty < 1) {
            return
          } else {
            updatedRow.quantity = parseString(value)
            break
          }
        }

        default: {
          const n: never = type
          throw n
        }
      }

      setBill({
        ...bill,
        services: [
          ...bill.services.map((service) =>
            service.id === row.id ? updatedRow : service,
          ),
        ],
      })
    }

    return (
      <tr className="border-t-1 relative <md:-translate-x-1">
        <td>
          <input
            autoFocus
            className="h-8 w-full min-w-[15ch] resize-none rounded-sm px-1 py-2 outline-none transition-all duration-100 ease-in focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"
            data-id={row.id}
            data-prop={"details"}
            name={`${FormData.serviceDetails}_${row.id}`}
            onChange={(e) => handleChange("detail", e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            placeholder={"Détail de la prestation"}
            ref={ref}
            required
            defaultValue={row.detail}
          />
          {invalidNamesInputs.includes(
            `${FormData.serviceDetails}_${row.id}`,
          ) && <ErrorHint message="Champs Requis" />}
        </td>
        <td className="w-14">
          <input
            className="w-full rounded-sm px-1 py-2 text-right lining-nums outline-none transition-all duration-100 ease-in focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"
            data-id={row.id}
            inputMode="numeric"
            name={`${FormData.serviceQuantity}_${row.id}`}
            onChange={(e) => handleChange("quantity", e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            pattern="\d+"
            placeholder={"1"}
            required
            type="text"
            defaultValue={row.quantity}
          />
          {invalidNamesInputs.includes(
            `${FormData.serviceQuantity}_${row.id}`,
          ) && <ErrorHint message="Champs Requis" />}
        </td>
        <td className="w-20 text-right">
          <input
            className="w-full rounded-sm px-1 py-2 text-right lining-nums outline-none transition-all duration-100 ease-in focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"
            type="text"
            inputMode="decimal"
            defaultValue={formatAmount(Number(row.price))}
            onFocus={(e) => e.currentTarget.select()}
            placeholder={"0,00€"}
            required
            onBlur={(e) =>
              (e.currentTarget.value = formatAmount(
                parseString(e.currentTarget.value),
              ))
            }
            data-id={row.id}
            onChange={(e) => handleChange("price", e.target.value)}
            name={`${FormData.servicePrice}_${row.id}`}
          />
          {invalidNamesInputs.includes(
            `${FormData.servicePrice}_${row.id}`,
          ) && <ErrorHint message="Champs Requis" />}
        </td>
        <td className="w-28 px-1 py-2 text-right lining-nums">
          {formatAmount(sum)}
        </td>
        <td className="w-12 text-center">
          <button
            className={`button is-ghost p-2 ${
              bill?.services.length && "text-currentColor"
            }`}
            disabled={bill?.services.length === 1}
            onClick={() => setShowDeleteRow(true)}
            type="button"
          >
            <IconTrashOutline />
          </button>
        </td>
        <td
          className={`bill-delete-dialog absolute inset-2 z-10 -mx-1 -my-2 hidden flex-wrap items-center justify-center gap-2 rounded-md bg-violet-500 p-1 font-sans text-sm text-white drop-shadow-md transition-all duration-300`}
          ref={deleteRowRef}
        >
          <div>
            <button
              className="button is-ghost mr-1 py-1 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:from-violet-400 dark:to-violet-400"
              onClick={() => setShowDeleteRow(false)}
              type="button"
            >
              Annuler
            </button>
            <button
              className="button is-filled relative bg-white bg-w-0/h-0 bg-center py-1 text-violet-500 "
              onClick={removeRow}
              type="button"
            >
              Supprimer la ligne
            </button>
          </div>
        </td>
      </tr>
    )
  },
)

function BillPayment() {
  const [showValue, toggleShowValue] = useToggle(false)
  const { invalidNamesInputs, user, setUser } = useFormContext()

  type Input = keyof Pick<User, "iban" | "bic">
  async function handleInputChange(type: Input, value: string) {
    if (typeof user === "undefined") return
    setUser({ ...user, [type]: value })
  }

  return (
    <div className="px-2 <sm:order-2">
      <h3 className="font-sans font-bold text-black">
        Informations de paiement
      </h3>
      {user?.showPaymentInformation && (
        <table className="w-full border-separate border-spacing-y-2">
          <tbody>
            <tr>
              <td>
                <label htmlFor="bic">BIC</label>
              </td>
              <td>
                <div className="flex">
                  <input
                    type={showValue ? "text" : "password"}
                    className={`${inputStyle} w-full bg-gray-100`}
                    value={user?.bic || ""}
                    onChange={(e) =>
                      handleInputChange("bic", e.currentTarget.value)
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="CPPTFRP1"
                    id="bic"
                    name={FormData.userBic}
                    pattern={`${REGEX_BIC}`.replaceAll("/", "")}
                  />
                  <button
                    className="button is-ghost px-2"
                    onClick={toggleShowValue}
                    type="button"
                  >
                    {showValue ? <IconVisibilityOff /> : <IconVisibilityOn />}
                  </button>
                </div>
                {invalidNamesInputs.includes(FormData.userBic) && (
                  <ErrorHint message="BIC invalid" />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="iban">IBAN</label>
              </td>
              <td>
                <div className="flex">
                  <input
                    type={showValue ? "text" : "password"}
                    className={`${inputStyle} w-full bg-gray-100`}
                    value={user?.iban || ""}
                    onChange={(e) =>
                      handleInputChange("iban", e.currentTarget.value)
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="FR6617569000709181828785C71"
                    id="iban"
                    name={FormData.userIban}
                    pattern={`${REGEX_IBAN}`.replaceAll("/", "")}
                  />
                  <button
                    className="button is-ghost px-2"
                    onClick={toggleShowValue}
                    type="button"
                  >
                    {showValue ? <IconVisibilityOff /> : <IconVisibilityOn />}
                  </button>
                </div>
                {invalidNamesInputs.includes(FormData.userIban) && (
                  <ErrorHint message="Iban invalid" />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {user?.showPaymentInformation ? (
        <button
          className="button is-ghost bg-w-0/h-full bg-left font-sans"
          type="button"
          onClick={() => {
            setUser({ ...user, showPaymentInformation: false } as User)
          }}
        >
          <IconVisibilityOff />
          Ne pas mettre mon <abbr title="Relevé d'identité bancaire">RIB</abbr>
        </button>
      ) : (
        <button
          className="button is-ghost p-1 font-sans"
          type="button"
          onClick={() => {
            setUser({ ...user, showPaymentInformation: true } as User)
          }}
        >
          <IconVisibilityOn />
          Montrer mon <abbr title="Relevé d'identité bancaire">RIB</abbr>
        </button>
      )}
    </div>
  )
}

function BillSums() {
  const { bill, setBill, user, setUser } = useFormContext()
  if (!bill || !user) return null
  const sumHT = bill ? calcBillSum(bill) : 0
  const sumTTC = sumHT ? addTax(sumHT, bill?.taxRate) : 0

  return (
    <div className="relative z-30 ml-auto w-full max-w-[30ch] bg-gray-100 p-2">
      <div className="flex justify-between">
        <h3 className="pr-2 font-sans text-black">Total HT</h3>
        <p className="text-right lining-nums">{formatAmount(sumHT)}</p>
      </div>
      <Listbox
        value={bill.taxRate || taxRates.at(0)}
        onChange={(newTax) => {
          setBill({ ...bill, taxRate: newTax })
          setUser({ ...user, taxRate: newTax })
        }}
        name="bill_taxRate"
      >
        <Listbox.Button
          className={
            "button w-full py-1 px-0 ring-offset-1 transition duration-100 ease-in hover:bg-black/5 focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"
          }
        >
          <span className="grow pr-2 text-left font-sans text-black">
            T.V.A
          </span>
          {formatPercent(bill.taxRate)} <IconChevronDown />
        </Listbox.Button>
        <div className="relative">
          <Listbox.Options className="absolute right-0 top-0 rounded bg-white text-gray-600 shadow-lg outline-none  transition duration-100 ease-in focus:ring-2 focus:ring-violet-400">
            {taxRates.map((tax) => (
              <Listbox.Option
                key={tax}
                value={tax}
                className={({ active, selected }) =>
                  `relative cursor-pointer select-none bg-gradient-to-r from-violet-400 to-violet-400 bg-w-0/h-full bg-no-repeat py-1 px-2 lining-nums  transition-[background_color] hocus:bg-w-full/h-full ${
                    active ? "bg-w-full/h-full !text-white" : ""
                  } ${selected ? "font-bold text-black" : ""}`
                }
              >
                {formatPercent(tax)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      <div className="flex justify-between">
        <h3 className="pr-2 font-sans font-bold text-black">Total</h3>
        <p className="text-right font-bold lining-nums text-black">
          {formatAmount(sumTTC)}
        </p>
      </div>
      {bill?.taxRate === 0 && <p>TVA non applicable, article 293B du CGI</p>}
    </div>
  )
}

function BillDownload() {
  const { isUpdating, isDownloading } = useFormContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.5,
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
        y: "0%",
      }}
      exit={{
        transition: {
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
        y: "100%",
      }}
      className="fixed right-0 left-0 bottom-0 z-20 flex flex-col items-center justify-center p-2 font-sans"
    >
      {isUpdating && (
        <p className="bg-white text-sm text-violet-500">Sauvegarde …</p>
      )}
      <button
        className="button is-filled relative px-8 font-bold"
        type="submit"
        disabled={isDownloading || isUpdating}
      >
        <span
          className={`${
            isDownloading
              ? "scale-60 translate-y-full opacity-0"
              : "translate-y-0 scale-100 opacity-100"
          } transition`}
        >
          Télécharger
        </span>
        <Spinner
          color="white"
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 ${
            isDownloading
              ? "-translate-y-1/2 scale-100 opacity-100"
              : "scale-60 translate-y-full opacity-0"
          }`}
          size={24}
        />
      </button>
    </motion.div>
  )
}
