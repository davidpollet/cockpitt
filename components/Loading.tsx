function Loading({ color = "stroke-violet-400", size = 32, className = "" }) {
  return (
    <div className={className}>
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
          className={`animate-loading ${color}`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default Loading
