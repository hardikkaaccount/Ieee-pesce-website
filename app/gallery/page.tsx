"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Canvas } from "@react-three/fiber"
import { Float, Environment, PerspectiveCamera, Text3D } from "@react-three/drei"
import type * as THREE from "three"
import { Search, Filter, ChevronDown, X, ZoomIn, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { WebPageJsonLd } from "@/components/seo/json-ld"

function FloatingText() {
  const mesh = useRef<THREE.Mesh>(null)

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D ref={mesh} font="/fonts/Inter_Bold.json" size={0.5} height={0.1} curveSegments={12} position={[-2, 0, 0]}>
        {/* Gallery */}
        <meshStandardMaterial color="#0066A1" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Float>
  )
}

// Sample gallery data
const galleryItems = [
  {
    id: 1,
    title: "TechVista 2023",
    category: "Events",
    date: "October 15, 2023",
    location: "Main Auditorium, PESCE",
    description: "Annual technical symposium featuring workshops, competitions, and expert talks.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=TechVista+Image+2",
      "/placeholder.svg?height=600&width=800&text=TechVista+Image+3",
    ],
    thumbnail: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 2,
    title: "AI Workshop",
    category: "Workshops",
    date: "September 28, 2023",
    location: "CS Department, PESCE",
    description: "Hands-on workshop on artificial intelligence and machine learning fundamentals.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=AI+Workshop+Image+2",
    ],
    thumbnail: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 3,
    title: "IEEE Day Celebration",
    category: "Celebrations",
    date: "October 1, 2023",
    location: "College Grounds, PESCE",
    description: "Celebrating IEEE Day with technical activities, games, and networking.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=IEEE+Day+Image+2",
      "/placeholder.svg?height=600&width=800&text=IEEE+Day+Image+3",
      "/placeholder.svg?height=600&width=800&text=IEEE+Day+Image+4",
    ],
    thumbnail: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 4,
    title: "Industrial Visit to ISRO",
    category: "Industrial Visits",
    date: "June 15, 2023",
    location: "ISRO, Bangalore",
    description: "Educational visit to Indian Space Research Organization.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=ISRO+Visit+Image+2",
    ],
    thumbnail: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 5,
    title: "Project Expo 2023",
    category: "Exhibitions",
    date: "July 20, 2023",
    location: "College Auditorium, PESCE",
    description: "Exhibition of innovative student projects from various engineering disciplines.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=Project+Expo+Image+2",
      "/placeholder.svg?height=600&width=800&text=Project+Expo+Image+3",
    ],
    thumbnail: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 6,
    title: "Robotics Challenge",
    category: "Competitions",
    date: "January 15, 2023",
    location: "Innovation Center, PESCE",
    description: "Competition to build and program robots for specific tasks.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=Robotics+Image+2",
    ],
    thumbnail: "/placeholder.svg?height=600&width=800",
  },
]

// Categories for filtering
const categories = [
  "All Categories",
  "Events",
  "Workshops",
  "Celebrations",
  "Industrial Visits",
  "Exhibitions",
  "Competitions",
]

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryData, setGalleryData] = useState(galleryItems)
  const [isClient, setIsClient] = useState(false)

  // Function to get image source - simplified to use server paths directly
  const getImageSrc = (imagePath: string) => {
    // If we have a valid path, return it directly
    if (imagePath && (imagePath.startsWith('/gallery/') || imagePath.startsWith('/placeholder'))) {
      return imagePath;
    }
    
    // Fallback to placeholder
    return "/placeholder.svg";
  }

  // Filter gallery items based on search term and category
  const filteredItems = galleryData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Load gallery items from API
  useEffect(() => {
    setIsClient(true)
    
    // Fetch gallery items from API
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch('/api/gallery')
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items')
        }
        
        const data = await response.json()
        
        if (Array.isArray(data) && data.length > 0) {
          setGalleryData(data)
        } else {
          // If API returns empty array, use default gallery items
          setGalleryData(galleryItems)
        }
      } catch (error) {
        console.error("Error fetching gallery items:", error)
        // Use default items on error
        setGalleryData(galleryItems)
      }
    }
    
    fetchGalleryItems()
  }, [])

  // Function to open an event's gallery
  const openGallery = (itemId: number) => {
    setSelectedImage(itemId)
    setCurrentImageIndex(0) // Reset to first image when opening
  }

  // Get the selected event item
  const selectedItem = selectedImage !== null ? galleryData.find(item => item.id === selectedImage) : null

  const galleryRef = useRef<HTMLDivElement>(null)
  const galleryInView = useInView(galleryRef, { once: true, amount: 0.2 })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <WebPageJsonLd
        title="IEEE PESCE Gallery"
        description="Browse through images and memories from IEEE PESCE Student Branch activities, events, and workshops. See the community in action."
        url="/gallery"
        image="/images/gallery-cover.jpg"
      />
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
                IEEE PESCE Gallery
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore photos from our events, workshops, and activities.
              </p>

              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row items-center gap-4 max-w-3xl mx-auto">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search gallery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white pl-10 w-full"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2 w-full md:w-auto"
                    >
                      <Filter size={18} />
                      Filter: {selectedCategory}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-blue-950 border-blue-800">
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="hover:bg-blue-900/30"
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <section ref={galleryRef} className="py-16 bg-gradient-to-b from-black to-blue-950">
          <div className="container mx-auto px-4">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-blue-950/20 border border-blue-900/50 rounded-xl overflow-hidden hover:border-blue-600/50 transition-all duration-300 group"
                    onClick={() => openGallery(item.id)}
                  >
                    <div className="relative h-64 cursor-pointer">
                      <Image
                        src={getImageSrc(item.thumbnail || item.images[0] || "")}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ZoomIn className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </div>
                      {item.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          {item.images.length} photos
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <div className="flex items-center gap-2 text-gray-400 mt-2">
                        <Calendar size={14} />
                        <span className="text-sm">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 mt-1">
                        <MapPin size={14} />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No gallery items found matching your search criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Image Lightbox */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full">
              <button
                className="absolute top-4 right-4 bg-blue-900/50 rounded-full p-2 text-white hover:bg-blue-800 transition-colors z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl overflow-hidden">
                <div className="relative h-[70vh]">
                  <Image
                    src={getImageSrc(selectedItem.images[currentImageIndex] || "")}
                    alt={`${selectedItem.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                  
                  {/* Image Navigation */}
                  {selectedItem.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {selectedItem.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{selectedItem.title}</h3>
                    {selectedItem.images.length > 1 && (
                      <span className="text-gray-300 text-sm">
                        Image {currentImageIndex + 1} of {selectedItem.images.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{selectedItem.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{selectedItem.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-300">{selectedItem.description}</p>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                  onClick={() => {
                    if (selectedItem.images.length > 1) {
                      setCurrentImageIndex((prev) => 
                        (prev - 1 + selectedItem.images.length) % selectedItem.images.length
                      );
                    } else {
                      // If only one image in current event, navigate to previous event
                      const currentIndex = galleryData.findIndex((item) => item.id === selectedImage);
                      const prevIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
                      setSelectedImage(galleryData[prevIndex].id);
                      setCurrentImageIndex(0);
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                  onClick={() => {
                    if (selectedItem.images.length > 1) {
                      setCurrentImageIndex((prev) => 
                        (prev + 1) % selectedItem.images.length
                      );
                    } else {
                      // If only one image in current event, navigate to next event
                      const currentIndex = galleryData.findIndex((item) => item.id === selectedImage);
                      const nextIndex = (currentIndex + 1) % galleryData.length;
                      setSelectedImage(galleryData[nextIndex].id);
                      setCurrentImageIndex(0);
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Video Gallery */}
        <section className="py-16 bg-blue-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Video <span className="text-blue-400">Gallery</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">Watch videos from our events, workshops, and activities.</p>
            </div>

            <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-6 max-w-4xl mx-auto">
              <p className="text-center text-gray-300 mb-4">
                Our video gallery is coming soon. We're working on curating and uploading videos from our recent events.
              </p>
              <div className="flex justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Subscribe for Updates</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Photos */}
        <section className="py-16 bg-gradient-to-b from-blue-950 to-black">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">
                  Submit Your <span className="text-blue-400">Photos</span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Did you attend one of our events? Share your photos with us to be featured in our gallery.
                </p>
                <p className="text-gray-300 mb-6">
                  We welcome high-quality photos that capture the essence of IEEE PESCE activities, events, and the
                  vibrant community spirit.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Submit Photos</Button>
              </div>

              <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Submission Guidelines</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">1</span>
                    </div>
                    <p>Photos should be related to IEEE PESCE events or activities.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">2</span>
                    </div>
                    <p>Images should be high resolution (at least 1920x1080 pixels).</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">3</span>
                    </div>
                    <p>Include details about the event, date, and location.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">4</span>
                    </div>
                    <p>Ensure you have permission from people featured prominently in the photos.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

