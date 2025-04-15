import type { Metadata } from "next"
import { baseMetadata } from "../lib/metadata"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Blog | IEEE PESCE Student Branch",
  description: "Explore articles, technical content, and event highlights from IEEE PESCE Student Branch. Stay updated with the latest from our student community.",
  keywords: ["IEEE PESCE blog", "technical articles", "engineering blog", "student branch", "technology articles", "tech events", "PESCE Mandya", "engineering students"],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: "IEEE PESCE Student Branch Blog",
    description: "Explore articles, technical content, and event highlights from IEEE PESCE Student Branch. Stay updated with the latest from our student community.",
    url: '/blog',
    siteName: "IEEE PESCE Student Branch",
    images: [
      {
        url: "/blog/ieee-pesce-hosts-successful-hackathon-1744566886290.jpg",
        width: 800,
        height: 600,
        alt: "IEEE PESCE Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
} 