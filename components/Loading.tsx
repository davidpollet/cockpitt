// React components loading
function Loading({
  isVisible,
  spinnerBg,
  spinnerColor,
}: {
  isVisible: boolean
  spinnerBg?: string
  spinnerColor?: string
}) {
  return isVisible ? (
    <div
      className={`h-[1.5em] w-[1.5em] animate-spin rounded-full border-4 ${spinnerBg} ${spinnerColor}`}
    ></div>
  ) : null
}

export default Loading
