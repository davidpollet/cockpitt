import { NextApiRequest, NextApiResponse } from "next"

import { connectToDatabase } from "@helpers/db"
import { taskProps } from "@localTypes/taskProps"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client
  let db
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
      throw new Error(
        "La méthode GET n'est pas implémentée. Utilisez /api/todosProjects/[userId] ppour récupérer les projets avec les tâches"
      )

    case "PATCH":
    case "PUT":
      try {
        const taskToUpdate = req.body
        const ProjectCollection = db.collection("todosProjects")
        const updatedProject = await ProjectCollection.findOne(
          {
            id: taskToUpdate.projectId,
          },
          { projection: { _id: 0 } }
        )
        const updatedTasks = updatedProject?.tasks.map((task: taskProps) => {
          if (task.id === taskToUpdate.id) return taskToUpdate
          return task
        })

        if (!updatedProject)
          res.status(404).json({ message: "Aucun projet ne correspond" })
        else updatedProject.tasks = updatedTasks

        await db
          .collection("todosProjects")
          .updateOne(
            { id: taskToUpdate.projectId },
            { $set: { ...updatedProject } }
          )
          .then((response) => {
            if (response.modifiedCount === 0) {
              res.status(404).json({
                message: "Aucune Projet correspondante n'a été trouvée",
              })
            }
          })
        res.status(200).json({ message: "Tâche modifiée !" })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de modifier les données",
        })
      }
      break

    case "DELETE":
      try {
        const taskToDelete = req.body
        const ProjectCollection = db.collection("todosProjects")
        const updatedProject = await ProjectCollection.findOne(
          {
            id: taskToDelete.projectId,
          },
          { projection: { _id: 0 } }
        )
        const updatedTasks = updatedProject?.tasks.filter(
          (task: taskProps) => task.id !== taskToDelete.id
        )

        if (!updatedProject)
          res.status(404).json({ message: "Aucun projet ne correspond" })
        else updatedProject.tasks = updatedTasks

        await db
          .collection("todosProjects")
          .updateOne(
            { id: taskToDelete.projectId },
            { $set: { ...updatedProject } }
          )
          .then((response) => {
            if (response.modifiedCount === 0) {
              res.status(404).json({
                message: "Aucune Projet correspondante n'a été trouvée",
              })
            }
          })
        res.status(200).json({ message: "Tâche supprimée !" })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de modifier les données",
        })
      }
      break

    default:
      null
  }

  client.close()
}

export default handler
