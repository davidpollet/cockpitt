import {
  addNewProject as storeAddNewProject,
  addNewTask as storeAddNewTask,
  deleteProject as storeDeleteProject,
  deleteTask as storeDeleteTask,
  updateProject as storeUpdateProject,
  updateTask as storeUpdateTask,
} from "@store/features/todosSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"

import FetchWrapper from "@helpers/FetchWrapper"
import { RootState } from "@store/store"
import projectProps from "@localTypes/projectProps"
import showToast from "@helpers/showToast"
import { taskProps } from "@localTypes/taskProps"
import useUser from "./useUser"

const projectsApi = new FetchWrapper("/api/todosProjects")
const tasksApi = new FetchWrapper("/api/todosProjects/task")

function useFetchProjects() {
  const { user } = useUser()
  const userLoggedIn = Boolean(user.id)
  let projects: projectProps[] = []

  async function getProjects() {
    projects = await projectsApi.get(`/${user.id}`)
  }

  if (userLoggedIn) getProjects()
  return projects
}

function useAddNewProject() {
  const dispatch = useDispatch()
  const [isAdding, setIsAdding] = useState(false)
  const { user } = useUser()

  async function addNewProject(project: projectProps) {
    dispatch(storeAddNewProject(project))
    if (user.id) {
      try {
        await projectsApi.post("/", project)
      } catch {
        showToast("Impossible d'ajouter le project", "error")
        dispatch(storeDeleteProject(project.id))
      } finally {
        setIsAdding(false)
      }
    }
  }

  return { addNewProject, user, isAdding }
}

function useUpdateProject() {
  const dispatch = useDispatch()
  const projects = useSelector((state: RootState) => state.todos)
  const [isUpdating, setIsUpdating] = useState(false)

  async function updateProject(project: projectProps) {
    setIsUpdating(true)
    const oldProject = projects.find((b) => b.id === project.id)
    dispatch(storeUpdateProject(project))

    if (!project.owner || project.isDummy) {
      setIsUpdating(false)
      return
    }

    try {
      await projectsApi.patch(`/${project.id}`, project)
    } catch {
      showToast("Impossible de modifier le projet", "error")
      oldProject && dispatch(storeUpdateProject(oldProject))
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    function alertPageRefresh() {
      if (isUpdating) {
        alert(
          "La dernière modication est en cours d'application sur le serveur et pourrait être perdus si vous quittez/ou rafraichissez la page."
        )
      }
    }
    window.addEventListener("beforeunload", alertPageRefresh)

    return () => {
      window.removeEventListener("beforeunload", alertPageRefresh)
    }
  }, [isUpdating])

  return {
    updateProject,
    isUpdating,
  }
}

function useToggleProject() {
  const dispatch = useDispatch()
  const { user } = useUser()

  async function toggleProject(project: projectProps) {
    dispatch(storeUpdateProject(project))

    if (!user.id) return
    await projectsApi.patch(`/${project.id}`, project)
  }

  return {
    toggleProject,
  }
}

function useDeleteProject() {
  const dispatch = useDispatch()
  const projects = useSelector((state: RootState) => state.todos)
  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteProject(project: projectProps) {
    dispatch(storeDeleteProject(project.id))
    setIsDeleting(true)

    if (project.isDummy || !project.owner) {
      setIsDeleting(false)
      return
    }

    const oldProject = projects.find((p) => p.id === project.id)

    try {
      await projectsApi.delete(`/${project.id}`, project)
    } catch {
      showToast("Impossible de supprimer le project", "error")
      oldProject && dispatch(storeAddNewProject(oldProject))
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteProject,
    isDeleting,
  }
}

function useAddNewTask() {
  const dispatch = useDispatch()
  const [isAdding, setIsAdding] = useState(false)
  const { user } = useUser()

  async function addNewTask(task: taskProps) {
    dispatch(storeAddNewTask(task))
    if (!task.owner || task.isDummy) return

    setIsAdding(true)
    try {
      await tasksApi.post("/", task)
    } catch {
      showToast("Impossible d'ajouter la tâche", "error")
      dispatch(storeDeleteTask(task))
    } finally {
      setIsAdding(false)
    }
  }

  return { addNewTask, user, isAdding }
}

function useUpdateTask() {
  const dispatch = useDispatch()
  const projects = useSelector((state: RootState) => state.todos)
  const [isUpdating, setIsUpdating] = useState(false)

  async function updateTask(task: taskProps) {
    setIsUpdating(true)
    const oldProject = projects.find((b) => b.id === task.projectId)
    const oldTask = oldProject?.tasks.find((t) => t.id === task.id)
    dispatch(storeUpdateTask(task))

    if (!task.owner || task.isDummy) {
      setIsUpdating(false)
      return
    }

    try {
      await tasksApi.patch(`/${task.projectId}`, task)
    } catch {
      showToast("Impossible de modifier la tâche", "error")
      oldTask && dispatch(storeUpdateTask(oldTask))
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    function alertPageRefresh() {
      if (isUpdating) {
        alert(
          "La dernière modication est en cours d'application sur le serveur et pourrait être perdus si vous quittez/ou rafraichissez la page."
        )
      }
    }
    window.addEventListener("beforeunload", alertPageRefresh)

    return () => {
      window.removeEventListener("beforeunload", alertPageRefresh)
    }
  }, [isUpdating])

  return {
    updateTask,
    isUpdating,
  }
}

function useDeleteTask() {
  const dispatch = useDispatch()

  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteTask(task: taskProps) {
    dispatch(storeDeleteTask(task))
    setIsDeleting(true)

    if (!task.owner || task.isDummy) {
      setIsDeleting(false)
      return
    }

    try {
      await tasksApi.delete(`/${task.projectId}`, task)
    } catch {
      showToast("Impossible de supprimer le project", "error")
      dispatch(storeAddNewTask(task))
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteTask,
    isDeleting,
  }
}

export {
  useFetchProjects,
  useAddNewProject,
  useUpdateProject,
  useToggleProject,
  useDeleteProject,
  useAddNewTask,
  useUpdateTask,
  useDeleteTask,
}
