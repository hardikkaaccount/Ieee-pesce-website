"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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

// Fallback events in case fetch fails
const fallbackEvents = [
  {
    id: 1,
    title: "TechVista 2023",
    description: "Annual technical symposium featuring workshops, competitions, and expert talks.",
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
    description: "Hands-on workshop covering the fundamentals and applications of AI and ML.",
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
    description: "Interactive session with industry experts discussing career opportunities.",
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
]

export default function EventsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [events, setEvents] = useState<Event[]>(fallbackEvents)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch events from the JSON file
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        
        const data = await response.json()
        
        if (data && data.length > 0) {
          // Sort events by date
          const sortedEvents = [...data].sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          })
          
          // Take only the featured events or the first 3
          const featuredEvents = sortedEvents.filter(event => event.featured)
          const eventsToShow = featuredEvents.length > 0 
            ? featuredEvents.slice(0, 3) 
            : sortedEvents.slice(0, 3)
          
          setEvents(eventsToShow)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        // Keep the fallback events if fetching fails
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  return (
    <section ref={ref} className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Upcoming <span className="text-blue-400">Events</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join us for exciting workshops, technical talks, and competitions designed to enhance your skills and
            knowledge.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-blue-950/30 rounded-xl overflow-hidden border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20"
              >
                <div className="relative h-48">
                  <Image 
                    src={event.image || "/placeholder.svg"} 
                    alt={event.title} 
                    fill 
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=200&width=400";
                    }} 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={16} />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Clock size={16} />
                      <span className="text-sm">{event.time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <MapPin size={16} />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 mt-4">
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
                    
                    <Link href={`/events?event=${event.id}`}>
                      <Button
                        variant="outline"
                        className="w-full border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center justify-center gap-1"
                      >
                        View Details <ArrowRight size={16} />
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
          <Link href="/events">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              View All Events <ArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

