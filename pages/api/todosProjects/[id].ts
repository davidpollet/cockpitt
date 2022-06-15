import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client
  let db
  const { id } = req.query
  const { method } = req

  if (id.includes("demo")) {
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

  switch (method) {
    case "GET":
      try {
        const ProjectCollection = client.db().collection("todosProjects")
        await ProjectCollection.find({ owner: id }, { projection: { _id: 0 } })
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
        const project = req.body
        await db
          .collection("todosProjects")
          .updateOne({ id: id }, { $set: { ...project } })
          .then((response) => {
            if (response.modifiedCount === 0) {
              res.status(404).json({
                message: "Aucune Projet correspondante n'a été trouvée",
              })
            }
          })
        res.status(200).json({ message: "Projet modifiée !" })
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
          .collection("todosProjects")
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
