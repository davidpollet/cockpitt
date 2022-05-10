import type { NextPage, NextPageContext } from "next"
import { ReactElement, useEffect } from "react"
import { RootState, store } from "@store/store"

import AppWrapper from "@components/AppWrapper"
import IncomesTracker from "views/IncomesTracker"
import { connectToDatabase } from "@helpers/db"
import { getSession } from "next-auth/react"
import { nanoid } from "nanoid"
import { setUserData } from "@store/features/userSlice"
import { useSelector } from "react-redux"

const Home: NextPage = ({ user }: any) => {
  useEffect(() => {
    if (user) {
      store.dispatch(setUserData(user))
      console.log(user)
    }
  }, [user])

  return (
    <AppWrapper>
      <IncomesTracker />
    </AppWrapper>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession({ req: context.req })
  if (!session) {
    return {
      props: {},
    }
  }

  const userFromSession = {
    email: session?.user?.email,
    username: session?.user?.name,
    picture: session?.user?.image,
    id: session?.id || nanoid(),
  }

  const client = await connectToDatabase()
  const usersCollection = client.db().collection("users")
  let user = await usersCollection.findOne({
    email: session?.user?.email,
  })

  if (user) {
    user = { ...user, id: user._id.toString() }
    delete user.password
  } else {
    await usersCollection.insertOne(userFromSession)
  }

  await store.dispatch(setUserData(user))

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)) || userFromSession,
    },
  }
}

export default Home
