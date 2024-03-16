import './globals.css'

import type { Metadata } from 'next'
import NavBar from '@/components/quiz/nav-bar'
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
        <main className="flex mt-40 mb-8 w-full min-h-screen px-2">
          <NavBar />
          <div className="flex flex-col items-center w-full overflow-scroll">{children}</div>
        </main>
      </body>
    </html>
  )
}
