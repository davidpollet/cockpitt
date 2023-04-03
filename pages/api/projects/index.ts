import { NextApiRequest, NextApiResponse } from "next"

import { Db } from "mongodb"
import { MongoClient } from "mongodb"
import { PROJECTS_COLLECTION } from "./../../../src/lib/utils/db"
import { connectToDatabase } from "src/lib/utils/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client: MongoClient
  let db: Db
  const project = req.body

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
    .collection(PROJECTS_COLLECTION)
    .insertOne(project)
    .then(() => res.status(201).json({ message: "Projet inséré !" }))
    .catch(() =>
      res.status(500).json({ error: "Erreur pendant l'insertion du projet" }),
    )
    .finally(() => client.close())
}

export default handler
