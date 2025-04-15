"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, Clock, Users, Tag, Search, ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { OrganizationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld"

// Event type definition
interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  image: string
  registration: boolean
  featured: boolean
  attendees?: number
  registrationLink?: string
  detailsLink?: string
}

// Default event data (will use localStorage instead if available)
const defaultEvents: Event[] = [
  {
    id: 1,
    title: "TechVista 2023",
    description: "Annual technical symposium featuring workshops, competitions, and expert talks on emerging technologies.",
    date: "October 15, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium, PESCE",
    category: "Symposium",
    image: "/upcoming/tDay.jpg",
    registration: true,
    featured: true,
    attendees: 500,
    registrationLink: "https://example.com/register-techvista",
    detailsLink: "https://example.com/techvista-details"
  },
  {
    id: 2,
    title: "Workshop on AI & Machine Learning",
    description: "Hands-on workshop covering the fundamentals and applications of AI and ML with practical sessions.",
    date: "November 5, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "CS Department, PESCE",
    category: "Workshop",
    image: "/upcoming/ai_workshop.jpeg",
    registration: true,
    featured: true,
    attendees: 150,
    registrationLink: "https://example.com/register-ai-workshop",
    detailsLink: "https://example.com/ai-workshop-details"
  },
  {
    id: 3,
    title: "Industry Connect Series",
    description: "Interactive session with industry experts from leading tech companies discussing career opportunities and industry trends.",
    date: "December 10, 2023",
    time: "2:00 PM - 5:00 PM",
    location: "Seminar Hall, PESCE",
    category: "Talk",
    image: "/events/doodle.jpeg",
    registration: true,
    featured: false,
    attendees: 200,
    registrationLink: "https://example.com/register-industry-connect",
    detailsLink: "https://example.com/industry-connect-details"
  },
  {
    id: 4,
    title: "Hackathon: Code for Change",
    description: "24-hour coding competition to develop innovative solutions for real-world problems. Open to all IEEE members.",
    date: "January 20, 2024",
    time: "9:00 AM onwards",
    location: "Innovation Center, PESCE",
    category: "Competition",
    image: "/events/cybsec.jpg",
    registration: true,
    featured: true,
    attendees: 100,
    registrationLink: "https://example.com/register-hackathon",
    detailsLink: "https://example.com/hackathon-details"
  },
  {
    id: 5,
    title: "IEEE Day Celebration",
    description: "Celebrating IEEE Day with technical activities, games, and networking opportunities for members.",
    date: "October 1, 2023",
    time: "10:00 AM - 2:00 PM",
    location: "College Grounds, PESCE",
    category: "Celebration",
    image: "/events/wDay.jpg",
    registration: false,
    featured: false,
    attendees: 300,
    registrationLink: "https://example.com/register-ieee-day",
    detailsLink: "https://example.com/ieee-day-details"
  },
  {
    id: 6,
    title: "Python Programming Bootcamp",
    description: "Intensive three-day bootcamp on Python programming fundamentals and applications in data science.",
    date: "November 15-17, 2023",
    time: "9:00 AM - 1:00 PM",
    location: "Computer Lab, PESCE",
    category: "Workshop",
    image: "/events/python.jpeg",
    registration: true,
    featured: false,
    attendees: 80,
    registrationLink: "https://example.com/register-python-bootcamp",
    detailsLink: "https://example.com/python-bootcamp-details"
  }
]

// Default past events
const defaultPastEvents: Event[] = [
  {
    id: 101,
    title: "Web Development Workshop",
    description: "Hands-on workshop on modern web development technologies including React, Node.js, and MongoDB.",
    date: "August 5, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "CS Department, PESCE",
    category: "Workshop",
    image: "/events/WOMweb.jpeg",
    registration: false,
    featured: false,
    registrationLink: "https://example.com/register-web-development-workshop",
    detailsLink: "https://example.com/web-development-workshop-details"
  },
  {
    id: 102,
    title: "Project Expo 2023",
    description: "Exhibition of innovative student projects from various engineering disciplines with prizes for top projects.",
    date: "July 20, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "College Auditorium, PESCE",
    category: "Exhibition",
    image: "/events/aicteedit.jpg",
    registration: false,
    featured: false,
    registrationLink: "https://example.com/register-project-expo",
    detailsLink: "https://example.com/project-expo-details"
  },
  {
    id: 103,
    title: "Industrial Visit to ISRO",
    description: "Educational visit to Indian Space Research Organization to learn about space technology and satellite systems.",
    date: "June 15, 2023",
    time: "8:00 AM - 6:00 PM",
    location: "ISRO, Bangalore",
    category: "Industrial Visit",
    image: "/events/VR Workshop _1_.jpg",
    registration: false,
    featured: false,
    registrationLink: "https://example.com/register-industrial-visit",
    detailsLink: "https://example.com/industrial-visit-details"
  },
  {
    id: 104,
    title: "Technical Paper Presentation",
    description: "Platform for students to present their research papers on various technical topics and get feedback from experts.",
    date: "May 25, 2023",
    time: "9:00 AM - 3:00 PM",
    location: "Seminar Hall, PESCE",
    category: "Competition",
    image: "/events/byteTheBits.jpg",
    registration: false,
    featured: false,
    registrationLink: "https://example.com/register-technical-paper-presentation",
    detailsLink: "https://example.com/technical-paper-presentation-details"
  }
]

export default function EventsPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [events, setEvents] = useState<Event[]>(defaultEvents)
  const [pastEvents, setPastEvents] = useState<Event[]>(defaultPastEvents)
  const [isClient, setIsClient] = useState(false)
  
  // Load events from API endpoints
  useEffect(() => {
    setIsClient(true)
    
    // Function to fetch upcoming events
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch('/api/events')
        
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming events')
        }
        
        const data = await response.json()
        
        // Validate event images - use placeholder if image path doesn't exist
        const validatedEvents = data.map((event: Event) => ({
          ...event,
          image: event.image || "/placeholder.svg?height=200&width=300"
        }))
        
        setEvents(validatedEvents)
      } catch (error) {
        console.error("Error fetching upcoming events:", error)
        setEvents(defaultEvents)
      }
    }
    
    // Function to fetch past events
    const fetchPastEvents = async () => {
      try {
        const response = await fetch('/api/events?past=true')
        
        if (!response.ok) {
          throw new Error('Failed to fetch past events')
        }
        
        const data = await response.json()
        
        // Validate event images
        const validatedPastEvents = data.map((event: Event) => ({
          ...event,
          image: event.image || "/placeholder.svg?height=200&width=300"
        }))
        
        setPastEvents(validatedPastEvents)
      } catch (error) {
        console.error("Error fetching past events:", error)
        setPastEvents(defaultPastEvents)
      }
    }
    
    // Fetch both upcoming and past events
    fetchUpcomingEvents()
    fetchPastEvents()
  }, [])
  
  // Filter events based on search term and category filter
  const filteredUpcomingEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || event.category.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })
  
  const filteredPastEvents = pastEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || event.category.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })
  
  // Get featured events
  const featuredEvents = events.filter(event => event.featured)
  
  const featuredRef = useRef<HTMLDivElement>(null)
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.2 })
  
  const eventsRef = useRef<HTMLDivElement>(null)
  const eventsInView = useInView(eventsRef, { once: true, amount: 0.2 })
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  return (
    <>
      <WebPageJsonLd
        title="IEEE PESCE Events"
        description="Discover upcoming and past events organized by IEEE PESCE Student Branch. Join our technical workshops, conferences, and social gatherings."
        url="/events"
        image="/events/1.png"
      />
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-blue-950 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                Events & Activities
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join us for engaging workshops, competitions, and talks designed to enhance your technical knowledge and professional skills.
              </p>
              
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row items-center gap-4 max-w-3xl mx-auto mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white pl-10 w-full"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2 w-full md:w-auto">
                      <Filter size={18} />
                      Filter: {filter === "all" ? "All Categories" : filter}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-blue-950 border-blue-800">
                    <DropdownMenuItem onClick={() => setFilter("all")} className="hover:bg-blue-900/30">
                      All Categories
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Workshop")} className="hover:bg-blue-900/30">
                      Workshop
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Symposium")} className="hover:bg-blue-900/30">
                      Symposium
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Talk")} className="hover:bg-blue-900/30">
                      Talk
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Competition")} className="hover:bg-blue-900/30">
                      Competition
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Celebration")} className="hover:bg-blue-900/30">
                      Celebration
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Exhibition")} className="hover:bg-blue-900/30">
                      Exhibition
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Industrial Visit")} className="hover:bg-blue-900/30">
                      Industrial Visit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Events */}
        <section ref={featuredRef} className="py-12 bg-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Events</h2>
              <div className="h-1 w-20 bg-blue-500 rounded"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.length > 0 ? (
                featuredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.1 * (event.id % 5) }}
                  >
                    <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg overflow-hidden hover:border-blue-500 transition-all">
                      <div className="relative h-80 w-full">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=300&width=400"
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
                          <Tag size={14} />
                          <span>{event.category}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Calendar size={14} className="text-blue-400" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Clock size={14} className="text-blue-400" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <MapPin size={14} className="text-blue-400" />
                            <span>{event.location}</span>
                          </div>
                          {event.attendees && (
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Users size={14} className="text-blue-400" />
                              <span>Expected Attendees: {event.attendees}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {event.registration && (
                            <Button 
                              variant="default" 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => {
                                if (event.registrationLink) {
                                  window.open(event.registrationLink, '_blank')
                                }
                              }}
                            >
                              Register Now
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            className="w-full border-blue-500 text-blue-400 hover:bg-blue-900/20"
                            onClick={() => {
                              if (event.detailsLink) {
                                window.open(event.detailsLink, '_blank')
                              }
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-3 text-center py-12">
                  <p className="text-gray-400">No featured events at this time.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* All Events */}
        <section ref={eventsRef} className="py-12 bg-black">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={eventsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {activeTab === "upcoming" ? "Upcoming Events" : "Past Events"}
                </h2>
                <div className="h-1 w-20 bg-blue-500 rounded"></div>
              </motion.div>
              
              <div className="flex bg-blue-950/30 border border-blue-900/50 rounded-md">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    activeTab === "upcoming"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-blue-900/50"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    activeTab === "past"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-blue-900/50"
                  }`}
                >
                  Past Events
                </button>
              </div>
            </div>
            
            {activeTab === "upcoming" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcomingEvents.length > 0 ? (
                  filteredUpcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={eventsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 0.1 * (index % 6) }}
                    >
                      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg overflow-hidden hover:border-blue-500 transition-all h-full flex flex-col">
                        <div className="relative h-80 w-full">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=300&width=400"
                            }}
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
                            <Tag size={14} />
                            <span>{event.category}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 flex-1">{event.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Calendar size={14} className="text-blue-400" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Clock size={14} className="text-blue-400" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <MapPin size={14} className="text-blue-400" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {event.registration && (
                              <Button 
                                variant="default" 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                  if (event.registrationLink) {
                                    window.open(event.registrationLink, '_blank')
                                  }
                                }}
                              >
                                Register Now
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              className="w-full border-blue-500 text-blue-400 hover:bg-blue-900/20"
                              onClick={() => {
                                if (event.detailsLink) {
                                  window.open(event.detailsLink, '_blank')
                                }
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-3 text-center py-12">
                    <p className="text-gray-400">No upcoming events matching your criteria.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPastEvents.length > 0 ? (
                  filteredPastEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={eventsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 0.1 * (index % 6) }}
                    >
                      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg overflow-hidden hover:border-blue-500 transition-all h-full flex flex-col">
                        <div className="relative h-80 w-full">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            style={{ filter: "grayscale(40%)" }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=300&width=400"
                            }}
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
                            <Tag size={14} />
                            <span>{event.category}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 flex-1">{event.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Calendar size={14} className="text-blue-400" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Clock size={14} className="text-blue-400" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <MapPin size={14} className="text-blue-400" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            className="w-full border-blue-500 text-blue-400 hover:bg-blue-900/20 mt-auto"
                            onClick={() => {
                              if (event.detailsLink) {
                                window.open(event.detailsLink, '_blank')
                              }
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-3 text-center py-12">
                    <p className="text-gray-400">No past events matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Calendar Section */}
        <section className="py-16 bg-blue-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Event <span className="text-blue-400">Calendar</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Plan ahead and mark your calendar for upcoming IEEE PESCE events.
              </p>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-6 max-w-4xl mx-auto">
              <p className="text-center text-gray-300 mb-4">
                Our interactive event calendar is coming soon. In the meantime, check out our upcoming events list above.
              </p>
              <div className="flex justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Subscribe to Calendar Updates
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Host an Event Section */}
        <section className="py-16 bg-gradient-to-b from-blue-950 to-black">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Want to <span className="text-blue-400">Host an Event</span>?
                </h2>
                <p className="text-gray-300 mb-6">
                  IEEE PESCE encourages student members to propose and organize events that align with our mission of advancing technology for humanity.
                </p>
                <p className="text-gray-300 mb-6">
                  Whether it's a workshop, technical talk, or competition, we can provide support in terms of venue, promotion, and resources.
                </p>
                <a href="https://forms.gle/nBJRk3Fh3rFy1DrZA" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Submit Event Proposal
                  </Button>
                </a>
              </div>
              
              <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Event Proposal Guidelines</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">1</span>
                    </div>
                    <p>The event should align with IEEE's technical focus areas and professional development goals.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">2</span>
                    </div>
                    <p>Proposals should be submitted at least 4 weeks before the planned event date.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">3</span>
                    </div>
                    <p>Include a clear description, target audience, required resources, and expected outcomes.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">4</span>
                    </div>
                    <p>The organizing team should include at least 2-3 IEEE student members.</p>
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

