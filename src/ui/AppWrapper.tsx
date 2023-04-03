import { AnimatePresence } from "framer-motion"
import AuthModal from "../features/user-auth/AuthModal"
import Header from "./Header"
import { NAVBAR_HEIGHT_CSS_VAR } from "./Navbar"
import React from "react"
import { Toaster } from "react-hot-toast"
import { create } from "zustand"

type AuthModal = {
  authModalIsOpen: boolean
  toggleAuthModal: () => void
}
export const useAuthModal = create<AuthModal>((set) => ({
  authModalIsOpen: false,
  toggleAuthModal: () =>
    set((state) => ({ ...state, authModalIsOpen: !state.authModalIsOpen })),
}))

function AppWrapper({ children, ...rest }: React.PropsWithChildren) {
  const { authModalIsOpen } = useAuthModal()

  return (
    <>
      <div
        className={`text-main-700 flex min-h-screen flex-col bg-violet-25 dark:bg-violet-900 lg:!pb-4`}
        {...rest}
        style={{ paddingBottom: `var(${NAVBAR_HEIGHT_CSS_VAR})` }}
      >
        <Header />
        <main className="flex grow flex-col bg-gradient-to-b from-violet-500 to-violet-500 bg-[length:100%_64px] bg-no-repeat px-2 text-gray-500 dark:bg-gradient-to-b dark:from-violet-850 dark:to-violet-850 dark:text-violet-200 lg:px-3">
          <div className="grow rounded-md bg-violet-25 p-2 shadow-lg shadow-violet-100/50 dark:bg-violet-850 dark:shadow-none dark:ring-1 dark:ring-violet-600 lg:p-4">
            {children}
          </div>
        </main>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 5000, style: { maxWidth: "60ch" } }}
      />
      <AnimatePresence>{authModalIsOpen && <AuthModal />}</AnimatePresence>
    </>
  )
}

export default AppWrapper
