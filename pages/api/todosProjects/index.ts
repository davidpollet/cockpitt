import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client: any
  let db: any
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
    .collection("todosProjects")
    .insertOne(project)
    .then(() => res.status(201).json({ message: "Projet inséré !" }))
    .catch(() =>
      res.status(500).json({ error: "Erreur pendant l'insertion du projet" })
    )
    .finally(() => client.close())
}

export default handler
