import "@styles/styles.css"
import "../public/css/nprogress.css"

import type { AppProps } from "next/app"
import { IconContext } from "react-icons"
import NProgress from "nprogress"
import { Provider } from "react-redux"
import Router from "next/router"
import { SessionProvider } from "next-auth/react"
import store from "@store/store"
import { useEffect } from "react"

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  NProgress.configure({ showSpinner: false })
  useEffect(() => {
    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    Router.events.on("routeChangeStart", handleRouteStart)
    Router.events.on("routeChangeComplete", handleRouteDone)
    Router.events.on("routeChangeError", handleRouteDone)

    return () => {
      Router.events.off("routeChangeStart", handleRouteStart)
      Router.events.off("routeChangeComplete", handleRouteDone)
      Router.events.off("routeChangeError", handleRouteDone)
    }
  }, [])
  return (
    <>
      <Provider store={store}>
        <SessionProvider session={session}>
          <IconContext.Provider
            value={{
              color: "currentColor",
            }}
          >
            <Component {...pageProps} />
          </IconContext.Provider>
        </SessionProvider>
      </Provider>
    </>
  )
}

export default MyApp
