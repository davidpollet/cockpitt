import Balancer, { Provider } from "react-wrap-balancer"

import DividerWave from "../public/img/divider-wave-opaque.svg"
import Head from "next/head"
import { IconArrowDownCircleOutline } from "src/ui/icons/ArrowDownCircleOutline"
import { IconCashed } from "src/ui/icons/Cashed"
import { IconCheck } from "src/ui/icons/Check"
import { IconChevronRight } from "src/ui/icons/ChevronRight"
import { IconTasks } from "src/ui/icons/Tasks"
import Image from "next/image"
import Link from "next/link"
import LogoCockpitt from "../public/img/logo-cockpitt.svg"
import { NextPage } from "next"
import React from "react"
import { fetcher } from "src/lib/utils/fetcher"
import { preload } from "swr"
import { useSession } from "next-auth/react"
import { userApiRoute } from "src/lib/utils/FetchWrapper"

const LandingPage: NextPage = () => {
  const pageRef = React.useRef<HTMLDivElement>(null)
  const { status, data } = useSession()

  React.useEffect(() => {
    if (data?.user?.email) {
      preload(`${userApiRoute}/${data.user.email}`, fetcher)
    }
  }, [data?.user?.email])

  React.useEffect(() => {
    if (!pageRef.current) return
    const { current: page } = pageRef
    const sectionsToAnimateOnScroll =
      page.querySelectorAll(".animate-on-scroll")
    const [sectionBanner] = Array(sectionsToAnimateOnScroll[0])

    sectionBanner.classList.add("is-inview")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview")
          }
        })
      },
      {
        threshold: 0.5,
      },
    )

    sectionsToAnimateOnScroll.forEach((el) => {
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <Head>
        <title>Cockpitt</title>
        <meta
          name="description"
          content="Suivez vos tâches par projet et sur une seule page"
        />
      </Head>

      <Provider>
        <div className="site bg-white" ref={pageRef}>
          <header className="relative m-auto flex max-w-8xl flex-wrap items-center justify-center px-2 py-8">
            <LogoCockpitt className="ml-auto mr-auto h-auto w-48" />
            <div className="w-fit rounded-md rounded-b-none <sm:fixed <sm:left-2 <sm:right-2 <sm:bottom-0 <sm:z-10 <sm:mx-auto <sm:flex <sm:bg-violet-200 <sm:p-1 sm:absolute sm:right-0">
              <Link
                href="/app"
                className={`button is-ghost group mx-auto bg-gradient-to-l from-violet-500 to-violet-300 bg-w-0/h-full font-bold uppercase text-violet-500 ${
                  status === "loading" ? "opacity-0" : ""
                }`}
              >
                {status === "authenticated" ? "Ouvrir " : "Tester "}Cockpitt
                <IconChevronRight className="translate-y-[1px]  scale-75" />
              </Link>
            </div>
          </header>
          {/* Banner */}
          <section className="section-banner animate-on-scroll relative isolate md:text-center">
            <div className="mx-auto grid min-h-[75vh] max-w-8xl place-content-center xl:pl-8">
              <div className="banner-content relative z-10 mx-auto flex max-w-5xl flex-col gap-3 px-4">
                <h2 className="text-4xl font-black uppercase tracking-wide text-violet-800 sm:text-5xl lg:text-6xl xl:text-7xl">
                  <span className="bg-gradient-to-bl from-violet-250 to-violet-500 bg-clip-text text-transparent">
                    La vue d'ensemble
                  </span>{" "}
                  de votre entreprise
                </h2>
                <ul className="grid gap-4 text-violet-800/80 md:flex md:flex-wrap md:justify-center">
                  <li className="flex items-center gap-2 leading-tight md:text-lg">
                    <span className="80 rounded-md border-2 border-violet-500 bg-violet-500/0 ring-2 ring-violet-200">
                      <IconCheck className="text-violet-500" />
                    </span>
                    Toutes vos tâches projets réunis sur une page
                  </li>
                  <li className="flex items-center gap-2 leading-tight md:text-lg">
                    <span className="80 rounded-md border-2 border-violet-500 bg-violet-500/0 ring-2 ring-violet-200">
                      <IconCheck className="text-violet-500" />
                    </span>
                    Créez et télécharger vos factures
                  </li>
                  <li className="flex items-center gap-2 leading-tight md:text-lg">
                    <span className="80 rounded-md border-2 border-violet-500 bg-violet-500/0 ring-2 ring-violet-200">
                      <IconCheck className="text-violet-500" />
                    </span>
                    Suivez où vous en être au niveau du chiffre d'affaires.
                  </li>
                </ul>
                <div>
                  <Link
                    href="/app"
                    className={`button is-filled group relative mt-2 bg-gradient-to-bl from-violet-250 to-violet-500 bg-w-full/h-full px-8 py-3 font-bold uppercase hocus:bg-w-0/h-0 hocus:shadow-lg hocus:shadow-violet-300`}
                  >
                    {status === "authenticated" ? "Ouvrir " : "Tester "}Cockpitt
                    <IconChevronRight className="scale-75" />
                    {status === "unauthenticated" ? (
                      <span className="absolute left-1/2 top-full block -translate-x-1/2 -translate-y-2 whitespace-nowrap rounded-sm bg-white px-2 py-1 text-xs text-violet-500 shadow-sm transition group-hover:text-violet-300">
                        Sans inscription
                      </span>
                    ) : null}
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {/*eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/wave-bottom-2.svg"
            aria-hidden
            alt=""
            className="banner-wave w-[200vw] lg:h-32 lg:w-screen"
          />
          <section className="section-features min-h-screen overflow-hidden bg-violet-500 px-4 pb-16">
            <div className="icon-arrow animate-on-scroll mx-auto mb-2 grid h-14 w-14 rounded-full bg-white shadow-xl transition duration-150 lg:h-20 lg:w-20">
              <IconArrowDownCircleOutline
                className="m-auto h-10 w-10 text-violet-500 lg:h-14 lg:w-14"
                aria-hidden
              />
            </div>
            <h3 className="section-title animate-on-scroll mx-auto max-w-[40ch] text-center text-2xl font-black text-white transition duration-150 sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="transition-all duration-300">
                Des fonctionnalités pour vous aider à gérer votre entreprise
              </span>
            </h3>
            <div className="feature animate-on-scroll top mx-auto mt-9 grid max-w-8xl lg:grid-cols-2 lg:items-center lg:gap-8">
              <div className="feature-illustration rounded-xl bg-violet-450 px-4 pt-2">
                <div className="translate-y-4 rounded-xl shadow-2xl">
                  <Image
                    src="/img/todo.png"
                    alt=""
                    className="rounded-xl"
                    width="1200"
                    height="638"
                    aria-hidden
                    loading="lazy"
                    sizes="(max-width: 600px) 100vw, (max-width: 1023px) 100vw,(min-width: 1200px) 50vw"
                  />
                </div>
              </div>
              <div className="feature-content grid gap-4 px-4 <lg:-mt-8">
                <h3 className="flex flex-col items-start gap-2 text-2xl font-black  text-white md:text-3xl">
                  <span className="flex h-16 w-16 rounded-md border-2 border-violet-350 bg-violet-500 text-5xl ring-2 ring-violet-200">
                    <IconTasks className="m-auto h-10 w-10" />
                  </span>
                  Gestion de vos projets sur une seule page
                </h3>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="rounded-md border-2 border-violet-350 bg-violet-500 ring-2 ring-violet-200">
                      <IconCheck />
                    </span>
                    Création de projets et de tâches illimitées
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="rounded-md border-2 border-violet-350 bg-violet-500 ring-2 ring-violet-200">
                      <IconCheck />
                    </span>
                    Cachez les projets en standby
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="rounded-md border-2 border-violet-350 bg-violet-500 ring-2 ring-violet-200">
                      <IconCheck />
                    </span>
                    <span>
                      Les tâches sont triées automatiquement selon leur état :{" "}
                      <em>commencée</em>, <em>terminée</em>, <em>validée</em> ou{" "}
                      <em>refusée</em>
                    </span>
                  </li>
                </ul>
                <Link
                  href="/app"
                  className="button is-filled group relative mt-2 justify-center justify-self-start bg-white bg-gradient-to-l px-8 py-3 font-bold uppercase text-violet-500"
                >
                  Gestion de projets
                  <IconChevronRight className="scale-75" />
                  <span className="absolute left-1/2 top-full block -translate-x-1/2 -translate-y-2 rounded-sm bg-violet-500 px-2 py-1 text-xs text-violet-50 shadow-sm transition group-hover:text-white">
                    Tester
                  </span>
                </Link>
              </div>
            </div>
            <div className="feature animate-on-scroll top mx-auto mt-28 grid max-w-8xl lg:grid-cols-2 lg:items-center lg:gap-4">
              <div className="feature-illustration rounded-xl bg-violet-450 px-4 lg:order-1">
                <div className="translate-y-4 rounded-xl shadow-2xl">
                  <Image
                    src="/img/ca.png"
                    alt=""
                    className="rounded-xl"
                    width="1200"
                    height="638"
                    aria-hidden
                    loading="lazy"
                    sizes="(max-width: 600px) 100vw, (max-width: 1023px) 100vw,(min-width: 1200px) 50vw"
                  />
                </div>
              </div>
              <div className="feature-content grid gap-4 px-4 <lg:-mt-8 lg:pl-0">
                <h3 className="flex flex-col items-start gap-2 text-2xl font-black text-white md:text-3xl">
                  <span className="flex h-16 w-16 rounded-md  border-2 border-violet-350 bg-violet-500 text-5xl ring-2 ring-violet-200">
                    <IconCashed className="m-auto h-8 w-8" />
                  </span>
                  <Balancer>
                    Créez vos factures et suivez l'évolution de votre chiffre
                    d'affaires
                  </Balancer>
                </h3>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="rounded-md border-2 border-violet-350 bg-violet-500 ring-2 ring-violet-200">
                      <IconCheck />
                    </span>
                    Créez de belles factures en PDF
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="rounded-md border-2 border-violet-350 bg-violet-500 ring-2 ring-violet-200">
                      <IconCheck />
                    </span>
                    Cockpitt vous donne une aperçu direct de vos factures :
                    celles envoyées, celles en retard et celles encaissées
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="rounded-md border-2 border-violet-350 bg-violet-500 ring-2 ring-violet-200">
                      <IconCheck />
                    </span>
                    Voyez d'un coup d'oeil votre chiffre d'affaires réel et
                    celui en attente
                  </li>
                </ul>
                <Link
                  href="/app/suivi-chiffre-d-affaires"
                  className="button is-filled viol group relative mt-2 justify-center justify-self-start bg-white bg-gradient-to-l px-8 py-3 font-bold uppercase text-violet-500"
                >
                  Créez une facture
                  <IconChevronRight className="scale-75" />
                  <span className="absolute left-1/2 top-full block -translate-x-1/2 -translate-y-2 rounded-sm bg-violet-500 px-2 py-1 text-xs text-violet-50 shadow-sm transition group-hover:text-white">
                    Dès maintenant
                  </span>
                </Link>
              </div>
            </div>
          </section>
          <footer className="section-footer flex flex-col items-center overflow-hidden pb-10 <sm:pb-20">
            <DividerWave className="h-auto w-[150vw]" />
            <div className="-mt-4 rounded-md rounded-b-none text-center">
              <LogoCockpitt className="inline-block h-11 w-auto" />
            </div>
          </footer>
        </div>
      </Provider>
    </>
  )
}

export default LandingPage
