import AppWrapper from "@components/AppWrapper"
import IncomesTracker from "views/IncomesTracker"
import type { NextPage } from "next"
import getSsrUserData from "utils/getSsrUserData"
import { initBills } from "@store/features/incomeSlice"

const Home: NextPage = () => {
  return (
    <AppWrapper>
      <IncomesTracker />
    </AppWrapper>
  )
}

export const getServerSideProps = getSsrUserData("/bills", initBills)

export default Home
