import { ReactElement, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import HeaderAuth from "./HeaderAuth"
import { RootState } from "@store/store"
import ThemeColorSwitch from "./ThemeColorSwitch"

function Header(): ReactElement {
  const user = useSelector((store: RootState) => store.user)
  const dispatch = useDispatch()
  const [displayName, setDisplayName] = useState(
    user.data.email ? user.data.email.split("@")[0] : ""
  )
  useEffect(() => {
    setDisplayName(user.data.username ? user.data.username.split(" ")[0] : "")
  }, [user])
  return (
    <header className="flex justify-around bg-violet-500 px-4 py-8 dark:bg-violet-850 lg:px-3">
      <h1
        className={`shadow-title relative flex grow items-center gap-2 font-bold leading-none text-white`}
      >
        <span className="shake -rotate-12 text-4xl">🖐 </span>
        <span className="relative z-10 text-2xl">Bonjour {displayName}</span>
        <span className="absolute text-5xl uppercase opacity-10" aria-hidden>
          Bonjour {displayName}
        </span>
      </h1>
      <div className="relative flex grow justify-end gap-2">
        <ThemeColorSwitch />
        <HeaderAuth />
      </div>
    </header>
  )
}

export default Header
