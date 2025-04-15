"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Chapter } from "@/app/lib/types"

export default function WIEChapterPage() {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const response = await fetch('/api/chapters/wie')
        
        if (!response.ok) {
          throw new Error('Failed to fetch chapter data')
        }
        
        const chapterData = await response.json()
        setChapter(chapterData)
      } catch (error) {
        console.error("Error fetching chapter data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChapterData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
        <Link href="/chapters">
          <Button className="bg-purple-600 hover:bg-purple-700">Return to Chapters</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/chapters">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-transparent border-purple-800 hover:bg-purple-900/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
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
              className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-6"
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
                className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold mb-4 text-white">Projects</h2>
                <div className="grid grid-cols-1 gap-4">
                  {chapter.projects.map((project, index) => (
                    <div key={index} className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-300">{project.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Future Initiatives */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Future Initiatives</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-2">Women in STEM Mentorship Program</h3>
                  <p className="text-gray-300">
                    A structured mentorship program connecting female engineering students with successful women professionals in the industry, providing guidance, career advice, and inspirational support.
                  </p>
                </div>
                <div className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-2">STEM for Girls Outreach</h3>
                  <p className="text-gray-300">
                    Engaging with local schools to inspire young girls to pursue STEM education through interactive workshops, demonstrations, and hands-on activities designed to spark interest in engineering and technology.
                  </p>
                </div>
                <div className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-2">Technical Skill Development Series</h3>
                  <p className="text-gray-300">
                    Specialized workshops focusing on building technical skills in emerging technologies like AI, cybersecurity, and IoT, tailored to address the specific challenges and opportunities for women in these fields.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Events</h2>
              <div className="grid grid-cols-1 gap-4">
                {chapter.events && chapter.events.map((event, index) => (
                  <div key={index} className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <p className="text-gray-300">{event.description}</p>
                    <Button
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-0 mt-4 flex items-center gap-1"
                    >
                      Learn More <ArrowRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Team</h2>
              <div className="space-y-4">
                {chapter.team && chapter.team.map((member, index) => (
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
                      <p className="text-purple-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Join Chapter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-white">Join {chapter.name}</h2>
              <p className="text-gray-300 mb-4">
                Interested in joining {chapter.name}? Fill out the membership form to get started!
              </p>
              <Button className="w-full bg-purple-800 hover:bg-purple-900">Join Chapter</Button>
            </motion.div>

            {/* Chapter Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-white">Our Mission</h2>
              <p className="text-gray-300 mb-4">
                To inspire, engage, and empower women in engineering through education, mentorship, leadership development, and collaborative initiatives.
              </p>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <div className="bg-purple-900/30 p-2 rounded-full mt-0.5">
                    <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">Create a supportive community for women engineers</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-purple-900/30 p-2 rounded-full mt-0.5">
                    <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">Develop technical and leadership skills</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-purple-900/30 p-2 rounded-full mt-0.5">
                    <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">Promote diversity and inclusion in STEM</p>
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