import { Db, MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

import { BILLS_COLLECTION } from "./../../../src/lib/utils/db"
import { connectToDatabase } from "src/lib/utils/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client: MongoClient
  let db: Db
  const bill = req.body

  if (bill.isDummy) {
    return res.status(200)
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

  await db
    .collection(BILLS_COLLECTION)
    .insertOne(bill)
    .then(() => res.status(201).json({ message: "Facture insérée !" }))
    .catch(() =>
      res
        .status(500)
        .json({ error: "Erreur pendant l'insertion de la facture" }),
    )
    .finally(() => client.close())
}

export default handler
