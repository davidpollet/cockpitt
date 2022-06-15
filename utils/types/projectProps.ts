import { taskProps } from "./taskProps"

type projectProps = {
  name: string
  isDummy: boolean
  owner: string
  tasks: taskProps[]
  id: string
  isExpanded: boolean
}

export default projectProps
