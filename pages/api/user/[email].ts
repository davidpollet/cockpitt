import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client
  let db

  try {
    client = await connectToDatabase()
    db = client.db()
  } catch (error) {
    res.status(500).json({
      error,
      message: "Impossible de se connecter à la base de donnée",
    })
    return
  }

  const { email } = req.query
  const { method } = req

  switch (method) {
    case "GET":
      try {
        const usersCollection = client.db().collection("users")
        await usersCollection.findOne({ email }).then((response) => {
          if (!response) {
            res.status(404).json({
              error: "Aucun utilisateur trouvé",
              message: "Aucun utilisateur trouvé",
            })
          } else {
            res.status(200).json(response)
          }
        })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de récupérer les données",
        })
      }
      break

    case "PATCH":
      try {
        const user = req.body
        delete user._id
        await db.collection("users").updateOne({ email }, { $set: { ...user } })
        res.status(201).json({ message: "Facture modifiée !" })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de modifier les données",
        })
      }
      break

    case "DELETE":
      try {
        let { id } = req.query
        id = id[0]
        await db
          .collection("users")
          .deleteOne({ id })
          .then((response) => {
            if (response.deletedCount === 0) {
              return res.status(404).json({ message: "Facture non trouvée !" })
            } else {
              res.status(200).json({ message: "Facture supprimée !" })
            }
          })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de suprimer les données",
        })
      }
      break

    default:
      null
  }

  client.close()
}

export default handler
