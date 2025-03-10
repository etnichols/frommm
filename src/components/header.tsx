'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { usePathname, useRouter } from 'next/navigation'

import Badge from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navigationItems = [
    { label: 'About', path: '/about' },
    { label: 'Browse', path: '/quizzes' },
    { label: 'Leaderboard', path: '/leaderboard' },
  ]

  return (
    <div className="flex flex-col mb-4">
      <div className="flex flex-col gap-y-4">
        <Basketballs />
        <div className="text-xl font-bold">From??? Basketball Quizzes</div>
        <NavigationMenu>
          <NavigationMenuList className="cursor-pointer flex flex-row gap-x-2">
            {navigationItems.map((item) => (
              <NavigationMenuItem
                key={item.path}
                className="text-white flex justify-center items-center bg-orange-500 p-2"
              >
                <NavigationMenuLink
                  className={cn('flex text-white', {
                    'underline underline-offset-4 text-white': isActive(item.path),
                  })}
                  onClick={() => router.push(item.path)}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

function Basketballs() {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push('/')}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          router.push('/')
        }
      }}
      className="flex flex-row gap-x-4 items-center cursor-pointer"
    >
      {new Array(4).fill(0).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: decoration
        <div key={`basketball-${index}`} className="flex flex-row gap-x-4">
          <div className="bg-orange-500 size-6 rounded-full" />
          <div className="rotate-45 bg-black size-5 text-white">
            <div className="-rotate-45 flex items-center justify-center h-full">{'?'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
