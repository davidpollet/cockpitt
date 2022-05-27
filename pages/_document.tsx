import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <script
          id="darkmode"
          dangerouslySetInnerHTML={{
            __html: `
          ;(function darkModeCheck () {
            const isDarkMode =
              localStorage.getItem('color-theme') === 'dark' ||
              (!('color-theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
            if (isDarkMode) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          })()
          `,
          }}
        />
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
