import Spinner from "src/ui/Spinner"
import { motion } from "framer-motion"
import { useBillFormContext } from "./billFormContext"

export function BillDownload() {
  const { isUpdating, isDownloading } = useBillFormContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.5,
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
        y: "0%",
      }}
      exit={{
        transition: {
          duration: 0.2,
          easings: [0.77, 0, 0.175, 1],
        },
        y: "100%",
      }}
      className="fixed right-0 left-0 bottom-0 z-20 flex flex-col items-center justify-center p-2 font-sans"
    >
      {isUpdating && <p className="bg-white text-sm text-violet-500">Sauvegarde …</p>}
      <button
        className="button is-filled relative px-8 font-bold"
        type="submit"
        disabled={isDownloading || isUpdating}
      >
        <span
          className={`${
            isDownloading
              ? "scale-60 translate-y-full opacity-0"
              : "translate-y-0 scale-100 opacity-100"
          } transition`}
        >
          Télécharger
        </span>
        <Spinner
          color="white"
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 ${
            isDownloading
              ? "-translate-y-1/2 scale-100 opacity-100"
              : "scale-60 translate-y-full opacity-0"
          }`}
          size={24}
        />
      </button>
    </motion.div>
  )
}
