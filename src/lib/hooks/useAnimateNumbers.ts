import React from "react"

export function useAnimateNumber(
  numberTarget: number,
  animationDuration = 300,
) {
  const [amount, setAmount] = React.useState(numberTarget)
  const previousAmountRef = React.useRef(numberTarget)
  const animationRef = React.useRef(0)

  React.useEffect(() => {
    let animationStartTimestamp: number | null = null

    const updateAmount = (timestamp: number) => {
      if (!animationStartTimestamp) {
        animationStartTimestamp = timestamp
      }

      const animationProgress =
        (timestamp - animationStartTimestamp) / animationDuration

      if (animationProgress >= 1) {
        setAmount(numberTarget)
        previousAmountRef.current = numberTarget
        return
      }

      const previousAmount = previousAmountRef.current
      const difference = numberTarget - previousAmount
      const amountToAdd = difference * animationProgress
      const nextAmount = previousAmount + amountToAdd

      setAmount(nextAmount)
      animationRef.current = requestAnimationFrame(updateAmount)
    }
    if (numberTarget !== previousAmountRef.current) {
      animationRef.current = requestAnimationFrame(updateAmount)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [numberTarget, animationDuration])

  return amount
}
