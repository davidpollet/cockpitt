import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Cookies from "js-cookie"
import { EmojiHandHi } from "./IconsEmoji.index"
import { RootState } from "@store/store"
import ThemeColorSwitch from "./ThemeColorSwitch"
import UserMenu from "./UserMenu"
import { cockpittPages } from "./Navbar"
import { openAuthModal } from "@store/features/authModalSlice"
import time from "@helpers/dateHelpers"
import useIsMounted from "@hooks/useIsMounted"
import { useRouter } from "next/router"
import { userProps } from "@localTypes/userProps"

function Header() {
  const user = useSelector((state: RootState) => state.user.data)

  return (
    <header className="flex justify-around bg-violet-500 px-4 py-4 dark:bg-violet-850 sm:py-8 lg:col-span-2 lg:px-3">
      <HeaderTitle user={user} />
      <div className="relative z-30 flex grow justify-end gap-2">
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
  console.log(router.pathname)
  const currentPage = cockpittPages.find((c) => c.path === router.pathname)
  const cookieSayHello = !Cookies.get("sayHello")
  const sayHelloCondition = useCallback(
    () => user?.id && cookieSayHello,
    [user, cookieSayHello]
  )
  const [sayHello, setSayHello] = useState(sayHelloCondition())
  const isMounted = useIsMounted()

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    if (user) {
      setSayHello(sayHelloCondition())
      const remainingHoursToday = 24 - time().hour()
      timeout = setTimeout(() => {
        Cookies.set("sayHello", "false", {
          expires: remainingHoursToday / 24,
          sameSite: "strict",
        })
        setSayHello(false)
      }, 1500)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [user, sayHelloCondition])

  return (
    <div className="relative w-full self-center">
      <h1
        className={`
          transition-all
          ${isMounted && sayHello && "opacity-0"}
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
      {sayHello && <SayHello user={user} sayHello={sayHello} />}
    </div>
  )
}

function SayHello({
  user,
  sayHello,
}: {
  user: userProps | undefined
  sayHello: boolean
}) {
  return (
    <p
      className={`
      absolute top-1/2 left-0 flex grow items-center font-bold leading-none
      ${sayHello ? "-translate-y-1/2" : "translate-y-2/2"}
      text-white transition-all`}
    >
      {
        <EmojiHandHi
          className={`${
            sayHello ? "animate-shake" : ""
          } origin-bottom -rotate-12 text-4xl xl:text-5xl`}
        />
      }
      <span className="relative z-10 text-xl sm:text-2xl xl:text-3xl">
        Bonjour {user?.name.split(" ")[0]}
      </span>
      <span
        className="absolute whitespace-nowrap text-2xl uppercase opacity-10 sm:text-4xl xl:text-5xl"
        aria-hidden
      >
        Bonjour {user?.name.split(" ")[0]}
      </span>
    </p>
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
