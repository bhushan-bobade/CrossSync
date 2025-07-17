import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CrossSync - Beautiful Cross-Platform Content Sharing",
  description: "Beautiful cross-platform content sharing with rich text editing and QR code technology",
  keywords: ["cross-platform", "content sharing", "QR code", "rich text editor", "sync"],
  authors: [{ name: "CrossSync Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.png", // This will be your new favicon
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
