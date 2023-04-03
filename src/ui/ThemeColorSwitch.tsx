import { EmojiMoon } from "./icons/MoonEmoji"
import { EmojiSun } from "./icons/SunEmoji"
import useIsMounted from "src/lib/hooks/useIsMounted"
import useToggleDarkMode from "src/lib/hooks/useToggleDarkMode"

function ThemeColorSwitch() {
  const { isDarkMode, setIsDarkMode } = useToggleDarkMode()
  const { isMounted } = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <button
      type="button"
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`
      ${!isMounted && "opacity-0"}
      button ml-auto overflow-hidden outline-none ring-gray-50 focus:-translate-y-1 focus:bg-white/40`}
      aria-hidden
    >
      <EmojiSun
        className={`
        ${isDarkMode ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"}
        h-8 w-8 transition duration-300`}
      />
      <EmojiMoon
        className={`
        ${isDarkMode ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        absolute h-8 w-8 transition duration-300`}
        style={{ filter: "drop-shadow(0 0 10px lightyellow)" }}
      />
    </button>
  )
}

export default ThemeColorSwitch
