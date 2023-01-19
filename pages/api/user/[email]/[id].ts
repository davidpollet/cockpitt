import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client
  const { method } = req
  const { email, id } = req.query
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
    case "PATCH":
      try {
        const userCollection = client.db().collection("users")
        await userCollection
          .updateOne({ email }, { $set: { id } })
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
