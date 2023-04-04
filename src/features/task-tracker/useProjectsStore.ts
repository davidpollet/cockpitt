import { Project } from "./Project"
import { create } from "zustand"
import { dummyProjects } from "./dummyProjects"
import { setLocalStorageData } from "src/lib/utils/localStorage"

type ProjectsStore = {
  dummyProjects: Project[]
  addDummyProjects: () => void
  removeDummyProjects: () => void
  localProjects: Project[]
  remoteProjects: Project[]
  setProjects: (
    type: "dummyProjects" | "localProjects" | "remoteProjects",
    payload: Project[],
  ) => void
}

export const useProjectstore = create<ProjectsStore>((set) => ({
  dummyProjects: [],
  addDummyProjects: () => set((state) => ({ ...state, dummyProjects })),
  removeDummyProjects: () => set((state) => ({ ...state, dummyProjects: [] })),
  localProjects: [],
  remoteProjects: [],
  setProjects: (type, payload) =>
    set((state) => {
      if (type === "localProjects") {
        setLocalStorageData("localProjects", payload)
      }
      return { ...state, [type]: payload }
    }),
}))
