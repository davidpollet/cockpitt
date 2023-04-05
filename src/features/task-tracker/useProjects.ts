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
    data: fetchedProjects,
    isLoading: swrLoading,
    mutate,
  } = useSWR<Project[]>(shouldFetch ? `/api/projects/${user?.id}` : null)

  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(swrLoading)
  const [isMerging, setIsMerging] = React.useState(false)

  React.useEffect(() => {
    if (!isMerging) setIsLoading(swrLoading)
  }, [swrLoading, isMerging])

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
        revalidate: true,
      })
    },
    [localProjects, mutate, setProjects, remoteProjects],
  )

  // LocalStorage -> DB
  React.useEffect(() => {
    if (localProjectsSyncedToDB) return

    const userSignedWithLocalProjects =
      localProjects.length > 0 && fetchedProjects?.length === 0

    if (!userSignedWithLocalProjects) return

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
    fetchedProjects,
  ])

  // Data fetched -> Local state
  React.useEffect(() => {
    const asFetchedProjectsToSync =
      Array.isArray(fetchedProjects) && fetchedProjects.length > 0
    if (asFetchedProjectsToSync) {
      setProjects("remoteProjects", fetchedProjects)
    }
  }, [fetchedProjects, setProjects])

  const projects = remoteProjects.concat(localProjects, dummyProjects)

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
