import "@root/global.scss";
import "./globals.css";

import type { Metadata } from "next";

import Providers from "@components/Providers";
import Footer from "@root/components/footer";
import { Header } from "@root/components/header";

export const metadata: Metadata = {
  title: "From??? Basketball Quizzes",
  description: "NBA Basketball Quizzes on where players went to college.",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="theme-light min-h-screen flex flex-col">
        <Providers>
          <main className="flex-grow">
            <Header />
            {children}
          </main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
