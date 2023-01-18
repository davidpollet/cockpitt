import { IconClose, IconFacebook, IconGoogle } from "./Icons.index"

import { Dialog } from "@headlessui/react"
import React from "react"
import classNames from "classnames"
import { closeAuthModal } from "@store/features/authModalSlice"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import { useDispatch } from "react-redux"

const authProviders = [
  {
    label: "Google",
    icon: <IconGoogle />,
  },
  {
    label: "Facebook",
    icon: <IconFacebook />,
  },
]
function AuthModal() {
  const dispatch = useDispatch()
  return (
    <Dialog
      open={true}
      onClose={() => dispatch(closeAuthModal())}
      className="fixed inset-0 z-50 grid min-h-screen p-2"
    >
      <DialogOverlay />

      <DialogMain>
        <DialogCloseButton />
        <DialogTitle />
        <section className="mt-2 flex flex-wrap gap-2">
          {authProviders.map(({ label, icon }) => (
            <button
              className="button is-filled"
              type="button"
              key={label}
              onClick={() => signIn(label.toLowerCase())}
            >
              {icon} {label}
            </button>
          ))}
        </section>
      </DialogMain>
    </Dialog>
  )
}

const dialogTitleClassName = `relative flex grow items-center gap-2 pr-6
font-bold leading-none text-violet-500 dark:text-violet-50`

function DialogTitle({ title = "Connexion / Inscription" }) {
  return (
    <h2 className={dialogTitleClassName}>
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

const CloseButtonClassName = classNames([
  "button is-ghost absolute top-2 right-2 z-10 ml-auto from-violet-500 to-violet-500 p-2",
  "dark:text-violet-100",
])
function DialogCloseButton() {
  const dispatch = useDispatch()
  return (
    <button
      onClick={() => dispatch(closeAuthModal())}
      className={CloseButtonClassName}
    >
      <IconClose />
    </button>
  )
}

const DialogMainClassName = `m-w-xs relative z-10 m-auto grid w-full
  max-w-md gap-2 overflow-hidden rounded-md bg-white p-4 shadow-2xl
  dark:bg-violet-800`

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
      className={DialogMainClassName}
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
