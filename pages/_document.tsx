import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="icon" href="/img/favicon.ico" sizes="any" />
        <link rel="icon" href="/img/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
