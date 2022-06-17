import { MouseEvent, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import AppWrapper from "@components/AppWrapper"
import Head from "next/head"
import type { NextPage } from "next"
import { RootState } from "@store/store"
import TasksTracker from "views/TasksTracker"
import { createNewProject } from "@helpers/tasksHelpers"
import getSsrUserData from "utils/getSsrUserData"
import { initProjects } from "@store/features/todosSlice"
import projectProps from "@localTypes/projectProps"
import { setUserData } from "@store/features/userSlice"
import { useAddNewProject } from "@hooks/todosHooks"
import { userProps } from "@localTypes/userProps"

function clickOutsideTargetProject(event: MouseEvent<HTMLElement>) {
  const target = event.target as HTMLElement
  const projectWrapperVisuallyTargeted = document.querySelector(
    ".project-wrapper.is-target"
  )

  if (
    !target.closest(".project-wrapper.is-target") &&
    !target.closest("nav a")
  ) {
    projectWrapperVisuallyTargeted?.classList.remove("is-target")
  }
}

const MesTaches: NextPage<{ user: userProps; userData: projectProps[] }> = ({
  user,
  userData: projects = [],
}) => {
  const dispatch = useDispatch()
  const { addNewProject } = useAddNewProject()
  const projectsFromStore = useSelector((state: RootState) => state.todos)

  useEffect(() => {
    if (user) dispatch(setUserData(user))

    if (projectsFromStore.length > 0) return

    if (projects.length > 0) {
      dispatch(initProjects(projects))
    } else {
      const owner = user?.id || null
      if (projectsFromStore.length === 0) {
        dispatch(initProjects(projects))
        addNewProject(createNewProject("Inbox", owner))
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>Mes tâches - Cockpitt</title>
        <meta
          name="description"
          content="Suivez vos tâches par projet et sur une seule page"
        />
      </Head>

      <AppWrapper onClick={clickOutsideTargetProject}>
        <TasksTracker />
      </AppWrapper>
    </>
  )
}

export const getServerSideProps = getSsrUserData("/todosProjects", initProjects)

export default MesTaches
