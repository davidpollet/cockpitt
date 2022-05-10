import { AnimatePresence, motion } from "framer-motion"
import { ReactElement, ReactNode, useEffect, useState } from "react"
import { closeAuthModal, setUserData } from "@store/features/userSlice"
import { getSession, useSession } from "next-auth/react"
import { useDispatch, useSelector } from "react-redux"

import AuthForm from "./AuthForm"
import { Dialog } from "@headlessui/react"
import { GetServerSideProps } from "next"
import Header from "./Header"
import { IconClose } from "./Icons.index"
import { RootState } from "@store/store"

type AppProps = { children: ReactNode }

function AppWrapper({ children }: AppProps): ReactElement {
  const isOpen = useSelector((store: RootState) => store.user.showAuthModal)
  const userData = useSelector((store: RootState) => store.user.data)

  const dispatch = useDispatch()
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
    },
  })

  useEffect(() => {
    data?.user ? dispatch(setUserData(data.user)) : dispatch(setUserData({}))
  }, [data, dispatch])

  return (
    <>
      <div className="text-main-700 flex min-h-screen flex-col bg-violet-25 dark:bg-violet-900">
        <Header />
        <main className="grow bg-gradient-to-b from-violet-500 to-violet-500 bg-[length:100%_64px] bg-no-repeat px-2 dark:bg-gradient-to-b dark:from-violet-850 dark:to-violet-850 lg:px-3">
          <div className="rounded-md bg-violet-25 p-2 shadow-lg shadow-violet-100/50 dark:bg-violet-900 dark:shadow-none lg:p-4">
            {children}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Dialog
            open={true}
            onClose={() => dispatch(closeAuthModal())}
            className="fixed inset-0 z-10 grid min-h-screen"
          >
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
              className="fixed inset-0 bg-violet-500/75 p-1"
            />
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
              className="relative z-10 m-auto max-w-2xl rounded-md bg-white p-4 shadow-2xl"
            >
              <button
                onClick={() => dispatch(closeAuthModal())}
                className="button is-ghost absolute right-2 top-2 z-10 from-violet-500 to-violet-500 p-2"
              >
                <IconClose />
              </button>
              <AuthForm />
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

export default AppWrapper
