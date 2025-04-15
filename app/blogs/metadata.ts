import type { Metadata } from "next"
import { baseMetadata } from "../lib/metadata"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Blogs | IEEE PESCE Student Branch",
  description: "Discover insightful articles and technical blogs written by IEEE PESCE Student Branch members on engineering, technology, and innovation.",
  keywords: ["IEEE blogs", "PESCE blogs", "engineering articles", "technology insights", "student tech blogs", "IEEE publications"],
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: "IEEE PESCE Student Branch Blogs",
    description: "Discover insightful articles and technical blogs written by IEEE PESCE Student Branch members on engineering, technology, and innovation.",
    url: '/blogs',
    siteName: "IEEE PESCE Student Branch",
    images: [
      {
        url: "/images/chapters-hero.jpg",
        width: 800,
        height: 600,
        alt: "IEEE PESCE Blogs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
} 