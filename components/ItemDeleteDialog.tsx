import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react"

import Loading from "./Loading"
import wait from "@helpers/wait"

declare interface ItemDeleteDialogProps {
  question: ReactNode
  itemToDelete: {}
  dialogIsVisible: boolean
  setDialogIsVisible: Dispatch<SetStateAction<boolean>>
  // eslint-disable-next-line no-unused-vars
  deleteFn: (itemToDelete: any) => Promise<void>
  isDeleting: boolean
}

function ItemDeleteDialog({
  question,
  itemToDelete,
  dialogIsVisible,
  setDialogIsVisible,
  deleteFn,
  isDeleting,
}: ItemDeleteDialogProps) {
  const deleteBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function toggleDeleteBox() {
      if (dialogIsVisible) {
        deleteBoxRef?.current?.classList.remove("hidden")
      }
      if (!dialogIsVisible) {
        deleteBoxRef?.current?.classList.add("hidding")
        await wait(1000)
        deleteBoxRef?.current?.classList.add("hidden")
        deleteBoxRef?.current?.classList.remove("hidding")
      }
    }
    toggleDeleteBox()
    return () => {}
  }, [dialogIsVisible])

  const deleteBoxClassName = `bill-delete-dialog absolute inset-2 z-10
  flex flex-wrap items-center justify-center gap-2 rounded-md
  bg-violet-500 p-1 drop-shadow-md transition-all duration-300
  dark:bg-violet-850 hidden`

  return (
    <div className={deleteBoxClassName} ref={deleteBoxRef}>
      <h4 className="text-md font-semibold text-white">{question}</h4>
      <div>
        <button
          className="button is-ghost mr-1 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:from-violet-400 dark:to-violet-400"
          onClick={() => setDialogIsVisible(false)}
        >
          Annuler
        </button>
        <button
          className="button is-filled relative bg-white bg-w-0/h-0 bg-center text-violet-500 dark:bg-violet-600 dark:text-violet-100"
          onClick={() => deleteFn(itemToDelete)}
        >
          <Loading
            size={20}
            className={`absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 transition-all
            ${isDeleting ? "scale-1" : "scale-0"}`}
          />
          <span className={`${isDeleting && "opacity-0 transition-all "}`}>
            Supprimer
          </span>
        </button>
      </div>
    </div>
  )
}

export default ItemDeleteDialog
