import { Db, MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { PROJECTS_COLLECTION, connectToDatabase } from "src/lib/utils/db"

import { Project } from "src/features/task-tracker/Project"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client: MongoClient
  let db: Db
  const { id } = req.query
  const { method } = req
  const project: Project = req.body

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
        const ProjectCollection = client
          .db()
          .collection<Project>(PROJECTS_COLLECTION)
        await ProjectCollection.find(
          { ownerId: id },
          { projection: { _id: 0 } },
        )
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
        await db
          .collection<Project>(PROJECTS_COLLECTION)
          .updateOne({ id: id }, { $set: project })
          .then(() => {
            res.status(200).json({ message: "Projet modifié !" })
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
          .collection(PROJECTS_COLLECTION)
          .deleteOne({ id })
          .then((response) => {
            if (response.deletedCount === 0) {
              return res.status(404).json({ message: "Projet non trouvé !" })
            } else {
              res.status(200).json({ message: "Projet supprimé !" })
            }
          })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de suprimer le projet",
        })
      }
      break

    default:
      null
  }

  client.close()
}

export default handler
