'use client'

import { useRef, useState } from 'react'

import Image from 'next/image'
import classNames from 'classnames'
import useOnClickOutside from '@/lib/hooks/use-on-click-outside'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const ref = useRef(null)

  const router = useRouter()
  const [showNav, setShowNav] = useState(false)

  const navItems = [
    ['browse', '/quizzes'],
    ['create', '/create'],
    ['leaderboard', '/leaderboard'],
    ['about', '/about'],
  ]

  useOnClickOutside(ref, () => setShowNav(false))

  return (
    <nav ref={ref} className="h-32 fixed left-0 top-0 w-screen z-40">
      <div className="flex bg-slate-100 flex-wrap items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <a href="/" className="flex place-items-center gap-2 lg:pointer-events-auto lg:p-0">
            <Image
              src="/from_logo.svg"
              alt="From??? Basketball Quiz Logo"
              className="dark:invert"
              width={80}
              height={20}
            />
          </a>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">From???</div>
            <div className="text-sm">Basketball Quizzes</div>
          </div>
        </div>
        <button
          onClick={() => setShowNav(!showNav)}
          type="button"
          className="inline-flex h-10 w-10 bg-white items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={classNames('z-40 flex w-full md:block md:w-auto', {
            hidden: !showNav,
          })}
        >
          <ul className="z-40 mt-4 flex flex-col rounded-lg border w-full border-gray-100 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse dark:border-gray-700">
            {navItems.map(([display, route], i) => (
              <li key={`nav-item-${i}`}>
                <a
                  href={route}
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                >
                  {display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
