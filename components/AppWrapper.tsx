import { HTMLAttributes, ReactElement, ReactNode } from "react"

import { AnimatePresence } from "framer-motion"
import AuthModal from "./AuthModal"
import Header from "./Header"
import Navbar from "./Navbar"
import { RootState } from "@store/store"
import { Toaster } from "react-hot-toast"
import classNames from "classnames"
import getSsrUserData from "utils/getSsrUserData"
import { initBills } from "@store/features/incomeSlice"
import { useSelector } from "react-redux"

type AppProps = { children: ReactNode } & HTMLAttributes<HTMLDivElement>

const AppWrapperClassName = classNames([
  "text-main-700 flex min-h-screen flex-col bg-violet-25",
  "dark:bg-violet-900",
])

const MainClassName = classNames([
  "text-gray-500 grow bg-gradient-to-b from-violet-500 to-violet-500 bg-[length:100%_64px] bg-no-repeat px-2",
  "dark:text-violet-200 dark:bg-gradient-to-b dark:from-violet-850 dark:to-violet-850",
  "lg:px-3",
])

const MainChildClassName = classNames([
  "rounded-md bg-violet-25 p-2 shadow-lg shadow-violet-100/50 lg:p-4",
  "dark:bg-violet-850 dark:shadow-none dark:ring-violet-600 dark:ring-1",
])

function AppWrapper({ children, ...rest }: AppProps): ReactElement {
  const showAuthModal = useSelector(
    (store: RootState) => store.authModal.showAuthModal
  )

  return (
    <>
      <div
        className={AppWrapperClassName}
        {...rest}
        style={{ paddingBottom: "var(--navbar-height, 4rem)" }}
      >
        <Header />
        <main className={MainClassName}>
          <Navbar />
          <div className={MainChildClassName}>{children}</div>
        </main>
      </div>
      <Toaster position="top-center" />
      <AnimatePresence>{showAuthModal && <AuthModal />}</AnimatePresence>
    </>
  )
}

export const getServerSideProps = getSsrUserData("/bills", initBills)

export default AppWrapper
