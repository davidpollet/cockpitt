import { IconIncomes } from "./icons/Incomes"
import { IconTasks } from "./icons/Tasks"
import Link from "next/link"
import React from "react"
import useResizeObserver from "use-resize-observer"
import { useRouter } from "next/router"

export const NAVBAR_HEIGHT_CSS_VAR = "--navbar-height"
const NAVBAR_OFFSET_SPACING = 12

export const cockpittPages = [
  {
    name: "Mes tâches",
    title: "Mes tâches",
    path: "/app",
    icon: <IconTasks className={`z-10 h-6 w-6 translate-y-1 self-center`} />,
  },
  {
    name: "Mon Chiffre d'affaires",
    title: "Suivi du chiffre d'affaires",
    path: "/app/suivi-chiffre-d-affaires",
    icon: <IconIncomes className={`z-10 h-6 w-6 opacity-80`} />,
  },
]

function Navbar() {
  const router = useRouter()
  const { ref: navbarRef, height: navBarHeight } =
    useResizeObserver<HTMLElement>({ box: "border-box" })

  React.useLayoutEffect(() => {
    if (typeof navBarHeight === "number") {
      document.body.style.setProperty(
        NAVBAR_HEIGHT_CSS_VAR,
        navBarHeight + NAVBAR_OFFSET_SPACING + "px",
      )
    }
  }, [navBarHeight])

  return (
    <nav
      ref={navbarRef}
      className={`z-20 flex items-end gap-2 bg-violet-25 px-1 py-1 dark:bg-violet-850 <lg:fixed  <lg:bottom-0 <lg:right-0 <lg:left-0 <lg:mx-auto <lg:justify-center lg:items-center lg:bg-transparent`}
    >
      {cockpittPages.map((page) => (
        <NavLink
          key={page.name}
          name={page.name}
          path={page.path}
          icon={page.icon}
          isActive={router.pathname === page.path}
        />
      ))}
    </nav>
  )
}

type navLink = {
  name: string
  path: string
  icon: React.ReactNode
  isActive: boolean
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

function NavLink({ name, path, icon, isActive, ...rest }: navLink) {
  return (
    <Link
      href={path}
      shallow={true}
      {...rest}
      className={`button is-ghost nav-link text-sm lg:flex-col lg:from-white lg:to-white lg:hocus:text-violet-500 lg:dark:from-violet-500 lg:dark:to-violet-500 lg:dark:hocus:text-white ${
        isActive
          ? "is-active bg-w-full/h-full font-bold text-white lg:text-violet-500 lg:dark:text-white"
          : "dark:text-violet-100 lg:text-white"
      }`}
    >
      {icon}
      {name}
    </Link>
  )
}

export default Navbar
