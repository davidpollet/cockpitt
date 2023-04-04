export async function uploadImageAndGetUrl(image: File) {
  const formData = new FormData()
  formData.append("file", image)
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
  )

  const bodyReq = {
    method: "POST",
    body: formData,
  }

  const res = await fetch(
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL as string,
    bodyReq,
  )
  if (!res.ok) {
    throw new Error("Erreur pendant l'envoi de l'image")
  }

  const imageRes: CloudinaryResponse = await res.json()
  return imageRes.secure_url
}

type CloudinaryResponse = {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: []
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  access_mode: string
  original_filename: string
}
