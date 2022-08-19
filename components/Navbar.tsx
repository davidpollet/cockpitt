import { AnchorHTMLAttributes, ReactNode, useEffect, useRef } from "react"
import { IconList, IconSuiviCA } from "./Icons.index"

import Link from "next/link"
import { useRouter } from "next/router"
import { useWindowWidth } from "@react-hook/window-size"

export const cockpittPages = [
  {
    name: "Tâches",
    title: "Mes tâches",
    path: "/app",
    icon: <IconList className={`z-10 h-6 w-6 opacity-60`} />,
  },
  {
    name: "Chiffre d'affaire",
    title: "Suivi du chiffre d'affaire",
    path: "/app/suivi-chiffre-d-affaires",
    icon: <IconSuiviCA className={`z-10 h-6 w-6 opacity-60`} />,
  },
  // {
  //   name: "Notes",
  //   title: "Mes notes",
  //   path: "/mes-notes",
  //   icon: <IconGrid className={`z-10 h-6 w-6 opacity-60`} />,
  // },
]

function Navbar() {
  const router = useRouter()

  const windowWidth = useWindowWidth()
  const navbarRef = useRef<any>(null)

  useEffect(() => {
    if (!navbarRef.current) return
    const navbarHeight = navbarRef.current.clientHeight || 64
    document.body.style.setProperty(
      "--navbar-height",
      `${(navbarHeight + 16) / 16}rem`
    )
  }, [windowWidth])

  useEffect(() => {
    function handleRouteChange(url: string) {
      if (url === router.asPath) return
      navbarRef.current.classList.add("route-is-changing")
    }

    router.events.on("routeChangeStart", handleRouteChange)

    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [router.query.slug, router.asPath, router.events])

  return (
    <nav
      ref={navbarRef}
      className={`fixed bottom-0 right-0 left-0 z-20 mx-auto flex w-fit items-end justify-center gap-2 rounded-t-md bg-violet-25 px-2 pt-2 shadow-lg shadow-violet-200 dark:bg-violet-850 dark:shadow-none`}
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
  icon: ReactNode
  isActive: boolean
} & AnchorHTMLAttributes<HTMLAnchorElement>

function NavLink({ name, path, icon, isActive, ...rest }: navLink) {
  return (
    <Link href={path} shallow={true} {...rest}>
      <a className={`nav-link <sm:flex-col ${isActive ? "is-active" : null}`}>
        {icon}
        <span className="z-10">{name}</span>
      </a>
    </Link>
  )
}

export default Navbar
