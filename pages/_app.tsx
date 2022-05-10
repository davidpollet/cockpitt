import "@styles/globals.css"

import type { AppProps } from "next/app"
import { IconContext } from "react-icons"
import { Provider } from "react-redux"
import { SessionProvider } from "next-auth/react"
import { store } from "../app/store/store"

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
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
  )
}

export default MyApp
