import { useEffect, useState } from "react"

function useToggleDarkMode() {
  const darkMode = () =>
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark")
  const [isDarkMode, setIsDarkMode] = useState(darkMode())

  useEffect(() => {
    setIsDarkMode(darkMode())
  }, [])

  useEffect(() => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="dark-mode-transition">
        body {overflow-x: hidden !important;}
        *,*::before,*::after {transition: 200ms ease all !important}
      </style>`
    )
    if (isDarkMode) {
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
  }, [isDarkMode])

  return { isDarkMode, setIsDarkMode }
}

export default useToggleDarkMode
