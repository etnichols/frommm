import "@root/global.scss";
import "./globals.css";

import {Footer} from "@root/components/footer";
import { Header } from "@root/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "From??? Basketball Quizzes",
  description: "NBA Basketball Quizzes on where players went to college.",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="theme-light min-h-screen flex flex-col px-4 pt-4">
            <Header />
            <main className="flex-grow min-h-screen">{children}</main>
            <Footer />
      </body>
    </html>
  );
}
