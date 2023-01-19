import FetchWrapper from "@helpers/FetchWrapper"
import { GetServerSidePropsContext } from "next"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"
import { nanoid } from "nanoid"

function getSsrUserData(
  dataApiPath: string,
  dataDispatchFn: Function,
  options = {
    protectedPage: false,
    redirectTo: "/login",
  },
) {
  return async function (context: GetServerSidePropsContext) {
    const dev = process.env.NODE_ENV !== "production"
    const server = dev
      ? "http://localhost:3000"
      : "https://cockpitt.vercel.app/"

    const session = await getSession({ req: context.req })
    const api = new FetchWrapper(`${server}/api`)
    if (!session) {
      if (options.protectedPage) {
        context.res.writeHead(302, { Location: options.redirectTo })
        context.res.end()
      }
      return {
        props: {},
      }
    }

    type User = Session["user"] & { id?: string }
    let user: User = {
      ...session.user,
    }

    let userDb = await api.get(`/user/${user.email}`)

    if (!userDb.email) {
      user.id = nanoid()
      await api.post("/user", user)
    } else {
      user = userDb
    }

    const userData = await api.get(`${dataApiPath}/${user.id}`)

    return {
      props: {
        user,
        userData,
      },
    }
  }
}

export default getSsrUserData
