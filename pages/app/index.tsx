import AppWrapper from "src/ui/AppWrapper"
import Head from "next/head"
import { TasksTracker } from "src/features/task-tracker/TasksTracker"

const MesTaches = () => {
  return (
    <>
      <Head>
        <title>Mes tâches - Cockpitt</title>
        <meta
          name="description"
          content="Suivez vos tâches par projet et sur une seule page"
        />
      </Head>

      <AppWrapper>
        <TasksTracker />
      </AppWrapper>
    </>
  )
}

export default MesTaches
