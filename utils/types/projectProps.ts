import { taskProps } from "./taskProps"

type projectProps = {
  name: string
  isDummy: boolean
  owner: string | null
  tasks: taskProps[]
  id: string
  isExpanded: boolean
}

export default projectProps
