import { IconErrorCircle } from "./Icons.index"

function ErrorMessage({ children }: { children: string }) {
  return (
    <span className="flex items-center bg-red-50 p-1 text-red-600">
      <IconErrorCircle className="h-6 w-6" /> {children}
    </span>
  )
}

function FormSet() {
  return (
    <section className="grid gap-1">
      <label htmlFor="email" className="justify-self-start">
        Email
      </label>
      <input type="email" name="email" id="email" />
      <ErrorMessage>Coucou internet</ErrorMessage>
    </section>
  )
}

export default FormSet
