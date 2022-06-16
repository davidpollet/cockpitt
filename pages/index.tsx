import { MouseEvent, useEffect } from "react"

import AppWrapper from "@components/AppWrapper"
import Head from "next/head"
import type { NextPage } from "next"
import TasksTracker from "views/TasksTracker"
import { createNewProject } from "@helpers/tasksHelpers"
import getSsrUserData from "utils/getSsrUserData"
import { initProjects } from "@store/features/todosSlice"
import projectProps from "@localTypes/projectProps"
import { setUserData } from "@store/features/userSlice"
import { useAddNewProject } from "@hooks/todosHooks"
import { useDispatch } from "react-redux"
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

const MesTaches: NextPage<{ user: userProps; userData: projectProps[] }> = (
  props
) => {
  const dispatch = useDispatch()
  const { addNewProject } = useAddNewProject()

  useEffect(() => {
    const projects = props.userData || []

    if (props.user) {
      dispatch(setUserData(props.user))
    }

    if (projects.length > 0) {
      dispatch(initProjects(projects))
    } else {
      const owner = props.user?.id || null
      dispatch(initProjects(projects))
      addNewProject(createNewProject("Inbox", owner))
    }
  }, [])

  return (
    <>
      <Head>
        <title>Suivi du Chiffre d'affaires - Cockpitt</title>
      </Head>

      <AppWrapper onClick={clickOutsideTargetProject}>
        <TasksTracker />
      </AppWrapper>
    </>
  )
}

export const getServerSideProps = getSsrUserData("/todosProjects", initProjects)

export default MesTaches
