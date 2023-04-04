import cn from "classnames"

const SPINNER_COLORS = ["white", "violet"] as const
const defaultSpinnerColor:
  | {
      dark: typeof SPINNER_COLORS[number]
      light: typeof SPINNER_COLORS[number]
    }
  | typeof SPINNER_COLORS[number] = "white"

function Spinner({ color = defaultSpinnerColor, size = 32, className = "" }) {
  const loaderColor = cn({
    "stroke-white":
      color === "white" ||
      (typeof color === "object" && color.light === "white"),
    "stroke-violet-500":
      color === "violet" ||
      (typeof color === "object" && color.light === "violet"),
    "dark:stroke-white":
      color === "white" ||
      (typeof color === "object" && color.dark === "white"),
    "dark:stroke-violet-500":
      color === "violet" ||
      (typeof color === "object" && color.dark === "violet"),
  })

  return (
    <span className={`${className} z-50 block`}>
      <svg
        viewBox="25 25 50 50"
        width={size}
        height={size}
        className={`animate-[spin_2s_linear_infinite]`}
      >
        <circle
          cx="50"
          cy="50"
          r="20"
          strokeWidth="5"
          fill="none"
          strokeDasharray="1,200"
          strokeDashoffset="0"
          className={`animate-loading ${loaderColor}`}
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export default Spinner
