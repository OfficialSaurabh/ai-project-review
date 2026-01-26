
"use client";
import { useSession, signIn, signOut } from "next-auth/react"

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { LuLogIn } from "react-icons/lu";
import { GitBranch } from "lucide-react";
import { useEffect } from "react";

// const navigation: { name: string; href: string; current: boolean }[] = [];

const navigation = [
  { name: 'Features', href: '#features', current: true },
  { name: 'How it works', href: '#how-it-works', current: true },
  // { name: 'Demo', href: '#demo-scroll-reveal', current: true },
  { name: 'Transparency', href: '#transparency', current: true },
]

function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session && window.location.hash) {
      history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [session]);




  return (
    <Disclosure
      as="nav"
      className="relative mb-15 bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          {/* fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl */}
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              {/* <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton> */}
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              {/* <div className="flex shrink-0 items-center">
              <h1>AI Project Analyzer</h1>
            </div> */}
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <GitBranch className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  AI Project Analyzer
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                {!session && (
                  <nav className="hidden items-center gap-4 md:flex">

                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.name}
                      </a>

                    ))}
                  </nav>
                )}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* <button
              type="button"
              className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <FaRegBell aria-hidden="true" className="size-6" />
            </button> */}

              {/* Profile dropdown */}
              {/* <LuLogIn aria-hidden="true" className="size-6" onClick={() => signIn()}  /> */}

              {!session ? (<LuLogIn aria-hidden="true" className="size-6 cursor-pointer" onClick={() => signIn()} />) : (
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative  flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={session.user?.image || ""}
                      className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                    />
                  </MenuButton>


                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                      >
                        {session.user?.name}
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                      >
                        {session.user?.email}
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>)}
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
