import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono as GeistMono, Inter } from "next/font/google"
import "./globals.css"

const geistMono = GeistMono({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tactical Operations Dashboard",
  description: "Tactical command and control system",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geistMono.className} ${inter.className} bg-black text-white antialiased`}>{children}</body>
    </html>
  )
}
