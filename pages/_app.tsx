import "../src/styles/styles.css"
import "../src/styles/nprogress.css"

import type { AppProps } from "next/app"
import React from "react"
import { SWRConfig } from "swr"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { fetcher } from "src/lib/utils/fetcher"
import { useLoadingProgress } from "src/lib/hooks/useLoadingProgress"

type App = {
  Component: AppProps["Component"]
  pageProps: {
    session: Session
    pageProps: AppProps
  }
}

function Cockpitt({ Component, pageProps: { session, ...pageProps } }: App) {
  useLoadingProgress()
  return (
    <>
      <SessionProvider session={session}>
        <SWRConfig value={{ fetcher }}>
          <Component {...pageProps} />
        </SWRConfig>
      </SessionProvider>
    </>
  )
}

export default Cockpitt
