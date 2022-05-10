import { EMAIL_REGEX, PASSWORD_REGEX } from "@consts/regex-collection"
import {
  IconCheck,
  IconChevronRight,
  IconErrorCircle,
  IconVisibilityOff,
  IconVisibilityOn,
} from "./Icons.index"
import React, { FormEvent, useEffect, useRef, useState } from "react"
import { testEmailInput, testPasswordInput } from "@helpers/testInputValue"

import Loading from "./Loading"
import { closeAuthModal } from "@store/features/userSlice"
import { passwordRequiments } from "@localTypes/passwordRequirements"
import { signIn } from "next-auth/react"
import { useDispatch } from "react-redux"

const inputStyles =
  "ring-transparent grow  rounded-sm bg-gray-200 px-2 py-1 text-gray-600 outline-none ring-0 transition-all duration-100 ease-in hover:bg-gray-100 focus:bg-white focus:ring focus:ring-violet-200 dark:bg-violet-900/40 block w-full focus:ring"

function AuthForm() {
  const dispatch = useDispatch()
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const [passwordIsVisible, setPasswordIsVisible] = useState(false)
  const [formIsFilledCorrectly, setFormIsFilledCorrectly] = useState(false)
  const [userSignedUp, setUserSignedUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authResErrorMessage, setAuthResErrorMessage] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [emailInputState, setEmailInputState] = useState({
    isValid: false,
    errorMessage: "",
  })
  const [usernameInputState, setUsernameInputState] = useState({
    isValid: false,
    errorMessage: "",
  })
  const [passwordInputState, setPasswordInputState] = useState<{
    errorMessage: string
    requirements: passwordRequiments
  }>({
    errorMessage: "",
    requirements: {
      isLengthEnough: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
    },
  })

  async function handleAuthSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const passwordInput = e.currentTarget.password.value
    const emailInput = e.currentTarget.email.value

    if (isSignUp) {
      const usernameInput = e.currentTarget.username.value

      return fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
          username: usernameInput,
          provider: "email+password",
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            return setAuthResErrorMessage(
              "Cette adresse email est déjà utilisée"
            )
          }

          setUserSignedUp(true)
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false))
    }

    return await signIn<"credentials">("credentials", {
      redirect: false,
      email: emailInput,
      password: passwordInput,
    })
      .then((res) => {
        if (res?.error) {
          setAuthResErrorMessage(res.error)
        } else {
          setAuthResErrorMessage("")
          dispatch(closeAuthModal())
        }
      })
      .finally(() => setIsLoading(false))
  }

  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const password = e.currentTarget.value
    const requirementsTestResults = testPasswordInput(password)
    setPasswordInputState((old) => {
      return { ...old, requirements: requirementsTestResults }
    })
  }

  useEffect(() => {
    if (isSignUp) {
      const passRequirementsAreValids = Object.values(
        passwordInputState.requirements
      ).every((el) => el)

      const formValuesAreValids =
        passRequirementsAreValids && emailInputState.isValid
      setFormIsFilledCorrectly(formValuesAreValids)
    } else {
      const formValuesAreValids =
        emailInputState.isValid && !!passwordInputRef.current?.value
      setFormIsFilledCorrectly(formValuesAreValids)
    }
  }, [passwordInputState, emailInputState, isSignUp])

  function handleGoogleSignIn() {
    signIn("google")
  }

  return (
    <div>
      <ThanksBox isOpen={userSignedUp} />

      <form className="grid gap-4" onSubmit={handleAuthSubmit}>
        <section>
          <button
            className="button is-filled"
            type="button"
            onClick={handleGoogleSignIn}
          >
            G
          </button>
        </section>
        <FormTitle title={isSignUp ? "Créer un compte" : "Se connecter"} />
        {authResErrorMessage && (
          <p className=" flex items-center gap-1 rounded-sm bg-red-50 p-2 text-red-500">
            <IconErrorCircle className="text-2xl" /> {authResErrorMessage}
          </p>
        )}

        {isSignUp && (
          <section>
            <label
              htmlFor="username"
              className="justify-self-start text-gray-600"
            >
              Nom
            </label>
            <input
              type={"username"}
              name="username"
              id="username"
              ref={usernameInputRef}
              className={inputStyles}
            />
          </section>
        )}

        <section>
          <label htmlFor="email" className="justify-self-start text-gray-600">
            Email
          </label>
          <input
            type={"email"}
            name="email"
            id="email"
            ref={emailInputRef}
            onChange={(e) => {
              emailInputState.errorMessage &&
                setEmailInputState(testEmailInput(e.currentTarget.value))
            }}
            onBlur={(e) =>
              setEmailInputState(testEmailInput(e.currentTarget.value))
            }
            className={inputStyles}
          />
          {emailInputState.errorMessage && (
            <p className="mt-1 flex items-center gap-1 text-red-500">
              <IconErrorCircle className="text-2xl" />{" "}
              {emailInputState.errorMessage}
            </p>
          )}
        </section>

        <section className="">
          <label
            htmlFor="password"
            className="justify-self-start text-gray-600"
          >
            Mot de passe
          </label>
          <div className="flex">
            <input
              type={passwordIsVisible ? "text" : "password"}
              name="password"
              id="password"
              className={inputStyles}
              ref={passwordInputRef}
              onChange={onPasswordChange}
            />
            <button
              className="button is-ghost ml-1 from-violet-400 to-violet-400 px-2"
              type="button"
              onClick={() => setPasswordIsVisible((prev) => !prev)}
            >
              {passwordIsVisible ? <IconVisibilityOn /> : <IconVisibilityOff />}
            </button>
          </div>
          {!passwordInputState.errorMessage && (
            <span>{passwordInputState.errorMessage}</span>
          )}

          {isSignUp && (
            <PasswordRequimentsList
              requirements={passwordInputState.requirements}
            />
          )}
        </section>

        <section className="grid grid-cols-2 gap-1">
          <button
            className="button is-filled justify-center bg-violet-400"
            disabled={!formIsFilledCorrectly || isLoading}
          >
            {isSignUp ? "Créer un compte" : "Se connecter"}
            <Loading
              isVisible={isLoading}
              spinnerBg={"border-violet-400 dark:border-violet-100"}
              spinnerColor={"border-t-white dark:border-t:violet-900"}
            />
          </button>
          <button
            className="button is-ghost justify-center"
            type="button"
            onClick={() => setIsSignUp((prev) => !prev)}
          >
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </button>
          {!isSignUp && (
            <button
              className="col-span-2 justify-self-start py-1 text-gray-500 transition-colors hocus:text-violet-500"
              type="button"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              {"J'ai oublié mon mot de passe"}
            </button>
          )}
        </section>
      </form>
    </div>
  )
}

function FormTitle({ title }: { title: string }) {
  const reflexionStyle =
    "before:absolute before:left-0 before:top-0 before:origin-left before:scale-150 before:whitespace-nowrap before:text-2xl before:uppercase before:opacity-10"

  const titleStyle = "text-2xl"
  const beforeContent = title.replaceAll(/\s/g, "_")

  return (
    <legend className="relative overflow-hidden font-bold leading-none text-violet-500">
      <span
        className={`${titleStyle} ${reflexionStyle} before:content-['${beforeContent}']`}
      >
        <span className="relative">{title}</span>
      </span>
    </legend>
  )
}

function PasswordRequimentsList({
  requirements,
}: {
  requirements: passwordRequiments
}) {
  const { isLengthEnough, hasLowercase, hasUppercase, hasNumber } = requirements
  return (
    <ul className="relative mt-2 bg-white p-1 drop-shadow-md">
      <hr
        className="absolute bottom-full left-1 h-3 w-4 bg-white"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
      <PasswordRequiment isValid={hasLowercase}>
        Au moins 1 minuscule
      </PasswordRequiment>
      <PasswordRequiment isValid={hasUppercase}>
        Au moins 1 majuscule
      </PasswordRequiment>
      <PasswordRequiment isValid={hasNumber}>
        Au moins 1 chiffre
      </PasswordRequiment>
      <PasswordRequiment isValid={isLengthEnough}>
        Au moins 8 caractères
      </PasswordRequiment>
    </ul>
  )
}

function PasswordRequiment({
  isValid,
  children,
}: {
  isValid: boolean
  children: string
}) {
  return (
    <li
      className={`relative flex items-center overflow-hidden transition-[padding] ${
        isValid ? "pl-7" : "pl-3"
      }`}
    >
      <div
        className={`${
          isValid ? "rotate-180 opacity-0" : "opacity-1 rotate-0"
        } absolute left-0 text-xs font-bold text-violet-500 transition`}
        aria-hidden
      >
        <IconChevronRight />
      </div>
      <div
        aria-hidden
        className={`absolute bottom-0 left-0 rounded-sm bg-violet-500 text-xl text-violet-50 shadow transition ${
          isValid
            ? "scale-1 opacity-1 translate-x-0"
            : "-translate-x-8 scale-0 opacity-50"
        }`}
      >
        <IconCheck />
      </div>
      <span className={`${isValid ? "text-violet-500" : "text-gray-500"}`}>
        {children}
      </span>
    </li>
  )
}

function ThanksBox({ isOpen = false }: { isOpen?: boolean }) {
  const style = {
    clipPath: isOpen ? "inset(-2em)" : "inset(50%)",
    opacity: isOpen ? "1" : "0.5",
  }
  const dispatch = useDispatch()
  return (
    <div
      className="absolute top-2 bottom-2 left-2 right-2 z-10 grid rounded-lg border-[1px] border-gray-100 bg-white shadow-xl transition-all"
      style={style}
    >
      <div className="m-auto text-center">
        <h2 className={`text-center text-2xl`}>
          <span className="text-4xl">🥳</span>
          <span className="block font-bold uppercase text-violet-500">
            Bienvenue !
          </span>
        </h2>
        <button
          className="button is-filled mt-2"
          onClick={() => dispatch(closeAuthModal())}
        >
          Commencer
        </button>
      </div>
    </div>
  )
}

export default AuthForm
