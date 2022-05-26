import { EmojiMoon, EmojiSun } from "./IconsEmoji.index"

import { useEffect } from "react"
import { useState } from "react"

function ThemeColorSwitch(): JSX.Element | null {
  const [darkMode, setDarkMode] = useState<Boolean>(false)
  const [loading, setLoading] = useState<Boolean>(true)

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setDarkMode(true)
    }
    setLoading(false)
  }, [])

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

  if (loading) return null

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="button overflow-hidden text-2xl outline-none ring-gray-50 focus:-translate-y-1 focus:bg-white/40"
      aria-hidden
    >
      <EmojiSun
        className={`${!darkMode && "translate-y-0 opacity-100"} ${
          darkMode && "translate-y-8 opacity-0"
        } transition duration-300`}
      />
      <EmojiMoon
        className={`${darkMode && "translate-y-0 opacity-100"}
        ${!darkMode && "translate-y-10 opacity-0"}
        absolute transition duration-300`}
        style={{ filter: "drop-shadow(0 0 10px lightyellow)" }}
      />
    </button>
  )
}

export default ThemeColorSwitch
