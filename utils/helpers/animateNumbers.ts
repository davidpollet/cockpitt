function animateNumber(
  callback: Function,
  start: number,
  end: number,
  duration = 400
): number {
  let startTimestamp: number | null = null

  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp

    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    let value = progress * (end - start) + start

    value = value <= 0 ? 0 : value
    callback(value)
    if (progress < 1) {
      return window.requestAnimationFrame(step)
    }
  }

  return window.requestAnimationFrame(step)
}

export default animateNumber
