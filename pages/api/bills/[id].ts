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

  const { id } = req.query
  const { method } = req

  console.log(id)
  switch (method) {
    case "GET":
      try {
        const billsCollection = client.db().collection("bills")
        await billsCollection
          .find({ owner: id }, { projection: { _id: 0 } })
          .toArray()
          .then((response) => {
            res.status(200).json(response)
          })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de récupérer les données",
        })
      }
      break

    case "PATCH":
    case "PUT":
      try {
        const bill = req.body
        await db
          .collection("bills")
          .updateOne({ id: id }, { $set: { ...bill } })
          .then((response) => {
            if (response.modifiedCount === 0) {
              res.status(404).json({
                message: "Aucune facture correspondante n'a été trouvée",
              })
            }
          })
        res.status(200).json({ message: "Facture modifiée !" })
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
        await db
          .collection("bills")
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
