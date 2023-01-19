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

    type User = Session["user"] & { id: string }
    let user: User = {
      ...session.user,
      id: nanoid(),
    }

    const userDB = await api.get(`/user/${user.email}`)
    if (!userDB.id) {
      await api.patch(`/user/${user.email}/${user.id}`, user.id)
    }

    const userData = await api.get(`${dataApiPath}/${userDB.id}`)

    return {
      props: {
        user: userDB || user,
        userData,
      },
    }
  }
}

export default getSsrUserData
