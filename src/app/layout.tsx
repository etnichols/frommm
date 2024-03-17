import './globals.css'

import type { Metadata } from 'next'
import NavBar from '@/components/nav-bar'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
      <body className={poppins.className}>
        <div className="flex flex-col h-screen">
          <NavBar />
          <main className="mt-32 pt-8 flex-1 overflow-y-auto mx-2 pb-8 w-full">{children}</main>
        </div>
      </body>
    </html>
  )
}
