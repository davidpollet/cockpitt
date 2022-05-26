import {
  BsCheck as IconCheck,
  BsCardChecklist as IconTurnover,
} from "react-icons/bs"
import {
  IoChevronDownSharp as IconChevronDown,
  IoChevronForwardOutline as IconChevronRight,
  IoClose as IconClose,
  IoAlertCircleSharp as IconErrorCircle,
  IoAlertOutline as IconExclamation,
  IoLogoGithub as IconGithub,
  IoLogoGoogle as IconGoogle,
  IoExitOutline as IconLogOut,
  IoSettingsOutline as IconSettings,
  IoTrashBinOutline as IconTrashOutline,
  IoLogoTwitter as IconTwitter,
  IoEyeOffOutline as IconVisibilityOff,
  IoEyeOutline as IconVisibilityOn,
} from "react-icons/io5"

import { FaFacebookF as IconFacebook } from "react-icons/fa"
import { GoPlus as IconPlus } from "react-icons/go"
import { CgRepeat as IconRepeat } from "react-icons/cg"
import { MdPendingActions as IncomesPending } from "react-icons/md"
import { SVGProps } from "react"

function IconPaperPlane(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1.5em"
      xmlns="http://www.w3.org/2000/svg"
      height="1.5em"
      className={props.className}
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M226.6 29.4a20.2 20.2 0 0 0-19.6-5.1L20.7 76.9a20 20 0 0 0-3.2 37.3l84.4 39.9l39.9 84.4a19.7 19.7 0 0 0 18 11.4h1.7a19.9 19.9 0 0 0 17.6-14.5L231.7 49a20.2 20.2 0 0 0-5.1-19.6Zm-67.7 189.1l-33.6-70.9l39.3-39.2a12 12 0 0 0-17-17l-39.2 39.3l-70.9-33.6l169.1-47.7Z"
      ></path>
    </svg>
  )
}

function IconCashed(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.5em"
      height="1.5em"
      viewBox="0 0 520 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M469 192h-32q-7 0-10-6q-9-14-20-22l-2-2V64h-21q-32 0-60 28l-2 2v-7q0-35-25.5-61T235 0q-35 0-60.5 25T149 87q0 13 2 20q-27 10-55 38l-43-15l-17-17q-14-14-30 0q-13 15 0 30l26 26l36 12q-25 38-25 86v32l19 175q2 16 14.5 27t28.5 11h29q13 0 25-8t16-22l15-43q33 10 72 7l13 36q12 28 41 28h30q16 0 28.5-11.5T388 471l9-85q29-29 40-60q3-8 13-8h4q24 0 42-18t18-42v-23q-2-18-14.5-30.5T469 192zM237 43q18 0 31.5 13T282 87q0 19-13 32t-32 13q-19-2-32-14.5T192 87t13-31t32-13zm232 217q0 7-5 12t-12 5h-4q-36 0-53 37q-9 22-34 49l-7 6l-11 100h-29l-24-68l-17 2q-11 2-28 2q-29 0-62-10l-21-9l-28 83h-29L85 297v-30q0-43 26-75q12-4 15-13v-4q13-13 45-30q26 30 64 30q47 0 72-38h2q14 7 41-11q2-1 6-4.5t7-4.5v64l6 7q6 6 11 10l5.5 5.5l4.5 5.5q18 28 47 28h32v23zm-128-68q0 9-6 15t-15 6t-15-6t-6-15t6-15t15-6t15 6t6 15z"
      ></path>
    </svg>
  )
}

export {
  IconCashed,
  IconCheck,
  IconChevronRight,
  IconChevronDown,
  IconErrorCircle,
  IconExclamation,
  IconPaperPlane,
  IconPlus,
  IconRepeat,
  IconTrashOutline,
  IconTurnover,
  IconVisibilityOff,
  IconVisibilityOn,
  IconClose,
  IncomesPending,
  IconFacebook,
  IconGoogle,
  IconTwitter,
  IconSettings,
  IconGithub,
  IconLogOut,
}
