import { Metadata } from "next"

// Base metadata for the site
export const siteConfig = {
  name: "IEEE PESCE Student Branch",
  description: "IEEE PESCE Student Branch is a community of students dedicated to promoting technological innovation and excellence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ieeepescesb.org",
  ogImage: "/images/ieee-og-image.jpg",
  links: {
    twitter: "https://twitter.com/ieeepescesb",
    github: "https://github.com/ieee-pesce",
    linkedin: "https://linkedin.com/company/ieee-pesce-student-branch",
    instagram: "https://instagram.com/ieee_pesce"
  },
}

// Base metadata for all pages
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["IEEE", "PESCE", "Student Branch", "Engineering", "Technology", "Innovation"],
  authors: [
    {
      name: "IEEE PESCE Student Branch",
      url: siteConfig.url,
    },
  ],
  creator: "IEEE PESCE Student Branch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@ieeepescesb",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

// Generate metadata for a blog post
export function generateBlogMetadata(
  title: string,
  description: string,
  author: string,
  date: string,
  slug: string,
  image?: string
): Metadata {
  const ogImage = image || siteConfig.ogImage
  const url = `${siteConfig.url}/blogs/${slug}`
  
  return {
    title,
    description,
    authors: [{ name: author }],
    keywords: ["IEEE", "PESCE", "Blog", "Technology", ...title.split(" ")],
    openGraph: {
      type: "article",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

// Generate metadata for an event page
export function generateEventMetadata(
  title: string,
  description: string,
  slug: string,
  date: string,
  image?: string
): Metadata {
  const ogImage = image || siteConfig.ogImage
  const url = `${siteConfig.url}/events/${slug}`
  
  return {
    title,
    description,
    keywords: ["IEEE", "PESCE", "Event", ...title.split(" ")],
    openGraph: {
      type: "event",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      startTime: date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

// Generate metadata for a chapter page
export function generateChapterMetadata(
  title: string,
  description: string,
  slug: string,
  image?: string
): Metadata {
  const ogImage = image || siteConfig.ogImage
  const url = `${siteConfig.url}/chapters/${slug}`
  
  return {
    title,
    description,
    keywords: ["IEEE", "PESCE", "Chapter", title, "Student Branch"],
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
} 