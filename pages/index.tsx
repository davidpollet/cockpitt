import {
  IconCashed,
  IconCheck,
  IconChevronRight,
} from "@components/Icons.index"
import { useEffect, useRef } from "react"

import DividerWave from "../public/img/divider-wave-opaque.svg"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import LogoCockpitt from "../public/img/logo-cockpitt.svg"
import { NextPage } from "next"
import { TbArrowDownCircle } from "react-icons/tb"
import { useSession } from "next-auth/react"

const LandingPage: NextPage = () => {
  const pageRef = useRef<HTMLDivElement>(null)
  const { status } = useSession()

  console.log(status)

  useEffect(() => {
    if (!pageRef.current) return
    const { current: page } = pageRef
    const animateOnScroll = page.querySelectorAll(".animate-on-scroll")
    const [sectionBanner] = Array(animateOnScroll[0])

    sectionBanner.classList.add("is-inview")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(entry.intersectionRatio)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview")
          }
        })
      },
      {
        threshold: 0.5,
      },
    )

    animateOnScroll.forEach((el) => {
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

      <div className="site" ref={pageRef}>
        <header className="relative m-auto flex max-w-8xl flex-wrap items-center justify-center px-2 pt-4">
          <LogoCockpitt className="ml-auto mr-auto w-48" />
          <div className="w-fit rounded-md rounded-b-none <sm:fixed <sm:left-2 <sm:right-2 <sm:bottom-0 <sm:z-10 <sm:mx-auto <sm:flex <sm:bg-white <sm:p-2 sm:absolute sm:right-0">
            <Link href="/app">
              <a className="button is-ghost group mx-auto bg-gradient-to-l from-violet-500 font-bold uppercase text-violet-500">
                {status === "authenticated" ? "Ouvrir " : "Tester "} Cockpitt
                <IconChevronRight className="translate-y-[1px]  scale-75" />
              </a>
            </Link>
          </div>
        </header>
        {/* Banner */}
        <section className="section-banner animate-on-scroll relative isolate py-12 md:text-center lg:text-left">
          <div className="mx-auto grid max-w-8xl <xl:grid-cols-1 <xl:gap-10 xl:grid-cols-3 xl:pl-8">
            <div className="banner-content relative z-10 mx-auto flex max-w-2xl flex-col gap-3 px-4">
              <h2 className="text-2xl font-black uppercase tracking-wide text-violet-800 sm:text-3xl md:text-4xl lg:text-5xl">
                <span className="text-violet-500">La vue d'ensemble</span> de
                votre entreprise
              </h2>
              <p className="mx-auto max-w-[80ch] text-lg text-violet-800/80 <md:border-l-4 <md:border-violet-500 <md:pl-4">
                <strong className="text-violet-500">
                  Cockpitt vous donne de la clarté.
                </strong>{" "}
                En un clin d'oeil, voyez où vous en êtes au niveau de vos
                projets et de votre chiffre d'affaires
              </p>
              <div className="self-start text-center md:self-center">
                <Link href="/app">
                  <a className="button is-filled group relative mt-2 bg-gradient-to-l px-8 py-3 font-bold uppercase">
                    Tester Cockpitt
                    <IconChevronRight className="scale-75" />
                    <span className="absolute left-1/2 top-full block -translate-x-1/2 -translate-y-2 rounded-sm bg-white px-2 py-1 text-xs text-violet-500 shadow-sm transition group-hover:text-violet-300">
                      100% gratuit
                    </span>
                  </a>
                </Link>
              </div>
            </div>
            <div className="banner-illustration relative isolate z-20 mx-4 flex self-start rounded-2xl px-4  <lg:mt-14 lg:col-span-2 <xl:mx-auto <xl:max-w-4xl">
              <video
                src={"/img/video-banner.mp4"}
                className="video rounded-2xl"
                width={1920}
                height={1080}
                autoPlay
                controls
                muted
                loop
              />
            </div>
          </div>
        </section>

        <section className="section-features min-h-screen overflow-hidden bg-violet-500 px-4 pb-16">
          <div className="icon-arrow animate-on-scroll mx-auto mb-2 grid h-14 w-14 rounded-full bg-white shadow-xl transition duration-150 lg:h-20 lg:w-20">
            <TbArrowDownCircle
              className="m-auto h-10 w-10 stroke-violet-500 lg:h-14 lg:w-14"
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
                  height="680"
                  aria-hidden
                  loading="lazy"
                />
              </div>
            </div>
            <div className="feature-content grid gap-4 px-4 <lg:-mt-8">
              <h3 className="flex flex-col items-start gap-2 text-2xl font-black  text-white md:text-3xl">
                <span className="flex h-16 w-16 rounded-md border-2 border-violet-350 bg-violet-500 text-5xl ring-2 ring-violet-200">
                  <IconCheck className="m-auto" />
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
                  Un espace "inbox" pour les choses dont vous devez vous
                  rappelez
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
                    Pour mieux savoir où vous en êtes, les tâches ont un état{" "}
                    <em>commencée</em>, <em>terminée</em>, <em>validée</em> ou{" "}
                    <em>refusée</em>
                  </span>
                </li>
              </ul>

              <Link href="/app">
                <a className="button is-filled group relative mt-2 justify-center justify-self-start bg-white bg-gradient-to-l px-8 py-3 font-bold uppercase text-violet-500">
                  Suivi des projets
                  <IconChevronRight className="scale-75" />
                  <span className="absolute left-1/2 top-full block -translate-x-1/2 -translate-y-2 rounded-sm bg-violet-500 px-2 py-1 text-xs text-violet-50 shadow-sm transition group-hover:text-white">
                    Testez-le
                  </span>
                </a>
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
                  height="680"
                  aria-hidden
                  loading="lazy"
                />
              </div>
            </div>
            <div className="feature-content grid gap-4 px-4 <lg:-mt-8 lg:pl-0">
              <h3 className="flex flex-col items-start gap-2 text-2xl font-black text-white md:text-3xl">
                <span className="flex h-16 w-16 rounded-md  border-2 border-violet-350 bg-violet-500 text-5xl ring-2 ring-violet-200">
                  <IconCashed className="m-auto h-8 w-8" />
                </span>
                Suivez vos factures et votre chiffre d'affaires
              </h3>
              <ul className="grid gap-4">
                <li className="flex items-center gap-2 text-white/80">
                  <span className="rounded-md border-2 border-violet-350 bg-violet-500 ring-2 ring-violet-200">
                    <IconCheck />
                  </span>
                  Votre chiffre d'affaires réalisé et à venir
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <span className="rounded-md border-2 border-violet-350 bg-violet-500 ring-2 ring-violet-200">
                    <IconCheck />
                  </span>
                  Ayez un aperçu direct de vos factures à faire, celles envoyées
                  et celles en retard
                </li>
              </ul>
              <Link href="/app/suivi-chiffre-d-affaires">
                <a className="button is-filled viol group relative mt-2 justify-center justify-self-start bg-white bg-gradient-to-l px-8 py-3 font-bold uppercase text-violet-500">
                  Suivi du <abbr title="Chiffre d'affaires">C.A.</abbr>
                  <IconChevronRight className="scale-75" />
                  <span className="absolute left-1/2 top-full block -translate-x-1/2 -translate-y-2 rounded-sm bg-violet-500 px-2 py-1 text-xs text-violet-50 shadow-sm transition group-hover:text-white">
                    Testez-le
                  </span>
                </a>
              </Link>
            </div>
          </div>
        </section>

        <footer className="section-footer flex flex-col items-center overflow-hidden pb-10 <sm:pb-20">
          <DividerWave class="w-[150vw]" />
          <div className="-mt-4 rounded-md rounded-b-none text-center">
            <LogoCockpitt className="inline-block h-11" />
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandingPage
