import { LOCAL_USER_ID, getLocalStorageData } from "src/lib/utils/localStorage"

import { Project } from "src/features/task-tracker/Project"
import React from "react"
import { projectsApi } from "src/lib/utils/FetchWrapper"
import { showToast } from "src/lib/utils/showToast"
import { useProjectstore } from "./useProjectsStore"
import useSWR from "swr"
import { useUser } from "../user-auth/useUser"

let localProjectsSyncedToDB = false

export function useProjects() {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const { user, status: userStatus } = useUser()

  const {
    dummyProjects,
    addDummyProjects,
    removeDummyProjects,
    localProjects,
    remoteProjects,
    setProjects,
  } = useProjectstore()

  const shouldFetch = Boolean(user?.email)
  const {
    data: projectsFetched,
    isLoading: swrLoading,
    mutate,
  } = useSWR<Project[]>(shouldFetch ? `/api/projects/${user?.id}` : null)

  const [isLoading, setIsLoading] = React.useState(swrLoading)
  const [isMerging, setIsMerging] = React.useState(false)

  React.useEffect(() => {
    if (!isMerging) setIsLoading(swrLoading)
  }, [swrLoading, isMerging])

  // Data fetched -> Local state
  React.useEffect(() => {
    if (Array.isArray(projectsFetched)) {
      setProjects("remoteProjects", projectsFetched)
    }
  }, [projectsFetched, setProjects])

  // LocalStorage -> Local state
  React.useEffect(() => {
    const shouldSyncLocalStorage =
      typeof window !== "undefined" && localProjects.length === 0
    if (shouldSyncLocalStorage) {
      const projectsLocalStorage = getLocalStorageData("localProjects")
      const hasBillsToSync =
        Array.isArray(projectsLocalStorage) && projectsLocalStorage.length > 0
      if (hasBillsToSync) {
        setProjects("localProjects", projectsLocalStorage)
      }
    }
  }, [userStatus, localProjects.length, setProjects])

  const projects = React.useMemo(
    () => remoteProjects.concat(localProjects, dummyProjects),
    [remoteProjects, localProjects, dummyProjects],
  )

  const addNewProject = React.useCallback(
    function addNewProject(project: Project) {
      setIsUpdating(true)

      if (project?.ownerId === LOCAL_USER_ID) {
        setProjects("localProjects", [project, ...localProjects])
        setIsUpdating(false)
        return
      }

      async function addRemoteProject(project: Project) {
        try {
          const response = await projectsApi.post(project)
          if (response.ok) {
            return [project, ...remoteProjects]
          } else {
            showToast("Impossible d'ajouter le projet.", "error")
            return remoteProjects
          }
        } catch {
          showToast("Impossible d'ajouter le projet.", "error")
          return remoteProjects
        } finally {
          setIsUpdating(false)
        }
      }
      mutate(addRemoteProject(project), {
        optimisticData: [project, ...remoteProjects],
      })
    },
    [localProjects, mutate, setProjects, remoteProjects],
  )

  // LocalStorage -> DB
  React.useEffect(() => {
    const userSignedWithLocalProjects =
      user?.id && localProjects.length > 0 && Array.isArray(projectsFetched)

    if (!userSignedWithLocalProjects || localProjectsSyncedToDB) return
    localProjectsSyncedToDB = true

    showToast("Syncronisation des projets ajoutés hors connexion", "info")
    setIsMerging(true)
    setIsLoading(true)

    for (const localProject of localProjects) {
      addNewProject({ ...localProject, ownerId: user.id })
    }

    setProjects("localProjects", [])
    setIsLoading(false)
    setIsMerging(false)
  }, [
    addNewProject,
    setProjects,
    localProjects,
    user?.id,
    remoteProjects,
    projectsFetched,
  ])

  return {
    projects,
    addDummyProjects,
    removeDummyProjects,
    isLoading,
    mutate,
    addNewProject,
    isUpdating,
  }
}
