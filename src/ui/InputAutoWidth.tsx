import React from "react"
import { useEnsuredForwardedRef } from "react-use"

export const InputAutoWidth = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement | null>
>(function AutoResizeInput(props, forwardedRef) {
  const { value, className, defaultValue } = props
  const mirrorElRef = React.useRef<HTMLSpanElement | null>(null)
  const [width, setWidth] = React.useState(
    () => mirrorElRef.current?.clientWidth,
  )
  const ensuredRef = useEnsuredForwardedRef(
    forwardedRef as React.MutableRefObject<HTMLInputElement>,
  )

  React.useLayoutEffect(() => {
    const mirrorWidth = mirrorElRef.current?.clientWidth
    if (typeof mirrorWidth !== "number") return
    if (mirrorWidth !== width) setWidth(mirrorWidth)
  }, [value, width])

  return (
    <>
      <span
        className={className}
        ref={mirrorElRef}
        style={{
          clipPath: "inset(50%)",
          position: "absolute",
          visibility: "hidden",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
        aria-hidden
      >
        {value || defaultValue || props.placeholder}
      </span>
      <input
        onFocus={(e) => e.target.select()}
        {...props}
        style={{ ...props.style, width: width + "px" }}
        ref={ensuredRef}
      />
    </>
  )
})
