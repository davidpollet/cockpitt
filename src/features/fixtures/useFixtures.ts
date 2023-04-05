import { LOCAL_USER_ID } from "src/lib/utils/localStorage"
import React from "react"
import { defaultUser } from "../user-auth/defaultUser"
import { dummyBills } from "../income-tracker/dummyBills"
import { dummyProjects } from "./../task-tracker/dummyProjects"
import { dummyUser } from "../user-auth/dummyUser"
import { useBillStore } from "../income-tracker/useBillStore"
import { useProjectstore } from "../task-tracker/useProjectsStore"
import { useSession } from "next-auth/react"
import { useSessionStorage } from "react-use"
import { useUser } from "../user-auth/useUser"

export function useFixtures() {
  const { setProjects } = useProjectstore()
  const { setBills } = useBillStore()
  const { updateUser } = useUser()

  const { status: userStatus } = useSession()
  const [showFixtureBanner, setShowFixtureBanner] =
    useSessionStorage("showFixturesBanner")

  React.useEffect(() => {
    const isDevEnv = process.env.NODE_ENV === "development"
    const noUserSignedIn = userStatus === "unauthenticated"
    setShowFixtureBanner(isDevEnv && noUserSignedIn)
  }, [setShowFixtureBanner, userStatus])

  function injectFixtures() {
    const fixtureProjects = dummyProjects.map((p) => ({
      ...p,
      ownerId: LOCAL_USER_ID,
      isDummy: false,
    }))
    const fixtureBills = dummyBills.map((b) => ({
      ...b,
      ownerId: LOCAL_USER_ID,
      isDummy: false,
    }))
    const fixtureUser = { ...dummyUser, id: LOCAL_USER_ID }

    setProjects("localProjects", fixtureProjects)
    setBills("localBills", fixtureBills)
    updateUser(fixtureUser)
  }

  function clearFixtures() {
    setProjects("localProjects", [])
    setBills("localBills", [])
    updateUser(defaultUser)
  }

  function closeBanner() {
    setShowFixtureBanner(false)
  }

  return {
    injectFixtures,
    clearFixtures,
    closeBanner,
    showFixtureBanner,
  }
}
