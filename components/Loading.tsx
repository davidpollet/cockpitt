function Loading({ color = "violet-400", size = 32, className = "" }) {
  const colorClass = `stroke-${color}`
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
          className={`animate-loading ${colorClass}`}
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export default Loading
