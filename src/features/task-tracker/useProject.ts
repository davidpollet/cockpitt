import { LOCAL_USER_ID } from "src/lib/utils/localStorage"
import { Project } from "./Project"
import React from "react"
import { Task } from "./Task"
import { projectsApi } from "./../../lib/utils/FetchWrapper"
import { showToast } from "src/lib/utils/showToast"
import { useProjects } from "./useProjects"
import { useProjectstore } from "./useProjectsStore"

function useProject(projectId: Project["id"]) {
  const { projects, mutate } = useProjects()
  const project = projects.find(({ id }) => id === projectId)
  const { dummyProjects, localProjects, remoteProjects, setProjects } =
    useProjectstore()
  const [isUpdating, setIsUpdating] = React.useState(false)

  const updateProject = React.useCallback(
    function updateProject(updatedProject: Project) {
      const getUpdatedProjects = (projects: Project[]) =>
        projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      setIsUpdating(true)

      if (updatedProject?.isDummy) {
        setProjects("dummyProjects", getUpdatedProjects(dummyProjects))
        setIsUpdating(false)
        return
      }

      if (project?.ownerId === LOCAL_USER_ID) {
        setProjects("localProjects", getUpdatedProjects(localProjects))
        setIsUpdating(false)
        return
      }

      const updatedRemoteProjects = getUpdatedProjects(remoteProjects)
      async function updateRemoteProject(updatedProject: Project) {
        try {
          const response = await projectsApi.put(updatedProject)
          if (response.ok) {
            return updatedRemoteProjects
          } else {
            throw "La facture n'a pas pu être modifié"
          }
        } catch {
          return remoteProjects
        } finally {
          setIsUpdating(false)
        }
      }

      return mutate(updateRemoteProject(updatedProject), {
        optimisticData: updatedRemoteProjects,
      })
    },
    [
      dummyProjects,
      localProjects,
      remoteProjects,
      mutate,
      project?.ownerId,
      setProjects,
    ],
  )

  function deleteProject() {
    if (!project) throw "Should not happen"
    const getProjectsWithoutProjectTarget = (projects: Project[]) =>
      projects.filter(({ id }) => id !== project.id)

    setIsUpdating(true)
    if (project?.isDummy) {
      setProjects(
        "dummyProjects",
        getProjectsWithoutProjectTarget(dummyProjects),
      )
      setIsUpdating(false)
      return
    }
    if (project?.ownerId === LOCAL_USER_ID) {
      setProjects(
        "localProjects",
        getProjectsWithoutProjectTarget(localProjects),
      )
      setIsUpdating(false)
      return
    }

    const updatedRemoteProjects =
      getProjectsWithoutProjectTarget(remoteProjects)
    async function _deleteProject(projectToDelete: Project) {
      try {
        const response = await projectsApi.delete(projectToDelete)
        if (response.ok) {
          return updatedRemoteProjects
        } else {
          showToast("Impossible de supprimer le projet. Réessayez", "error")
          return [projectToDelete, ...projects]
        }
      } catch {
        showToast("Impossible de supprimer le projet. Réessayez", "error")
        return [projectToDelete, ...projects]
      } finally {
        setIsUpdating(false)
      }
    }
    mutate(_deleteProject(project), {
      optimisticData: updatedRemoteProjects,
    })
  }

  function addNewTask(task: Task) {
    if (!project) throw new Error("Aucun projet trouvé")

    const updatedProject: Project = {
      ...project,
      tasks: [task, ...project.tasks],
    }
    updateProject(updatedProject)
  }

  function updateTask(task: Task) {
    if (!project) throw new Error("Aucun project ne correspond à cette tâche")
    const updatedTasks = project.tasks.map((t) => (t.id === task.id ? task : t))
    const updatedProject: Project = { ...project, tasks: updatedTasks }
    updateProject(updatedProject)
  }

  function deleteTask(task: Task) {
    if (!project) throw new Error("Aucun project ne correspond à cette tâche")
    const updatedTasks = project.tasks.filter((t) => t.id !== task.id)
    const updatedProject: Project = { ...project, tasks: updatedTasks }
    updateProject(updatedProject)
  }

  return {
    project,
    deleteProject,
    updateProject,
    deleteTask,
    addNewTask,
    updateTask,
    isUpdating,
  }
}

export { useProjects, useProject }
