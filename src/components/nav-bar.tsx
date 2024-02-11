'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function NavBar() {
  const [showNav, setShowNav] = useState(false)
  const navItems = ['about', 'browse', 'create', 'leaderboard']

  return (
    <nav className="fixed left-0 top-0 bg-white bg-slate-100 dark:bg-gray-900 font-mono w-screen">
      <div className="flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex place-items-center gap-2 lg:pointer-events-auto lg:p-0">
          <Image
            src="/from_logo.svg"
            alt="From??? Basketball Quiz Logo"
            className="dark:invert"
            width={80}
            height={20}
          />
          <div className="m-4 p-4 text-2xl font-bold">From???</div>
        </div>
        <button
          onClick={() => setShowNav(!showNav)}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
        <div className={`${!showNav && 'hidden'} flex w-full md:block md:w-auto`}>
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
            {navItems.map((item, i) => (
              <li key={`nav-item-${i}`}>
                <a
                  href="/browse"
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
