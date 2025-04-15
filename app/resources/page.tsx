"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Canvas } from "@react-three/fiber"
import { Float, Environment, PerspectiveCamera, Text3D } from "@react-three/drei"
import type * as THREE from "three"
import { BookOpen, FileText, Video, Download, ExternalLink, Search, Filter, ChevronDown, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
        {/* Resources */}
        <meshStandardMaterial color="#0066A1" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Float>
  )
}

const categories = [
  "All Categories",
  "Academic",
  "Career",
  "Learning",
  "Technical",
  "Tools",
  "News",
]

const resourceTypes = ["All Types", "Research", "Networking", "Career", "Education", "Technical", "Mobile", "Magazine"]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedType, setSelectedType] = useState("All Types")
  const [resources, setResources] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const featuredRef = useRef<HTMLDivElement>(null)
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.2 })

  const libraryRef = useRef<HTMLDivElement>(null)
  const libraryInView = useInView(libraryRef, { once: true, amount: 0.2 })

  const projectsRef = useRef<HTMLDivElement>(null)
  const projectsInView = useInView(projectsRef, { once: true, amount: 0.2 })

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/resources')
        
        if (!response.ok) {
          throw new Error('Failed to load resources')
        }
        
        const data = await response.json()
        setResources(data)
      } catch (err) {
        console.error('Error loading resources:', err)
        setError('Failed to load resources. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchResources()
  }, [])

  // Filter resources based on search term, category, and type
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All Categories" || resource.category === selectedCategory
    const matchesType = selectedType === "All Types" || resource.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="h-6 w-6" />
      case "FileText":
        return <FileText className="h-6 w-6" />
      case "Video":
        return <Video className="h-6 w-6" />
      case "Download":
        return <Download className="h-6 w-6" />
      case "ExternalLink":
        return <ExternalLink className="h-6 w-6" />
      case "Search":
        return <Search className="h-6 w-6" />
      default:
        return <Link2 className="h-6 w-6" />
    }
  }

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
              Learning Resources
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Access a wealth of technical resources, tutorials, and project ideas to enhance your knowledge and skills.
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white pl-10 h-12 text-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* IEEE Resources Benefits */}
      <section className="py-16 bg-gradient-to-b from-black to-blue-950/60">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              IEEE Member <span className="text-blue-400">Benefits</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              IEEE membership provides access to exclusive technical resources, career advancement tools, and 
              networking opportunities to help you excel in your engineering journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Digital Library</h3>
              <p className="text-gray-300">
                Access millions of technical documents, research papers, and conference proceedings through IEEE Xplore.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Career Tools</h3>
              <p className="text-gray-300">
                Build your professional profile with IEEE ResumeLab and find engineering opportunities through IEEE JobSite.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Networking</h3>
              <p className="text-gray-300">
                Connect with professionals worldwide, join communities, and collaborate on projects through IEEE Collabratec.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Continuing Education</h3>
              <p className="text-gray-300">
                Stay updated with the latest technologies through IEEE Learning Network courses and educational resources.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section 
        ref={featuredRef} 
        className="py-16 bg-gradient-to-b from-blue-950/60 to-black"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Featured <span className="text-blue-400">Resources</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Explore these hand-picked resources to enhance your technical knowledge and IEEE experience.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center text-red-200 max-w-xl mx-auto">
              <p>{error}</p>
              <Button 
                className="mt-2 bg-red-700 hover:bg-red-600"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.filter(r => r.featured).map((resource) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="h-full bg-blue-950/20 border border-blue-900/50 hover:border-blue-600/50 transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-900/30 rounded-lg">
                          {getIconComponent(resource.icon || "Link2")}
                        </div>
                        
                        <div className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {resource.type}
                        </div>
                      </div>
                      <CardTitle className="mt-3 text-xl">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-gray-300 mb-4 text-sm">{resource.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-blue-400">{resource.category}</span>
                        <Button 
                          asChild 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500 transition-colors"
                        >
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            Access
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Resource Library */}
      <section 
        ref={libraryRef} 
        className="py-16 bg-gradient-to-b from-black to-blue-950/20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={libraryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start mb-8 gap-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">
                Resource <span className="text-blue-400">Library</span>
              </h2>
              <p className="text-gray-300 max-w-2xl">
                Browse our complete collection of technical and professional resources.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-blue-950 border-blue-900/50">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white w-full sm:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-blue-950 border-blue-900/50">
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center text-red-200 max-w-xl mx-auto">
              <p>{error}</p>
              <Button 
                className="mt-2 bg-red-700 hover:bg-red-600"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">No resources match your search criteria.</p>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All Categories")
                  setSelectedType("All Types")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={libraryInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredResources.map((resource) => (
                <Card 
                  key={resource.id} 
                  className="bg-blue-950/10 hover:bg-blue-950/20 border border-blue-900/30 hover:border-blue-900/50 transition-all"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="p-2 bg-blue-900/30 rounded-lg">
                        {getIconComponent(resource.icon || "Link2")}
                      </div>
                      <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {resource.type}
                      </span>
                    </div>
                    <CardTitle className="mt-3 text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{resource.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-400">{resource.category}</span>
                      <Button asChild variant="link" className="text-blue-400 p-0 h-auto">
                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          Access
                          <ExternalLink size={14} />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* IEEE Digital Library */}
      <section className="py-16 bg-gradient-to-b from-blue-950 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">
                IEEE <span className="text-blue-400">Digital Library</span>
              </h2>
              <p className="text-gray-300 mb-6">
                As an IEEE member, you have access to IEEE Xplore, one of the world's largest collections of technical
                literature in engineering, computer science, and related technologies.
              </p>
              <p className="text-gray-300 mb-6">
                The IEEE Xplore digital library contains over 5 million documents including research articles,
                standards, conferences, and educational courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" asChild>
                  <a href="https://ieeexplore.ieee.org/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={18} />
                    Access IEEE Xplore
                  </a>
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-900/20" asChild>
                  <a href="https://www.ieee.org/publications/guides/guide-for-authors.html" target="_blank" rel="noopener noreferrer">
                    Learn How to Use
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[300px] w-full rounded-xl overflow-hidden">
                <Image
                  src="/about-ieee-xplore-hero2x.jpg?height=600&width=800"
                  alt="IEEE Digital Library"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-blue-800 p-4 rounded-lg shadow-xl">
                <p className="text-white font-medium">
                  "IEEE Xplore provides access to cutting-edge research and technical standards."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Ideas */}
      <section ref={projectsRef} className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Project <span className="text-blue-400">Ideas</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Looking for inspiration for your next project? Explore these project ideas across various domains.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-white">Smart Home Automation</h3>
              <p className="text-gray-300 mb-4">
                Build a system to control home appliances using IoT devices and a mobile app interface.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">IoT</span>
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">Mobile App</span>
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">Embedded Systems</span>
              </div>
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-0 flex items-center gap-1"
                asChild
              >
                <a href="https://www.ieee.org/content/dam/ieee-org/ieee/web/org/pubs/ieee-project-ideas.pdf" target="_blank" rel="noopener noreferrer">
                  View Project Details <ExternalLink size={16} />
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-white">AI-Based Attendance System</h3>
              <p className="text-gray-300 mb-4">
                Develop a facial recognition system for automated attendance tracking in classrooms.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">AI</span>
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">Computer Vision</span>
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">Web App</span>
              </div>
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-0 flex items-center gap-1"
                asChild
              >
                <a href="https://www.ieee.org/content/dam/ieee-org/ieee/web/org/pubs/ieee-project-ideas.pdf" target="_blank" rel="noopener noreferrer">
                  View Project Details <ExternalLink size={16} />
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-white">Solar Energy Monitoring</h3>
              <p className="text-gray-300 mb-4">
                Create a system to monitor and analyze the performance of solar panels in real-time.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">Renewable Energy</span>
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">Data Analytics</span>
                <span className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">IoT</span>
              </div>
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-0 flex items-center gap-1"
                asChild
              >
                <a href="https://www.ieee.org/content/dam/ieee-org/ieee/web/org/pubs/ieee-project-ideas.pdf" target="_blank" rel="noopener noreferrer">
                  View Project Details <ExternalLink size={16} />
                </a>
              </Button>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <a href="https://www.ieee.org/education/student-projects.html" target="_blank" rel="noopener noreferrer">
                Explore More Project Ideas
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Publishing Guidance */}
      <section className="py-16 bg-gradient-to-b from-black to-blue-950">
        <div className="container mx-auto px-4">
          <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              Publishing <span className="text-blue-400">Guidance</span>
            </h2>
            <p className="text-gray-300 mb-8 text-center">
              Interested in publishing your research in IEEE conferences or journals? Here's how to get started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-white">Resources for Authors</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">IEEE Paper Template</h4>
                      <p className="text-gray-300 text-sm">Standard template for IEEE conference and journal papers</p>
                      <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto" asChild>
                        <a href="https://www.ieee.org/conferences/publishing/templates.html" target="_blank" rel="noopener noreferrer">
                          Download Template
                        </a>
                      </Button>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">Author Guidelines</h4>
                      <p className="text-gray-300 text-sm">Comprehensive guide for preparing and submitting papers</p>
                      <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto" asChild>
                        <a href="https://www.ieee.org/publications/guides/guide-for-authors.html" target="_blank" rel="noopener noreferrer">
                          View Guidelines
                        </a>
                      </Button>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">Paper Writing Workshop</h4>
                      <p className="text-gray-300 text-sm">Recorded workshop on writing effective technical papers</p>
                      <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto" asChild>
                        <a href="https://ieeetv.ieee.org/channels/ieee-author-center" target="_blank" rel="noopener noreferrer">
                          Watch Video
                        </a>
                      </Button>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-white">Publication Process</h3>
                <ol className="space-y-4">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">1</span>
                    </div>
                    <p className="text-gray-300">
                      Identify a suitable IEEE conference or journal for your research area
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">2</span>
                    </div>
                    <p className="text-gray-300">Prepare your manuscript according to the IEEE format guidelines</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">3</span>
                    </div>
                    <p className="text-gray-300">
                      Submit your paper through the conference or journal's submission system
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">4</span>
                    </div>
                    <p className="text-gray-300">
                      Address reviewer comments and submit the revised version if required
                    </p>
                  </li>
                </ol>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6" asChild>
                  <a href="https://www.ieee.org/publications/authors/author-center.html" target="_blank" rel="noopener noreferrer">
                    Get Publishing Support
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

