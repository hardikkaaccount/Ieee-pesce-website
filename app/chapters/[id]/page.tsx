"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, Users, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Chapter } from "@/app/lib/types"

type ChapterPageProps = {
  params: {
    id: string
  }
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { id } = params
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/chapters/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Chapter not found")
          } else {
            throw new Error('Failed to fetch chapter data')
          }
          setLoading(false)
          return
        }
        
        const chapterData = await response.json()
        setChapter(chapterData)
      } catch (error) {
        console.error("Error fetching chapter data:", error)
        setError("Error loading chapter data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchChapterData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-500" />
          <p>Loading chapter data...</p>
        </div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{error || "Chapter not found"}</h1>
        <Link href="/chapters">
          <Button className="bg-blue-600 hover:bg-blue-700">Return to Chapters</Button>
        </Link>
      </div>
    )
  }

  // Determine color theme based on chapter ID
  const colorMap: Record<string, string> = {
    "comsoc": "blue",
    "wie": "purple",
    "cs": "green",
  }
  
  const color = colorMap[id] || "blue"
  const bgColor = `bg-${color}-950/20`
  const borderColor = `border-${color}-900/50`
  const textGradient = `bg-gradient-to-r from-${color}-400 to-${color}-600` 

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/chapters">
            <Button 
              variant="outline" 
              size="icon" 
              className={`bg-transparent ${borderColor} hover:bg-${color}-900/30`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          
          <h1 className={`text-3xl font-bold bg-clip-text text-transparent ${textGradient}`}>
            {chapter.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About the Chapter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`${bgColor} ${borderColor} rounded-xl p-6`}
            >
              <h2 className="text-2xl font-bold mb-4 text-white">About</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{chapter.description}</p>
            </motion.div>

            {/* Projects */}
            {chapter.projects && chapter.projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`${bgColor} ${borderColor} rounded-xl p-6`}
              >
                <h2 className="text-2xl font-bold mb-4 text-white">Projects</h2>
                <div className="grid grid-cols-1 gap-4">
                  {chapter.projects.map((project, index) => (
                    <div key={index} className={`bg-${color}-900/20 ${borderColor} rounded-lg p-4`}>
                      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-300">{project.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Events */}
            {chapter.events && chapter.events.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`${bgColor} ${borderColor} rounded-xl p-6`}
              >
                <h2 className="text-2xl font-bold mb-4 text-white">Events</h2>
                <div className="grid grid-cols-1 gap-4">
                  {chapter.events.map((event, index) => (
                    <div key={index} className={`bg-${color}-900/20 ${borderColor} rounded-lg p-4`}>
                      <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <p className="text-gray-300">{event.description}</p>
                      <Button
                        variant="ghost"
                        className={`text-${color}-400 hover:text-${color}-300 hover:bg-${color}-900/20 p-0 mt-4 flex items-center gap-1`}
                      >
                        Learn More <ArrowRight size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-8">
            {/* Team */}
            {chapter.team && chapter.team.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`${bgColor} ${borderColor} rounded-xl p-6`}
              >
                <h2 className="text-2xl font-bold mb-4 text-white">Team</h2>
                <div className="space-y-4">
                  {chapter.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={member.image || "/placeholder.svg?height=100&width=100"}
                          alt={member.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg?height=100&width=100";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{member.name}</h3>
                        <p className={`text-${color}-400`}>{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Join Chapter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`${bgColor} ${borderColor} rounded-xl p-6`}
            >
              <h2 className="text-xl font-bold mb-4 text-white">Join {chapter.name}</h2>
              <p className="text-gray-300 mb-4">
                Interested in joining the {chapter.name}? Fill out the membership form to get started!
              </p>
              <Button className={`w-full bg-${color}-600 hover:bg-${color}-700`}>Join Chapter</Button>
            </motion.div>

            {/* Chapter Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`${bgColor} ${borderColor} rounded-xl p-6`}
            >
              <h2 className="text-xl font-bold mb-4 text-white">Chapter Info</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`bg-${color}-900/30 p-2 rounded`}>
                    <Users size={16} className={`text-${color}-400`} />
                  </div>
                  <div>
                    <p className="text-gray-300">Active Members</p>
                    <p className="text-lg font-bold text-white">30+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`bg-${color}-900/30 p-2 rounded`}>
                    <Calendar size={16} className={`text-${color}-400`} />
                  </div>
                  <div>
                    <p className="text-gray-300">Events This Year</p>
                    <p className="text-lg font-bold text-white">{chapter.events ? chapter.events.length : 0}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 