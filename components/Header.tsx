import { useDispatch, useSelector } from "react-redux"

import { EmojiHandHi } from "./IconsEmoji.index"
import { RootState } from "@store/store"
import ThemeColorSwitch from "./ThemeColorSwitch"
import UserMenu from "./UserMenu"
import { openAuthModal } from "@store/features/authModalSlice"
import { userProps } from "@localTypes/userProps"

function Header() {
  const user = useSelector((store: RootState) => store.user.data)
  const title = getTitle(user)

  return (
    <header className="flex justify-around bg-violet-500 px-4 py-4 dark:bg-violet-850 sm:py-8 lg:col-span-2 lg:px-3">
      <HeaderTitle title={title} />
      <div className="relative flex grow justify-end gap-2">
        <ThemeColorSwitch />
        {user.id ? <UserMenu /> : <SignInButton />}
      </div>
    </header>
  )
}

const headerTitleClassName = `relative flex grow items-center
font-bold leading-none text-white`

function HeaderTitle({ title = "Cockpit" }) {
  return (
    <h1 className={headerTitleClassName}>
      {title.includes("Bonjour") && (
        <EmojiHandHi className="origin-bottom -rotate-12 animate-shake text-4xl xl:text-5xl" />
      )}
      <span className="relative z-10 text-xl sm:text-2xl xl:text-3xl">
        {title}
      </span>
      <span
        className="absolute whitespace-nowrap text-2xl uppercase opacity-10 sm:text-4xl xl:text-5xl"
        aria-hidden
      >
        {title}
      </span>
    </h1>
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

function getTitle(user: userProps) {
  if (user.name) return `Bonjour ${user.name.split(" ")[0]}`
  return "Cockpitt"
}

export default Header
