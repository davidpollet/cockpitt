import FetchWrapper from "@helpers/FetchWrapper"
import { GetServerSidePropsContext } from "next"
import USER_ID_COOKIE_NAME from "@consts/userIdCookie"
import { getSession } from "next-auth/react"
import { nanoid } from "nanoid"
import nookies from "nookies"

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
    const URL = process.env.NEXT_PUBLIC_SITE_URL
    const api = new FetchWrapper(`${URL}/api`)
    if (!session) {
      nookies.destroy(context, USER_ID_COOKIE_NAME)

      if (options.protectedPage) {
        context.res.writeHead(302, { Location: options.redirectTo })
        context.res.end()
      }
      return {
        props: {},
      }
    }

    let { userId } = nookies.get(context)
    let user = {
      ...session.user,
      id: userId,
    }

    if (!user.id) {
      let userDb = await api.get(`/user/${user.email}`)
      if (userDb.id) {
        user.id = userDb.id
      } else {
        userId = nanoid()
        try {
          await api.post(`/user/`, { ...user, id: userId })
          user.id = userId
        } catch (err) {
          throw new Error("Erreur pendant la création de l'utilisateur")
        }
      }

      nookies.set(context, USER_ID_COOKIE_NAME, user.id, {
        expires: new Date(session.expires),
        SameSite: "strict",
      })
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
