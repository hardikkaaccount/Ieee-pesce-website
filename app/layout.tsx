import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import StructuredDataValidator from "@/components/seo/structured-data-validator"
import { baseMetadata } from "./lib/metadata"
import { Metadata, Viewport } from "next"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#0066A1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
}

export const metadata: Metadata = {
  ...baseMetadata,
  title: "IEEE PESCE",
  description: "IEEE PESCE Student Branch Website",
  keywords: ["IEEE", "PESCE", "IEEE PESCE", "Student Branch", "PES College of Engineering", "Mandya", "engineering", "technology", "events", "workshops", "technical society"],
  authors: [{ name: "IEEE PESCE" }],
  creator: "IEEE PESCE Student Branch",
  publisher: "IEEE PESCE Student Branch",
  generator: 'Next.js',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeepescesb.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "IEEE PESCE - Advancing Technology for Humanity",
    description: "IEEE PESCE Student Branch - Empowering students to innovate, collaborate, and lead in the world of technology.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeepescesb.org',
    siteName: "IEEE PESCE Student Branch",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/ieee-logo.png",
        width: 800,
        height: 600,
        alt: "IEEE PESCE Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE PESCE - Advancing Technology for Humanity",
    description: "IEEE PESCE Student Branch - Empowering students to innovate, collaborate, and lead in the world of technology.",
    images: ["/ieee-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/ieee-logo.png" }
    ],
    apple: [
      { url: "/ieee-logo.png" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IEEE PESCE"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/ieee-logo.png" />
        <link rel="apple-touch-icon" href="/ieee-logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster />
          <StructuredDataValidator />
        </ThemeProvider>
      </body>
    </html>
  )
}