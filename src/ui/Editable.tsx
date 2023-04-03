import React from "react"
import { useEnsuredForwardedRef } from "react-use"

type EditableProps = {
  as: React.ElementType
  className?: string
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<"div">

type As = HTMLHeadingElement | HTMLDivElement | HTMLParagraphElement

export const Editable = React.forwardRef<As, EditableProps>(function Editable(
  { as: Tag = "div", children, className = "", ...rest },
  ref,
) {
  type PolymorphicHtml =
    | HTMLHeadingElement
    | HTMLSpanElement
    | HTMLDivElement
    | HTMLParagraphElement
  const ensuredRef = useEnsuredForwardedRef(
    ref as React.MutableRefObject<PolymorphicHtml>,
  )
  function selectText(e: React.FocusEvent<HTMLDivElement>) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(e.currentTarget)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }
  return (
    <Tag
      contentEditable
      role="textbox"
      spellCheck="false"
      ref={ensuredRef}
      onFocus={selectText}
      style={{ minWidth: "4ch" }}
      suppressContentEditableWarning
      className={`editable ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
})
