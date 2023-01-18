import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client: any
  let db: any
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
    .collection("bills")
    .insertOne(bill)
    .then(() => res.status(201).json({ message: "Facture insérée !" }))
    .catch(() =>
      res
        .status(500)
        .json({ error: "Erreur pendant l'insertion de la facture" })
    )
    .finally(() => client.close())
}

export default handler
