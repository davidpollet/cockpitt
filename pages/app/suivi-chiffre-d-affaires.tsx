import AppWrapper from "src/ui/AppWrapper"
import Head from "next/head"
import { IncomesTracker } from "src/features/income-tracker/IncomesTracker"
import type { NextPage } from "next"

const Incomes: NextPage = () => {
  return (
    <>
      <Head>
        <title>Suivi du Chiffre d'affaires - Cockpitt</title>
        <meta
          name="description"
          content="Suivez les factures à venir, celles qui ont été envoyées ou encaissé et voyez l'évolution de votre chiffre d'affaires"
        />
      </Head>
      <AppWrapper>
        <IncomesTracker />
      </AppWrapper>
    </>
  )
}

export default Incomes
