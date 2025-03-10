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

  return (
    <div className="flex flex-col mb-4">
      <div className="flex flex-col gap-y-4">
        <Basketballs />
        <div>
          From??? Basketball Quizzes <Badge>{'0.0.2'}</Badge>
        </div>
        <NavigationMenu className="bg-orange-500 p-2 text-white">
          <NavigationMenuList className="cursor-pointer flex flex-row gap-x-4 text-white">
            <NavigationMenuItem className="text-white">
              <NavigationMenuLink
                className={cn(
                  'cursor-pointer p-1 text-white',
                  isActive('/about') && 'underline underline-offset-4',
                )}
                onClick={() => router.push('/about')}
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  'cursor-pointer p-1 text-white',
                  isActive('/quizzes') && 'underline underline-offset-4',
                )}
                onClick={() => router.push('/quizzes')}
              >
                Browse
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  'cursor-pointer p-1 text-white',
                  isActive('/leaderboard') && 'underline underline-offset-4',
                )}
                onClick={() => router.push('/leaderboard')}
              >
                Leaderboard
              </NavigationMenuLink>
            </NavigationMenuItem>
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
