import './globals.css'

import NavBar from '@/components/nav-bar'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'From??? Basketball Quizzes',
  description: 'NBA Basketball Quizzes on where players went to college.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="pt-32 flex min-h-screen flex-col items-center justify-between">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  )
}
