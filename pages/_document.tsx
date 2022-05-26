import { Head, Html, Main, NextScript } from "next/document"

import darkModeWithoutFOUT from "@helpers/darkMode"

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%235412ce%22></rect><path d=%22M54.32 82.35L54.32 82.35Q48.46 82.35 43.14 80.38Q37.81 78.42 33.73 74.43Q29.65 70.45 27.20 64.45Q24.75 58.45 24.75 50.48L24.75 50.48Q24.75 42.61 27.15 36.51Q29.55 30.42 33.68 26.24Q37.81 22.06 43.38 19.86Q48.94 17.65 55.28 17.65L55.28 17.65Q61.33 17.65 66.22 20.10Q71.12 22.54 74.48 25.71L74.48 25.71L65.46 35.89Q63.25 33.97 60.85 32.91Q58.45 31.86 55.28 31.86L55.28 31.86Q52.40 31.86 49.90 33.10Q47.41 34.35 45.58 36.66Q43.76 38.96 42.70 42.32Q41.65 45.68 41.65 49.90L41.65 49.90Q41.65 58.74 45.68 63.44Q49.71 68.14 56.05 68.14L56.05 68.14Q59.12 68.14 61.66 66.75Q64.21 65.36 66.22 63.15L66.22 63.15L75.25 73.14Q71.31 77.74 65.98 80.05Q60.66 82.35 54.32 82.35Z%22 fill=%22%23ffffff%22></path></svg>"
        />
      </Head>
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
