import AppWrapper from "@components/AppWrapper"
import Head from "next/head"
import IncomesTracker from "views/IncomesTracker"
import type { NextPage } from "next"
import getSsrUserData from "utils/getSsrUserData"
import { initBills } from "@store/features/incomeSlice"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Suivi du Chiffre d'affaires - Cockpitt</title>
      </Head>
      <AppWrapper>
        <IncomesTracker />
      </AppWrapper>
    </>
  )
}

export const getServerSideProps = getSsrUserData("/bills", initBills)

export default Home
