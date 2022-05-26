import FetchWrapper from "@helpers/FetchWrapper"
import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import getStore from "@store/store"
import { nanoid } from "nanoid"
import { setUserData } from "@store/features/userSlice"

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

    const userSession = {
      email: session.user?.email || "",
      nameFromAuthProvider: session.user?.name,
      avatar: session.user?.image,
      id: nanoid(),
    }

    let userDB = await api.get(`/user/${userSession.email}`)

    if (userDB) {
      store.dispatch(setUserData(userDB))
      const userData = await api.get(`${dataApiPath}/${userDB.id}`)
      store.dispatch(dataDispatchFn(userData))
    } else {
      await api.post(`/user/`, userSession)
      store.dispatch(setUserData(userSession))
    }

    return {
      props: {
        initialState: store.getState(),
      },
    }
  }
}

export default getSsrUserData
