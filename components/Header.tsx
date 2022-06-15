import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"

import Cookies from "js-cookie"
import { EmojiHandHi } from "./IconsEmoji.index"
import { RootState } from "@store/store"
import ThemeColorSwitch from "./ThemeColorSwitch"
import UserMenu from "./UserMenu"
import { cockpittPages } from "./Navbar"
import { openAuthModal } from "@store/features/authModalSlice"
import time from "@helpers/dateHelpers"
import { useRouter } from "next/router"
import { userProps } from "@localTypes/userProps"

function Header() {
  const user = useSelector((state: RootState) => state.user.data)

  return (
    <header className="flex justify-around bg-violet-500 px-4 py-4 dark:bg-violet-850 sm:py-8 lg:col-span-2 lg:px-3">
      <HeaderTitle user={user} />
      <div className="relative flex grow justify-end gap-2">
        <ThemeColorSwitch />
        {user?.email ? <UserMenu /> : <SignInButton />}
      </div>
    </header>
  )
}

const headerTitleClassName = `relative flex grow items-center
font-bold leading-none text-white`

function HeaderTitle({ user }: { user: userProps | undefined }) {
  const router = useRouter()
  const currentPage = cockpittPages.find((c) => c.path === router.pathname)
  const cookieShowHello = Cookies.get("showHello")
  const showHelloCondition = user?.id && !cookieShowHello
  const [showHello] = useState(showHelloCondition)
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    let timeOut: ReturnType<typeof setTimeout>
    if (showHello) {
      const remainingHoursToday = 24 - time().hour()
      timeOut = setTimeout(() => {
        Cookies.set("showHello", "false", {
          expires: remainingHoursToday / 24,
          sameSite: "strict",
        })
      }, 1500)
    }
    return () => clearTimeout(timeOut)
  }, [user, showHello])

  useEffect(() => setisLoading(false), [])
  return (
    <div className="relative w-full self-center">
      <h1
        className={`
          transition-all
          ${!isLoading && showHello ? "opacity-0" : "opacity-100"}
          ${headerTitleClassName}`}
      >
        <span className="relative z-10 text-xl sm:text-2xl xl:text-3xl">
          {currentPage?.title}
        </span>
        <span
          className="absolute whitespace-nowrap text-2xl uppercase opacity-10 sm:text-4xl xl:text-5xl"
          aria-hidden
        >
          {currentPage?.name}
        </span>
      </h1>
      {user?.name && (
        <p
          className={`
        top-2/2 absolute left-0 flex grow translate-y-0 items-center font-bold leading-none
        text-white opacity-0 transition-all
        ${
          !isLoading && showHello
            ? "!top-1/2 !-translate-y-1/2 !opacity-100"
            : ""
        }`}
        >
          {
            <EmojiHandHi
              className={`origin-bottom -rotate-12 text-4xl xl:text-5xl ${
                !isLoading && showHello ? "animate-shake" : ""
              }`}
            />
          }
          <span className="relative z-10 text-xl sm:text-2xl xl:text-3xl">
            Bonjour {user.name.split(" ")[0]}
          </span>
          <span
            className="absolute whitespace-nowrap text-2xl uppercase opacity-10 sm:text-4xl xl:text-5xl"
            aria-hidden
          >
            Bonjour {user.name.split(" ")[0]}
          </span>
        </p>
      )}
    </div>
  )
}

function SignInButton() {
  const dispatch = useDispatch()
  return (
    <button
      className="button is-outline flex-col leading-none text-white ring-white hocus:text-violet-500"
      onClick={() => dispatch(openAuthModal())}
    >
      Connexion <br />
      <small className="opacity-80">Inscription</small>
    </button>
  )
}

export default Header
