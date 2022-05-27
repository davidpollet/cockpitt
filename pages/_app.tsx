import "@styles/styles.css"

import type { AppProps } from "next/app"
import { IconContext } from "react-icons"
import { Provider } from "react-redux"
import Script from "next/script"
import { SessionProvider } from "next-auth/react"
import getStore from "@store/store"

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const store = getStore(pageProps.initialState)
  return (
    <>
      <SessionProvider session={session}>
        <Provider store={store}>
          <IconContext.Provider
            value={{
              color: "currentColor",
            }}
          >
            <Component {...pageProps} />
          </IconContext.Provider>
        </Provider>
      </SessionProvider>
    </>
  )
}

export default MyApp
