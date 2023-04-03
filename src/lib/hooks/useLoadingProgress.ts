import NProgress from "nprogress"
import React from "react"
import Router from "next/router"

export function useLoadingProgress() {
  NProgress.configure({ showSpinner: false })

  React.useEffect(() => {
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
}
