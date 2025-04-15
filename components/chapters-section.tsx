"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { User, Atom, Cpu, Zap, BotIcon as Robot, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

// Fallback chapters in case settings don't load
const fallbackChapters = [
  {
    id: "wie",
    name: "WIE",
    icon: <User className="h-10 w-10 text-pink-400" />,
    description: "Advancing women in engineering and technology fields.",
    projects: ["Web Development", "AI Research", "Cybersecurity"],
  },
  {
    id: "comsoc",
    name: "Communication Society",
    icon: <Cpu className="h-10 w-10 text-yellow-400" />,
    description: "Promoting advances in communications and networking technologies.",
    projects: ["5G Research", "Network Security", "Wireless Communications"],
  },
]

export default function ChaptersSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [chapters, setChapters] = useState(fallbackChapters)
  const [isLoading, setIsLoading] = useState(true)

  // Function to get fresh settings
  const getLatestSettings = () => {
    if (typeof window === 'undefined') return null;
    
    // Clear any cached settings
    try {
      const savedSettings = localStorage.getItem('websiteSettings');
      console.log('Raw settings from localStorage (chapters):', savedSettings);
      
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error parsing settings:', error);
    }
    return null;
  }

  // Get an icon based on chapter ID
  const getChapterIcon = (chapterId: string) => {
    switch(chapterId.toLowerCase()) {
      case 'wie':
        return <User className="h-10 w-10 text-pink-400" />
      case 'comsoc':
        return <Globe className="h-10 w-10 text-yellow-400" />
      case 'cs':
        return <Cpu className="h-10 w-10 text-blue-400" />
      case 'ras':
        return <Robot className="h-10 w-10 text-green-400" />
      case 'pes':
        return <Zap className="h-10 w-10 text-red-400" />
      default:
        return <Atom className="h-10 w-10 text-purple-400" />
    }
  }

  // Load chapters from settings
  useEffect(() => {
    try {
      const settings = getLatestSettings();
      console.log('Chapter settings loaded:', settings);
      
      if (settings && settings.chapters) {
        // Format the chapters data for display
        const formattedChapters = Object.entries(settings.chapters).map(([id, data]: [string, any]) => {
          console.log(`Processing chapter ${id} for home display:`, data);
          
          // Extract project titles if available
          const projectTitles = (data.projects && Array.isArray(data.projects)) 
            ? data.projects.map((p: any) => p.title)
            : ["Projects coming soon"]
          
          return {
            id,
            name: data.name,
            icon: getChapterIcon(id),
            description: data.description || "Information coming soon",
            projects: projectTitles.slice(0, 3) // Limit to 3 projects
          }
        })
        
        console.log('Formatted chapters for display:', formattedChapters);
        
        // Limit to 2 chapters for the home page
        setChapters(formattedChapters.slice(0, 2))
      }
    } catch (error) {
      console.error("Error loading chapters:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-blue-950 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            IEEE <span className="text-blue-400">Chapters & SIGs</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our specialized technical chapters and special interest groups focused on various domains of
            engineering and technology.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-6 hover:border-blue-600/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-900/30 p-4 rounded-lg">{chapter.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{chapter.name}</h3>
                    <p className="text-gray-300 mb-4">{chapter.description}</p>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">Current Projects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {chapter.projects.map((project, i) => (
                          <span key={i} className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href={`/chapters/${chapter.id}`}>
                      <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-0">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/chapters">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Explore All Chapters</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

