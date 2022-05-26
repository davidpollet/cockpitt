import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  let client: any
  let db: any

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

  const user = req.body

  if (!user.id) {
    return res
      .status(422)
      .json({ error: "L'utilisateur doit avoir au moins un uid" })
  }

  await db
    .collection("users")
    .insertOne(user)
    .then(() => res.status(201).json({ message: "bill insered !" }))
    .catch(() => res.status(500).json({ error: "An error occured" }))
    .finally(() => client.close())
}

export default handler
