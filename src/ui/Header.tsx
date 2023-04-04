import Navbar, { cockpittPages } from "./Navbar"

import Cookies from "js-cookie"
import { EmojiHandHi } from "./icons/HandHiEmoji"
import React from "react"
import ThemeColorSwitch from "./ThemeColorSwitch"
import UserMenu from "../features/user-auth/UserMenu"
import time from "src/lib/utils/dateHelpers"
import { useAuthModal } from "./AppWrapper"
import useIsMounted from "src/lib/hooks/useIsMounted"
import { useRouter } from "next/router"
import { useUser } from "src/features/user-auth/useUser"

function Header() {
  const { user } = useUser()
  return (
    <header className="flex items-center gap-2 bg-violet-500 px-4 py-4 dark:bg-violet-850 sm:py-8 lg:col-span-2 lg:px-3">
      <Navbar />
      <HeaderTitle />
      <div className="relative z-30 flex justify-end gap-2">
        <ThemeColorSwitch />
        {user?.email ? <UserMenu /> : <SignInButton />}
      </div>
    </header>
  )
}

function HeaderTitle() {
  const { user } = useUser()
  const router = useRouter()
  const currentPage = cockpittPages.find((c) => c.path === router.pathname)
  const sayHelloCookieExpired = !Cookies.get("sayHello")
  const [sayHello, setSayHello] = React.useState(false)
  const isMounted = useIsMounted()

  React.useEffect(() => {
    const shouldSayHello = Boolean(user?.name) && sayHelloCookieExpired
    setSayHello(shouldSayHello)
  }, [setSayHello, user?.name, sayHelloCookieExpired])

  if (!isMounted) return null

  return (
    <div className="relative grow" style={{ clipPath: "inset(-.5rem)" }}>
      <h1
        className={`${
          sayHello ? "opacity-0" : "opacity-100"
        } relative flex grow items-center font-bold leading-none text-white transition`}
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
      {sayHello && <SayHello setSayHello={setSayHello} sayHello={sayHello} />}
    </div>
  )
}

function SayHello({
  sayHello,
  setSayHello,
}: {
  sayHello: boolean
  setSayHello: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { user } = useUser()

  function hideHelloMessage() {
    const remainingHoursToday = 24 - time().hour()
    Cookies.set("sayHello", "false", {
      expires: remainingHoursToday / 24,
      sameSite: "strict",
    })
    setSayHello(false)
  }

  return (
    <p
      className={`
      absolute top-1/2 left-0 flex grow animate-sayHello items-center font-bold leading-none
      text-white transition-all`}
      onAnimationEnd={hideHelloMessage}
    >
      {
        <EmojiHandHi
          className={`${
            sayHello ? "animate-shake" : "opacity-0"
          } origin-bottom -rotate-12 text-4xl xl:text-5xl`}
          style={{ animationDelay: "600ms" }}
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
  const { toggleAuthModal } = useAuthModal()
  return (
    <button
      className="button is-outline flex-col leading-none text-white ring-white hocus:text-violet-500"
      onClick={toggleAuthModal}
    >
      Connexion <br />
      <small className="opacity-80">Inscription</small>
    </button>
  )
}

export default Header
