import React from "react"
import useIsMounted from "./useIsMounted"

export function useFocusFirstEmptyInput() {
  const isMounted = useIsMounted()
  const [intialFocusIsActive, setIntialFocusIsActive] = React.useState(false)

  React.useEffect(() => {
    if (isMounted && !intialFocusIsActive) {
      setIntialFocusIsActive(true)
      const firstInputEmpty = document.querySelector("form input:placeholder-shown") as
        | HTMLInputElement
        | undefined

      if (firstInputEmpty) firstInputEmpty.focus()
    }
  }, [intialFocusIsActive, isMounted])
}
