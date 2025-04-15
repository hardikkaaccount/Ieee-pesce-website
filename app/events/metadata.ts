import type { Metadata } from "next"
import { baseMetadata } from "../lib/metadata"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Events | IEEE PESCE Student Branch",
  description: "Discover upcoming and past events organized by IEEE PESCE Student Branch. Join our technical workshops, conferences, and social gatherings.",
  keywords: ["IEEE events", "student branch events", "technical workshops", "engineering conferences", "PESCE activities", "IEEE PESCE", "technology meetups"],
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: "IEEE PESCE Student Branch Events",
    description: "Discover upcoming and past events organized by IEEE PESCE Student Branch. Join our technical workshops, conferences, and social gatherings.",
    url: '/events',
    siteName: "IEEE PESCE Student Branch",
    images: [
      {
        url: "/events/1.png",
        width: 800,
        height: 600,
        alt: "IEEE PESCE Events",
      },
    ],
    locale: "en_US",
    type: "website",
  },
} 