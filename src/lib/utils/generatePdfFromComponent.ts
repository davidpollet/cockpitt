import { ReactElement } from "react"

const generatePdfFromComponent = async (
  component: ReactElement,
  fileName: string,
) => {
  const saveAs = (await import("file-saver")).default
  const { pdf } = (await import("@react-pdf/renderer")).default
  const blob = await pdf(component).toBlob()
  saveAs(blob, fileName)
}

export { generatePdfFromComponent }
