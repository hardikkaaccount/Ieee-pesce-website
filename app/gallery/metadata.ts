import type { Metadata } from "next"
import { baseMetadata } from "../lib/metadata"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Gallery | IEEE PESCE Student Branch",
  description: "Browse through images and memories from IEEE PESCE Student Branch activities, events, and workshops. See the community in action.",
  keywords: ["IEEE gallery", "PESCE photos", "student branch gallery", "event photos", "IEEE activities", "engineering events"],
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: "IEEE PESCE Student Branch Gallery",
    description: "Browse through images and memories from IEEE PESCE Student Branch activities, events, and workshops. See the community in action.",
    url: '/gallery',
    siteName: "IEEE PESCE Student Branch",
    images: [
      {
        url: "/images/gallery-cover.jpg", 
        width: 800,
        height: 600,
        alt: "IEEE PESCE Gallery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
} 