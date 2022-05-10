import { Head, Html, Main, NextScript } from "next/document"

import darkModeWithoutFOUT from "@helpers/darkMode"

export default function Document() {
  return (
    <Html lang="fr">
      <Head />
      <script
        id="darkmode"
        dangerouslySetInnerHTML={{
          __html: darkModeWithoutFOUT,
        }}
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
