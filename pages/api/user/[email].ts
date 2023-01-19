import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client
  const { email } = req.query
  const { method } = req

  try {
    client = await connectToDatabase()
  } catch (error) {
    res.status(500).json({
      error,
      message: "Impossible de se connecter à la base de donnée",
    })
    return
  }

  switch (method) {
    case "GET":
      try {
        const userCollection = client.db().collection("users")
        await userCollection
          .findOne({ email: email }, { projection: { _id: 0 } })
          .then((response) => {
            return res.status(200).json(response)
          })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de récupérer les données",
        })
      }
      break

    default:
      throw method
  }

  client.close()
}

export default handler
