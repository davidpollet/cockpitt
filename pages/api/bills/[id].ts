import { NextApiRequest, NextApiResponse } from "next"

import { BILLS_COLLECTION } from "./../../../src/lib/utils/db"
import { Db } from "mongodb"
import { MongoClient } from "mongodb"
import { connectToDatabase } from "src/lib/utils/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client: MongoClient
  let db: Db
  const { id } = req.query
  const { method } = req

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

  switch (method) {
    case "GET":
      try {
        const billsCollection = client.db().collection(BILLS_COLLECTION)
        await billsCollection
          .find({ ownerId: id }, { projection: { _id: 0 } })
          .toArray()
          .then((response) => res.status(200).json(response))
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
          .collection(BILLS_COLLECTION)
          .updateOne({ id: id }, { $set: { ...bill } })
          .then(() => {
            res.status(200).json({ message: "Facture modifiée !" })
          })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de modifier les données",
        })
      }
      break
    case "DELETE":
      try {
        const { id } = req.query
        await db
          .collection(BILLS_COLLECTION)
          .deleteOne({ id })
          .then((response) => {
            if (response.deletedCount === 0) {
              res.status(404).json({ message: "Facture non trouvée !" })
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
  }

  client.close()
}

export default handler
