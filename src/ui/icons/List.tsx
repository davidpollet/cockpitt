export function IconList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path
        d="M432 80v352H80V80h352m16-16H64v384h384V64z"
        fill="currentColor"
      ></path>
      <path d="M192 152h192v16H192z" fill="currentColor"></path>
      <path d="M192 248h192v16H192z" fill="currentColor"></path>
      <path d="M192 344h192v16H192z" fill="currentColor"></path>
      <circle cx="144" cy="160" r="16" fill="currentColor"></circle>
      <circle cx="144" cy="256" r="16" fill="currentColor"></circle>
      <circle cx="144" cy="352" r="16" fill="currentColor"></circle>
    </svg>
  )
}
