import { EmojiMoon, EmojiSun } from "./IconsEmoji.index"

import Loading from "./Loading"
import { useEffect } from "react"
import { useState } from "react"

function ThemeColorSwitch(): JSX.Element | null {
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark")
  const [darkMode, setDarkMode] = useState(isDarkMode)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="dark-mode-transition">
        body {overflow-x: hidden !important;}
        *,*::before,*::after {transition: 200ms ease all !important}
      </style>`
    )
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("color-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("color-theme", "")
    }

    const wait = setTimeout(() => {
      document.head.querySelector("#dark-mode-transition")?.remove()
    }, 300)

    return () => {
      clearTimeout(wait)
    }
  }, [darkMode])

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) return <Loading />

  console.log(darkMode)
  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="button overflow-hidden text-2xl outline-none ring-gray-50 focus:-translate-y-1 focus:bg-white/40"
      aria-hidden
    >
      <EmojiSun
        className={`${
          !darkMode ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        } transition duration-300`}
      />
      <EmojiMoon
        className={`${
          darkMode ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }
        absolute transition duration-300`}
        style={{ filter: "drop-shadow(0 0 10px lightyellow)" }}
      />
    </button>
  )
}

export default ThemeColorSwitch
