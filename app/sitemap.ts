import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { siteConfig } from './lib/metadata'

// Get all blogs from blogs.json
const getBlogSlugs = (): string[] => {
  try {
    const filePath = path.join(process.cwd(), 'app/data/blogs.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    return data.map((blog: any) => blog.id.toString())
  } catch (error) {
    console.error('Error reading blogs.json:', error)
    return []
  }
}

// Get all events from events.json
const getEventSlugs = (): string[] => {
  try {
    const filePath = path.join(process.cwd(), 'app/data/events.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    return data.map((event: any) => event.id.toString())
  } catch (error) {
    console.error('Error reading events.json:', error)
    return []
  }
}

// Get all chapters
const getChapterSlugs = (): string[] => {
  try {
    const filePath = path.join(process.cwd(), 'app/data/chapters.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    return data.map((chapter: any) => chapter.id.toString())
  } catch (error) {
    console.error('Error reading chapters.json:', error)
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getBlogSlugs()
  const eventSlugs = getEventSlugs()
  const chapterSlugs = getChapterSlugs()
  
  // Static routes with their update frequency
  const routes = [
    {
      url: `${siteConfig.url}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/chapters`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
  ]

  // Add dynamic blog routes
  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${siteConfig.url}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Add dynamic event routes
  const eventRoutes = eventSlugs.map((slug) => ({
    url: `${siteConfig.url}/events/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Add dynamic chapter routes
  const chapterRoutes = chapterSlugs.map((slug) => ({
    url: `${siteConfig.url}/chapters/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...blogRoutes, ...eventRoutes, ...chapterRoutes]
} 