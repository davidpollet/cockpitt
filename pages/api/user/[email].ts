import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"
import { nanoid } from "nanoid"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client
  let db
  const { email } = req.query

  if (!email) {
    res.status(400).send("L'email est requis")
    return
  }

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

  const { method } = req

  switch (method) {
    case "GET":
      try {
        const usersCollection = client.db().collection("users")
        await usersCollection
          .findOne({ email }, { projection: { _id: 0 } })
          .then((response) => {
            if (!response) {
              res.status(404).json({
                error: "Aucun utilisateur trouvé",
                message: "Aucun utilisateur trouvé",
              })
            } else {
              const user = { ...response }
              if (!user.id) {
                user.id = nanoid()
                usersCollection.updateOne({ email }, { $set: { id: user.id } })
              }
              res.status(200).json(user)
              // res.status(200).json(response)
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
