import { AnimatePresence, motion } from "framer-motion"
import {
  IconChevronDown,
  IconClose,
  IconLogOut,
  IconSettings,
} from "./Icons.index"

import { Menu } from "@headlessui/react"
import UserAvatar from "./UserAvatar"
import useSignOut from "@hooks/useSignOut"

function UserMenu() {
  const signOut = useSignOut()
  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button
            className={`group relative rounded-full ring-0 transition-all hocus:ring-4 hocus:ring-white/50 ${
              open && "ring-4 ring-white/50"
            }`}
          >
            <UserAvatar />
            <span
              className={`absolute bottom-0 left-2/4 flex h-5 w-5 translate-x-2/4 translate-y-1/4 overflow-hidden rounded-full text-xs  transition-all group-hover:bg-white group-hover:text-violet-500 group-focus:bg-white group-focus:text-violet-500 dark:bg-violet-850 dark:text-violet-100 ${
                open ? "bg-white text-violet-500" : "bg-violet-500 text-white"
              }`}
            >
              <IconChevronDown
                className={`m-auto shrink-0 transition ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <IconClose
                className={`absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 transition ${
                  open ? " rotate-180 opacity-100" : "opacity-0"
                }`}
              />
            </span>
          </Menu.Button>
          <AnimatePresence>
            {open && (
              <Menu.Items
                as={motion.div}
                static
                key="items"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 10,
                  transition: {
                    duration: 0.2,
                    easings: [0.77, 0, 0.175, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  transition: {
                    duration: 0.2,
                    easings: [0.77, 0, 0.175, 1],
                  },
                }}
                style={{ originX: "right", originY: "top" }}
                className="absolute top-full right-0 grid translate-y-2 gap-1 rounded-sm bg-gray-100 p-1 text-gray-600 drop-shadow-lg filter before:absolute before:right-5 before:bottom-full before:border-x-[.55em] before:border-b-[.5em] before:border-x-white/0 before:border-b-gray-100 before:content-[''] dark:bg-violet-900 dark:before:border-b-violet-900"
              >
                {/* <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`button grid grid-cols-[1.5em_1fr] gap-2 bg-white bg-gradient-to-r from-violet-500 to-violet-500 bg-w-0/h-full bg-left p-2 transition-all  hover:bg-w-full/h-full  hover:text-white dark:bg-violet-900 dark:text-violet-100 ${
                        active
                          ? "bg-w-full/h-full text-white"
                          : "bg-w-0/h-full text-violet-500"
                      }`}
                      href="/account-settings"
                    >
                      <IconSettings className=" h-6 w-6 fill-violet-500 leading-none opacity-80" />
                      <span className="self-center leading-none">
                        Mon compte
                      </span>
                    </a>
                  )}
                </Menu.Item> */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`button grid grid-cols-[1.5em_1fr] gap-2 bg-white bg-gradient-to-r from-violet-500 to-violet-500 bg-w-0/h-full bg-left p-2 transition-all  hover:bg-w-full/h-full  hover:text-white dark:bg-violet-900 dark:text-violet-100 ${
                        active
                          ? "bg-w-full/h-full text-white"
                          : "bg-w-0/h-full text-violet-500"
                      }`}
                      onClick={signOut}
                    >
                      <IconLogOut className=" h-6 w-6 fill-violet-500 leading-none opacity-80" />
                      <span className="self-center leading-none">
                        Déconnexion
                      </span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            )}
          </AnimatePresence>
        </>
      )}
    </Menu>
  )
}

export default UserMenu
