import AppWrapper from "@components/AppWrapper"
import Head from "next/head"
import IncomesTracker from "views/IncomesTracker"
import type { NextPage } from "next"
import { billProps } from "@localTypes/billProps"
import getSsrUserData from "utils/getSsrUserData"
import { initBills } from "@store/features/incomeSlice"
import { setUserData } from "@store/features/userSlice"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { userProps } from "@localTypes/userProps"

const Incomes: NextPage<{ user: userProps; userData: billProps[] }> = (
  props
) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (props.user) dispatch(setUserData(props.user))
    if (props.userData) dispatch(initBills(props.userData))
  }, [props, dispatch])

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

export default Incomes
