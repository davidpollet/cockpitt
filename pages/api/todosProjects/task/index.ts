import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client: any
  let db: any
  const task = req.body

  if (task.owner === "demo") {
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

  const ProjectCollection = await db.collection("todosProjects")
  const projectToUpdate = await ProjectCollection.findOne(
    {
      id: task.projectId,
    },
    { projection: { _id: 0 } }
  )

  projectToUpdate.tasks.push(task)

  await ProjectCollection.updateOne(
    { id: task.projectId },
    { $set: { ...projectToUpdate } }
  )
    .then(() => res.status(201).json({ message: "Tâche insérée !" }))
    .catch(() =>
      res.status(500).json({ error: "Erreur pendant l'insertion de la tâche" })
    )
    .finally(() => client.close())
}

export default handler
