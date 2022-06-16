import { createSlice } from "@reduxjs/toolkit"
import dummyProjects from "@consts/dummyTasks"
import projectProps from "@localTypes/projectProps"
import { taskProps } from "@localTypes/taskProps"

const initialState: projectProps[] = []

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    initProjects: (state, action) => {
      state = action.payload
      return state
    },

    removeDummyProjects: (state, action: { payload: projectProps[] }) => {
      state = action.payload.filter(({ isDummy }) => !isDummy)
      return state
    },

    addDummiesProjects: (state) => {
      state = [...state, ...dummyProjects]
      return state
    },

    deleteTask: (state, action: { payload: taskProps }) => {
      const projectIndex = state.findIndex(
        (p) => p.name === action.payload.project
      )
      state[projectIndex].tasks = state[projectIndex].tasks.filter(
        (t) => t.id !== action.payload.id
      )
    },

    deleteProject: (state, action: { payload: string }) => {
      state = state.filter((project) => project.id !== action.payload)
      return state
    },

    updateProject: (state, action: { payload: projectProps }) => {
      state = state.map((project) => {
        if (project.id === action.payload.id) {
          project.name = action.payload.name
          project.tasks = action.payload.tasks.map((task) => ({
            ...task,
            project: action.payload.name,
          }))
          project.isExpanded = action.payload.isExpanded
        }
        return project
      })
    },

    updateTask: (state, action: { payload: taskProps }) => {
      state = state.map((project) => {
        if (project.name === action.payload.project) {
          project.tasks = project.tasks.map((task) => {
            if (task.id === action.payload.id) {
              task = action.payload
            }
            return task
          })
        }
        return project
      })
    },

    addNewTask: (state, action) => {
      state = state.map((project) => {
        if (project.id === action.payload.projectId) {
          project.tasks.push(action.payload)
        }
        return project
      })
    },

    addNewProject: (state, action: { payload: projectProps }) => {
      state.push(action.payload)
    },
  },
})

export const {
  initProjects,
  addDummiesProjects,
  removeDummyProjects,
  deleteTask,
  deleteProject,
  updateProject,
  updateTask,
  addNewTask,
  addNewProject,
} = todosSlice.actions

export default todosSlice.reducer
