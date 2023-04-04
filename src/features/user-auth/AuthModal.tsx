import { AnimatePresence, motion } from "framer-motion"

import { Dialog } from "@headlessui/react"
import { IconClose } from "src/ui/icons/Close"
import { IconLogoFacebook } from "src/ui/icons/Facebook"
import { IconLogoGoogle } from "src/ui/icons/Google"
import { IconWarning } from "src/ui/icons/Warning"
import React from "react"
import Spinner from "src/ui/Spinner"
import cn from "classnames"
import { signIn } from "next-auth/react"
import { useAuthModal } from "src/ui/AppWrapper"

type Providers = ["Google", "Facebook"]
type Provider = Providers[number]

type ProviderUI = {
  label: Provider
  icon: JSX.Element
}
const authProviders: ProviderUI[] = [
  {
    label: "Google",
    icon: <IconLogoGoogle />,
  },
  {
    label: "Facebook",
    icon: <IconLogoFacebook />,
  },
]

function AuthModal() {
  const [askForCheckEmail, setAskForCheckEmail] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [emailInputIsValid, setEmailInputIsValid] = React.useState(true)
  const { toggleAuthModal } = useAuthModal()
  const [isRedirecting, setIsRedirecting] = React.useState(false)

  function getDomainFromEmail(email: string) {
    if (!emailInputIsValid) return
    const domain = email.split("@").at(-1)
    if (domain) return domain
  }
  const [selectedProvider, setSelectedProvider] =
    React.useState<Provider | null>(null)
  return (
    <Dialog
      open={true}
      onClose={toggleAuthModal}
      className="fixed inset-0 z-50 grid min-h-screen p-2"
    >
      <DialogOverlay />

      <DialogMain>
        <button
          className="button is-ghost absolute top-2 right-2 z-10 ml-auto from-violet-500 to-violet-500 p-2 dark:text-violet-100"
          onClick={toggleAuthModal}
        >
          <IconClose />
        </button>
        <AnimatePresence>
          {askForCheckEmail ? (
            <motion.div
              initial={{ clipPath: "inset(50%)" }}
              animate={{ clipPath: "inset(0%)" }}
              className="absolute inset-2 z-20 flex flex-col items-center justify-center gap-2 rounded-inherit bg-white text-xl font-bold dark:bg-violet-850 dark:text-violet-50"
            >
              <p>L'email est parti ! 👌</p>
              <a
                href={`https://${getDomainFromEmail(email)}`}
                className="button is-filled"
              >
                Aller sur {getDomainFromEmail(email)}
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <DialogTitle />
        <form
          action=""
          className="grid"
          onSubmit={(e) => {
            e.preventDefault()
            if (!emailInputIsValid) return
            setIsSubmitting(true)

            signIn("email", {
              email: e.currentTarget.email.value,
              redirect: false,
            })
              .then(() => setAskForCheckEmail(true))
              .finally(() => setIsSubmitting(false))
          }}
          onInvalid={(e: React.InvalidEvent<HTMLFormElement>) => {
            e.preventDefault()
            setEmailInputIsValid(false)
          }}
          onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
            setEmail(e.target.value)
            const emailIsValid = e.target.checkValidity()
            if (emailIsValid) setEmailInputIsValid(true)
          }}
        >
          <label htmlFor="email" className="dark:text-violet-100">
            Email
          </label>
          <div className="">
            <div className="flex gap-1">
              <input
                type="email"
                name="email"
                className="input-text grow"
                required
              />
              <button
                className="button is-ghost relative dark:text-violet-100"
                type="submit"
                disabled={isSubmitting}
              >
                <span
                  className={`${
                    isSubmitting
                      ? "scale-60 translate-y-full opacity-0"
                      : "translate-y-0 scale-100 opacity-100"
                  } transition`}
                >
                  Valider
                </span>
                <Spinner
                  color={{ light: "violet", dark: "white" }}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 ${
                    isSubmitting
                      ? "-translate-y-1/2 scale-100 opacity-100"
                      : "scale-60 translate-y-full opacity-0"
                  }`}
                  size={24}
                />
              </button>
            </div>
            {!emailInputIsValid ? (
              <p className="flex items-center gap-1 py-2 text-violet-500 dark:text-violet-100">
                <IconWarning className="h-6 w-6" />
                L'email est incorrect
              </p>
            ) : null}
          </div>
        </form>
        <section className="mt-2 flex flex-wrap gap-2">
          {authProviders.map(({ label, icon }) => (
            <button
              className="button is-filled relative"
              type="button"
              key={label}
              onClick={() => {
                setSelectedProvider(label)
                setIsRedirecting(true)
                signIn(label.toLowerCase()).finally(() => {
                  setIsRedirecting(false)
                })
              }}
              disabled={isRedirecting && selectedProvider === label}
            >
              <span
                className={cn("flex items-center gap-1", {
                  "opacity-0": isRedirecting && selectedProvider === label,
                })}
              >
                {icon} {label}
              </span>
              <Spinner
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 ${
                  isRedirecting && selectedProvider === label
                    ? "opacity-1 -translate-y-1/2 scale-100"
                    : "translate-y-full scale-50 opacity-0"
                }`}
                size={24}
              />
            </button>
          ))}
        </section>
      </DialogMain>
    </Dialog>
  )
}

function DialogTitle({ title = "Connexion / Inscription" }) {
  return (
    <h2 className="relative flex grow items-center gap-2 pr-6 font-bold leading-none text-violet-500 dark:text-violet-50">
      <span className="relative z-10 text-2xl">{title}</span>
      <span
        className="absolute whitespace-nowrap text-5xl uppercase opacity-5"
        aria-hidden
      >
        {title}
      </span>
    </h2>
  )
}

function DialogMain({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0, scale: 1.2 }}
      animate={{
        filter: "blur(0)",
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
      }}
      exit={{
        filter: "blur(10px)",
        opacity: 0,
        scale: 1.2,
        transition: {
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
      }}
      className={`m-w-xs relative z-10 m-auto grid w-full max-w-md gap-2 overflow-hidden rounded-md bg-white p-4 shadow-2xl dark:bg-violet-800`}
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
      className="fixed inset-0 bg-violet-500/75 p-1 dark:bg-violet-900/75"
    />
  )
}

export default AuthModal
