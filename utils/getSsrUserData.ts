import { MongoClient, WithoutId } from "mongodb"

import FetchWrapper from "@helpers/FetchWrapper"
import { GetServerSidePropsContext } from "next"
import { billProps } from "@localTypes/billProps"
import { connectToDatabase } from "@helpers/db"
import { dispatch } from "react-hot-toast/dist/core/store"
import { getSession } from "next-auth/react"
import getStore from "@store/store"
import { nanoid } from "nanoid"
import { setUserData } from "@store/features/userSlice"
import { userProps } from "@localTypes/userProps"

function getSsrUserData(
  dataApiPath: string,
  dataDispatchFn: Function,
  options = {
    protectedPage: false,
    redirectTo: "/login",
  }
) {
  return async function (context: GetServerSidePropsContext) {
    const session = await getSession({ req: context.req })

    if (!session) {
      if (options.protectedPage) {
        context.res.writeHead(302, { Location: options.redirectTo })
        context.res.end()
      }
      return {
        props: {},
      }
    }
    const store = getStore()
    const URL = process.env.SITE_URL

    const api = new FetchWrapper(`${URL}/api`)

    if (session.user?.email) {
      const client = await connectToDatabase()
      const db = client.db()
      const email = session.user.email
      const usersCollection = db.collection("users")
      const user: any = await usersCollection
        .findOne({ email }, { projection: { _id: 0, emailVerified: 0 } })
        .then((response) => (response ? response : null))

      if (!user.id) {
        user.id = nanoid()
        usersCollection.updateOne({ email }, { $set: { id: user.id } })
      }

      const billsCollection = db.collection("bills")
      const bills: any = await billsCollection
        .find({ owner: user.id }, { projection: { _id: 0 } })
        .toArray()
        .then((response) => (response ? response : []))

      store.dispatch(setUserData(user))
      store.dispatch(dataDispatchFn(bills))
    }

    return {
      props: {
        initialState: store.getState(),
      },
    }
  }
}

export default getSsrUserData
