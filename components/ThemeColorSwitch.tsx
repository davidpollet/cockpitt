import { EmojiMoon, EmojiSun } from "./IconsEmoji.index"

import useIsMounted from "@hooks/useIsMounted"
import useToggleDarkMode from "@hooks/useToggleDarkMode"

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
      button overflow-hidden text-2xl outline-none ring-gray-50 focus:-translate-y-1 focus:bg-white/40`}
      aria-hidden
    >
      <EmojiSun
        className={`
        ${isDarkMode ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"}
        transition duration-300`}
      />
      <EmojiMoon
        className={`
        ${isDarkMode ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        absolute transition duration-300`}
        style={{ filter: "drop-shadow(0 0 10px lightyellow)" }}
      />
    </button>
  )
}

export default ThemeColorSwitch
