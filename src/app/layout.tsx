import './globals.css'
import './globals.scss'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import type { Metadata } from 'next'
import NavBar from '@/components/nav-bar'
import { Space_Mono } from 'next/font/google'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
  weight: ['400', '700'],
})

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
      <body className={spaceMono.className}>
        <div className="flex flex-col h-screen p-4 max-w-3xl">
          <Header />
          <main className="pt-8 flex-1 overflow-y-auto px-2 pb-8 w-full">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
