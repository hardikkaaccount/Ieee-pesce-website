"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { Float, Environment, PerspectiveCamera, Text3D } from "@react-three/drei"
import type * as THREE from "three"
import { Cpu, Zap, BotIcon as Robot, Globe, Users, BookOpen, Calendar, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Chapter } from "@/app/lib/types"

function FloatingText() {
  const mesh = useRef<THREE.Mesh>(null)

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        ref={mesh}
        font="/fonts/Inter_Bold.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
        position={[-2.5, 0, 0]}
      >
        {/* Chapters */}
        <meshStandardMaterial color="#0066A1" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Float>
  )
}

// Default chapter icons mapping
const chapterIcons: Record<string, JSX.Element> = {
  "comsoc": <Globe className="h-10 w-10 text-blue-400" />,
  "wie": <Users className="h-10 w-10 text-purple-400" />,
  "cs": <Cpu className="h-10 w-10 text-green-400" />,
  "default": <BookOpen className="h-10 w-10 text-blue-400" />
};

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Record<string, Chapter>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  
  const overviewRef = useRef<HTMLDivElement>(null)
  const overviewInView = useInView(overviewRef, { once: true, amount: 0.2 })

  const chaptersRef = useRef<HTMLDivElement>(null)
  const chaptersInView = useInView(chaptersRef, { once: true, amount: 0.2 })

  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Fetch chapters data from API
    const fetchChapters = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/chapters')
        
        if (!response.ok) {
          throw new Error('Failed to fetch chapters data')
        }
        
        const chaptersData = await response.json()
        setChapters(chaptersData)
        
        // Set the first chapter as active tab
        if (Object.keys(chaptersData).length > 0) {
          setActiveTab(Object.keys(chaptersData)[0])
        }
      } catch (error) {
        console.error("Error fetching chapters:", error)
        setError("Failed to load chapters. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchChapters()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <FloatingText />
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              IEEE PESCE Chapters & SIGs
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our specialized technical chapters and special interest groups focused on various domains of
              engineering and technology.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Overview Section */}
      <section ref={overviewRef} className="py-16 bg-gradient-to-b from-black to-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={overviewInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">
                About Our <span className="text-blue-400">Chapters</span>
              </h2>
              <p className="text-gray-300 mb-4">
                IEEE PESCE Student Branch hosts several technical chapters, each focusing on a specific field of
                engineering and technology. These chapters provide specialized knowledge, resources, and opportunities
                for students interested in these domains.
              </p>
              <p className="text-gray-300 mb-4">
                Each chapter organizes workshops, seminars, competitions, and projects related to their technical focus
                area, helping members develop expertise in their field of interest.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-blue-900/30 p-4 rounded-lg flex flex-col items-center">
                  <span className="text-3xl font-bold text-blue-400">{Object.keys(chapters).length}</span>
                  <span className="text-sm text-gray-300">Technical Chapters</span>
                </div>
                <div className="bg-blue-900/30 p-4 rounded-lg flex flex-col items-center">
                  <span className="text-3xl font-bold text-blue-400">20+</span>
                  <span className="text-sm text-gray-300">Projects</span>
                </div>
                <div className="bg-blue-900/30 p-4 rounded-lg flex flex-col items-center">
                  <span className="text-3xl font-bold text-blue-400">30+</span>
                  <span className="text-sm text-gray-300">Events Per Year</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
                <Image
                  src="/chapters.png?height=800&width=600"
                  alt="IEEE PESCE Chapters"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-blue-800 p-4 rounded-lg shadow-xl">
                <p className="text-white font-medium">
                  "Our chapters provide specialized knowledge and hands-on experience in various technical domains."
                </p>
                <p className="text-sm text-blue-200 mt-2">- Technical Activities Coordinator, IEEE PESCE</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapters Section */}
      <section ref={chaptersRef} className="py-16 bg-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={chaptersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Our <span className="text-blue-400">Technical Chapters</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Explore our specialized chapters and their activities.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={40} className="animate-spin text-blue-500" />
                <p className="text-gray-400">Loading chapters...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-8 text-center max-w-xl mx-auto">
              <p className="text-red-300">{error}</p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : Object.keys(chapters).length === 0 ? (
            <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-8 text-center max-w-xl mx-auto">
              <p className="text-gray-300">No chapters found. Check back later!</p>
            </div>
          ) : (
            <Tabs 
              value={activeTab || Object.keys(chapters)[0]} 
              onValueChange={setActiveTab}
              className="max-w-5xl mx-auto"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-blue-900/20 p-1 rounded-lg mb-8">
                {Object.entries(chapters).map(([id, chapter]) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    {chapter.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(chapters).map(([id, chapter]) => (
                <TabsContent key={id} value={id} className="border-none p-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                    {/* Chapter Overview */}
                    <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 md:col-span-2">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="bg-blue-900/30 p-4 rounded-lg">
                          {chapterIcons[id] || chapterIcons.default}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{chapter.name}</h3>
                          <p className="text-gray-300 mt-2">{chapter.description}</p>
                        </div>
                      </div>

                      {chapter.projects && chapter.projects.length > 0 && (
                        <>
                          <h4 className="text-lg font-bold text-white mb-4">Current Projects</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {chapter.projects.map((project, index) => (
                              <div key={index} className="bg-blue-900/30 rounded-lg p-4">
                                <h5 className="font-bold text-white mb-2">{project.title}</h5>
                                <p className="text-gray-300 text-sm">{project.description}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {chapter.events && chapter.events.length > 0 && (
                        <>
                          <h4 className="text-lg font-bold text-white mb-4">Upcoming Events</h4>
                          <div className="space-y-4">
                            {chapter.events.slice(0, 2).map((event, index) => (
                              <div key={index} className="bg-blue-900/30 rounded-lg p-4">
                                <h5 className="font-bold text-white mb-2">{event.title}</h5>
                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                  <Calendar size={16} />
                                  <span>{event.date}</span>
                                </div>
                                <p className="text-gray-300 text-sm">{event.description}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6">
                            <Link href={`/chapters/${id}`}>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                View Chapter Details
                              </Button>
                            </Link>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Team Section */}
                    <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Chapter Team</h4>
                      
                      {chapter.team && chapter.team.length > 0 ? (
                        <div className="space-y-4">
                          {chapter.team.slice(0, 3).map((member, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-900/30">
                                {member.image ? (
                                  <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Users size={20} className="text-blue-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h5 className="font-bold text-white text-sm">{member.name}</h5>
                                <p className="text-blue-400 text-xs">{member.role}</p>
                              </div>
                            </div>
                          ))}
                          
                          {chapter.team.length > 3 && (
                            <p className="text-sm text-gray-400 mt-2">
                              +{chapter.team.length - 3} more team members
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No team members listed.</p>
                      )}
                      
                      <div className="mt-8">
                        <h4 className="text-lg font-bold text-white mb-4">Join {chapter.name}</h4>
                        <p className="text-gray-300 text-sm mb-4">
                          Interested in {chapter.name}? Join our chapter to learn and grow with us!
                        </p>
                        <Link href={`/chapters/${id}`}>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

