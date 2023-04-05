import { HTMLMotionProps, motion } from "framer-motion"

import { Dialog } from "@headlessui/react"

type DialogMainProps = {
  children: React.ReactNode
} & HTMLMotionProps<"div">

export function DialogMain({ children, ...rest }: DialogMainProps) {
  return <motion.div {...rest}>{children}</motion.div>
}

export function DialogOverlay() {
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
