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
        <meta
          name="title"
          content="Cockpitt • Suivez vos tâches et votre chiffre d'affaires"
        />
        <meta name="description" content="" />

        <meta property="og:url" content="https://cockpitt.vercel.app/" />
        <meta
          property="og:title"
          content="Cockpitt • Suivez vos tâches et votre chiffre d'affaires"
        />
        <meta property="og:description" content="" />
        <meta
          property="og:image"
          content="https://cockpitt.vercel.app/img/og.jpg"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cockpitt.vercel.app/" />
        <meta
          property="twitter:title"
          content="Cockpitt • Suivez vos tâches et votre chiffre d'affaires"
        />
        <meta property="twitter:description" content="" />
        <meta
          property="twitter:image"
          content="https://cockpitt.vercel.app/img/og.jpg"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
