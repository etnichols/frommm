import './globals.css'
import './globals.scss'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'

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
    <html lang="en" className="h-full">
      <body className={cn(spaceMono.className, 'h-full')}>
        <div className="flex flex-col px-2 pt-4 max-w-3xl flex-grow pb-4">
          <Header />
          <main className="flex-1 pb-8 w-full h-full">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
