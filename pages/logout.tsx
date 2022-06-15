import AppWrapper from "@components/AppWrapper"
import Head from "next/head"
import type { NextPage } from "next"

const MesTaches: NextPage = () => {
  return (
    <>
      <Head>
        <title>Suivi du Chiffre d'affaires - Cockpitt</title>
      </Head>
      <AppWrapper>Au revoir</AppWrapper>
    </>
  )
}

// export const getServerSideProps = getSsrUserData("/bills", initBills)

export default MesTaches
