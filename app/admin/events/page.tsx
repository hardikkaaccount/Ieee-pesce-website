"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar, Edit, Plus, Trash2, Upload, X, Image as ImageIcon } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Event type definition
type Event = {
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

// Sample event data (will be replaced with local storage)
const sampleEvents = [
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
    attendees: 500
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
    attendees: 150
  }
]

// Sample past events
const samplePastEvents = [
  {
    id: 101,
    title: "Web Development Workshop",
    description: "Hands-on workshop on modern web development technologies including React, Node.js, and MongoDB.",
    date: "August 5, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "CS Department, PESCE",
    category: "Workshop",
    image: "/events/WOMweb.jpeg",
    registration: true,
    featured: false
  }
]

export default function AdminEvents() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [eventTab, setEventTab] = useState("upcoming")
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [imageDirectory, setImageDirectory] = useState<'all' | 'events' | 'upcoming'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Workshop",
    image: "/placeholder.svg?height=400&width=600",
    registration: false,
    featured: false,
    attendees: 0,
    registrationLink: "",
    detailsLink: ""
  })
  
  // Status messages
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info' | null;
    text: string;
  }>({ type: null, text: '' })
  
  // Fetch events from API
  useEffect(() => {
    setIsClient(true)
    
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }
    
    // Fetch upcoming events from API
    const fetchUpcomingEvents = async () => {
      try {
        setStatusMessage({ type: 'info', text: 'Loading upcoming events...' })
        const response = await fetch('/api/events')
        
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming events')
        }
        
        const data = await response.json()
        setEvents(data)
        setStatusMessage({ type: null, text: '' })
      } catch (error) {
        console.error("Error loading upcoming events:", error)
        setStatusMessage({ type: 'error', text: 'Failed to load upcoming events' })
        
        // Use sample data as fallback
        setEvents(sampleEvents)
      }
    }
    
    // Fetch past events from API
    const fetchPastEvents = async () => {
      try {
        const response = await fetch('/api/events?past=true')
        
        if (!response.ok) {
          throw new Error('Failed to fetch past events')
        }
        
        const data = await response.json()
        setPastEvents(data)
      } catch (error) {
        console.error("Error loading past events:", error)
        
        // Use sample data as fallback
        setPastEvents(samplePastEvents)
      }
    }
    
    fetchUpcomingEvents()
    fetchPastEvents()
    
    // Get list of available event images
    fetchEventImages()
  }, [router])
  
  const fetchEventImages = async () => {
    try {
      // In a real app, this would be an API call to fetch image list
      // For this demo, we'll use a predefined list of image paths
      const eventImages = [
        // Events directory images
        "/events/Techinar-21.jpg", 
        "/events/WOMweb.jpeg", 
        "/events/ai_workshop.jpeg", 
        "/events/aicteedit.jpg",
        "/events/BGMI-21.jpg",
        "/events/BGMI-23.jpeg",
        "/events/byteTheBits.jpg",
        "/events/cybsec.jpg",
        "/events/doodle.jpeg",
        "/events/freshers.jpg",
        "/events/kannadarajyotsava.jpeg",
        "/events/linux-Commands.jpeg",
        "/events/maidaan.jpg",
        "/events/Netflix-23.jpeg",
        "/events/nontech.jpg",
        "/events/paintcovid.jpg",
        "/events/patrika.jpg",
        "/events/prolang.jpeg",
        "/events/proshooter - Copy.jpeg",
        "/events/Puzzle Hunt-21.jpg",
        "/events/python.jpeg",
        "/events/R10.jpeg",
        "/events/riddleMe.jpg",
        "/events/Shark-Tank.jpeg",
        "/events/singcovid.jpg",
        "/events/tDay.jpeg",
        "/events/Super Minute-21.jpg",
        "/events/techSavvy.jpg",
        "/events/vagwada.jpg",
        "/events/VirtualHunt.jpeg",
        "/events/VR Workshop _1_.jpg",
        "/events/wDay.jpg",
        "/events/workshop.jpg",
        "/events/Auctus.jpeg",
        "/events/auctus.jpg",
        "/events/Aurifera 18.jpg",
        "/events/actology.jpg",
        
        // Upcoming directory images
        "/upcoming/tDay.jpg",
        "/upcoming/ai_workshop.jpeg"
      ]
      setAvailableImages(eventImages)
    } catch (error) {
      console.error("Error fetching event images:", error)
    }
  }
  
  const handleGoBack = () => {
    router.push("/admin/dashboard")
  }
  
  const openAddEventForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "Workshop",
      image: "/placeholder.svg?height=400&width=600",
      registration: false,
      featured: false,
      attendees: 0,
      registrationLink: "",
      detailsLink: ""
    })
    setFormMode("add")
    setFormDialogOpen(true)
  }
  
  const openEditEventForm = (event: Event) => {
    setEventToEdit(event)
    setFormData({ ...event })
    setFormMode("edit")
    setFormDialogOpen(true)
  }
  
  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event)
    setDeleteDialogOpen(true)
  }
  
  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      // Determine if it's a past event or upcoming event
      const isPast = eventTab === "past"
      const id = eventToDelete.id
      
      // Update state first to show immediate feedback
      if (isPast) {
        setPastEvents(pastEvents.filter(event => event.id !== id))
      } else {
        setEvents(events.filter(event => event.id !== id))
      }
      
      // Make API call to delete the event
      setStatusMessage({ type: 'info', text: 'Deleting event...' })
      
      fetch(`/api/events/${id}?past=${isPast}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete event')
          }
          setStatusMessage({ type: 'success', text: 'Event deleted successfully' })
          
          // Clear the status message after a delay
          setTimeout(() => {
            setStatusMessage({ type: null, text: '' })
          }, 3000)
        })
        .catch(error => {
          console.error("Error deleting event:", error)
          setStatusMessage({ type: 'error', text: 'Failed to delete event' })
          
          // Revert the state change if the API call failed
          if (isPast) {
            setPastEvents(prev => [...prev, eventToDelete])
          } else {
            setEvents(prev => [...prev, eventToDelete])
          }
        })
      
      setEventToDelete(null)
      setDeleteDialogOpen(false)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear previous status messages
    setStatusMessage({ type: null, text: '' })

    // Show preview image
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    setUploadStatus('uploading')

    try {
      // Determine directory based on current tab
      const directory = eventTab === "upcoming" ? "upcoming" : "events"
      
      // Create form data for the upload
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('title', formData.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase())
      
      // Upload the file
      const response = await fetch(`/api/upload?directory=${directory}`, {
        method: 'POST',
        body: uploadData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload file')
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Update the form data with the new image path
        setFormData(prev => ({ ...prev, image: result.filePath }))
        setUploadStatus('success')
        
        // Add the new image to available images list
        setAvailableImages(prev => [...prev, result.filePath])
        
        // Show success message
        setStatusMessage({
          type: 'success',
          text: 'Image uploaded successfully! Real file upload is now working.'
        })
        
        console.log(result.message)
      } else {
        throw new Error(result.error || 'Unknown error occurred')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadStatus('error')
      setStatusMessage({
        type: 'error',
        text: `Failed to upload image: ${(error as Error).message}`
      })
    }
  }
  
  const handleImageSelect = (imagePath: string) => {
    setFormData(prev => ({ ...prev, image: imagePath }))
    setImageDialogOpen(false)
  }

  const clearImagePreview = () => {
    setPreviewImage(null)
    setUploadStatus('idle')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.date || !formData.description) {
      setStatusMessage({ type: 'error', text: 'Please fill out all required fields' })
      return
    }
    
    const isPast = eventTab === "past"
    
    // Prepare event data
    let eventToSave: Event
    let apiUrl: string
    let method: string
    
    if (formMode === "add") {
      // When adding a new event, the ID will be generated by the server
      eventToSave = formData as Event
      apiUrl = `/api/events?past=${isPast}`
      method = 'POST'
    } else {
      // When editing, use the existing ID
      eventToSave = { ...formData, id: eventToEdit!.id }
      apiUrl = `/api/events/${eventToEdit!.id}?past=${isPast}`
      method = 'PUT'
    }
    
    // Update UI state first for immediate feedback
    setStatusMessage({ type: 'info', text: `${formMode === "add" ? "Adding" : "Updating"} event...` })
    
    // Make API call
    fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventToSave)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to ${formMode === "add" ? "add" : "update"} event`)
        }
        return response.json()
      })
      .then(data => {
        // Update local state with the response data (which will have the ID for new events)
        if (formMode === "add") {
          if (isPast) {
            setPastEvents([...pastEvents, data])
          } else {
            setEvents([...events, data])
          }
          setStatusMessage({ type: 'success', text: 'Event added successfully' })
        } else {
          if (isPast) {
            setPastEvents(pastEvents.map(event => event.id === data.id ? data : event))
          } else {
            setEvents(events.map(event => event.id === data.id ? data : event))
          }
          setStatusMessage({ type: 'success', text: 'Event updated successfully' })
        }
        
        // Clear status message after delay
        setTimeout(() => {
          setStatusMessage({ type: null, text: '' })
        }, 3000)
        
        // Close the form dialog
        setFormDialogOpen(false)
      })
      .catch(error => {
        console.error(`Error ${formMode === "add" ? "adding" : "updating"} event:`, error)
        setStatusMessage({ type: 'error', text: `Failed to ${formMode === "add" ? "add" : "update"} event` })
      })
  }
  
  const handleCancelForm = () => {
    setFormDialogOpen(false)
    setEventToEdit(null)
    setPreviewImage(null)
    setUploadStatus('idle')
    setStatusMessage({ type: null, text: '' })
  }
  
  const handleMoveEventToPast = (event: Event) => {
    if (confirm(`Are you sure you want to move "${event.title}" to past events?`)) {
      // Update UI first for immediate feedback
      setEvents(events.filter(e => e.id !== event.id))
      setPastEvents([...pastEvents, event])
      
      setStatusMessage({ type: 'info', text: 'Moving event to past events...' })
      
      // Make API call
      fetch(`/api/events/move-to-past/${event.id}`, {
        method: 'POST'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to move event to past events')
          }
          setStatusMessage({ type: 'success', text: 'Event moved to past events' })
          
          // Clear status message after delay
          setTimeout(() => {
            setStatusMessage({ type: null, text: '' })
          }, 3000)
        })
        .catch(error => {
          console.error("Error moving event to past:", error)
          setStatusMessage({ type: 'error', text: 'Failed to move event to past events' })
          
          // Revert state change if API call failed
          setEvents(prev => [...prev, event])
          setPastEvents(prev => prev.filter(e => e.id !== event.id))
        })
    }
  }
  
  if (!isClient) {
    return null // Prevents hydration errors
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Event Management
          </h1>
        </div>
        
        <div className="mb-6">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            onClick={openAddEventForm}
          >
            <Plus size={16} />
            Add New Event
          </Button>
        </div>
        
        <Tabs 
          defaultValue="upcoming" 
          value={eventTab} 
          onValueChange={setEventTab}
          className="mb-6"
        >
          <TabsList className="bg-blue-950/30 border border-blue-900/50">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="pt-4">
            {events.length === 0 ? (
              <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-10 text-center">
                <Calendar className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                <p className="text-gray-400 mb-4">Add a new event to get started</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2"
                  onClick={openAddEventForm}
                >
                  <Plus size={16} />
                  Add Event
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="border-collapse w-full">
                  <TableHeader>
                    <TableRow className="bg-blue-950/30">
                      <TableHead className="w-[50px]">Image</TableHead>
                      <TableHead className="w-1/4">Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id} className="border-b border-blue-900/30">
                        <TableCell>
                          <div className="relative h-10 w-10 rounded overflow-hidden">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=40&width=40"
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.date}<br />{event.time}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell>{event.featured ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditEventForm(event)}
                              className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-950/50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEvent(event)}
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {eventTab === "upcoming" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveEventToPast(event)}
                                className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-950/50"
                                title="Move to Past Events"
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="pt-4">
            {pastEvents.length === 0 ? (
              <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-10 text-center">
                <Calendar className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No past events</h3>
                <p className="text-gray-400 mb-4">Add a past event to your archive</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2"
                  onClick={openAddEventForm}
                >
                  <Plus size={16} />
                  Add Past Event
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="border-collapse w-full">
                  <TableHeader>
                    <TableRow className="bg-blue-950/30">
                      <TableHead className="w-[50px]">Image</TableHead>
                      <TableHead className="w-1/4">Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastEvents.map((event) => (
                      <TableRow key={event.id} className="border-b border-blue-900/30">
                        <TableCell>
                          <div className="relative h-10 w-10 rounded overflow-hidden">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=40&width=40"
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.date}<br />{event.time}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditEventForm(event)}
                              className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-950/50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEvent(event)}
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="bg-blue-950 border-blue-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formMode === "add" ? "Add New Event" : "Edit Event"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the event below
            </DialogDescription>
          </DialogHeader>
          
          {statusMessage.type && (
            <div className={`p-3 mb-4 rounded-md ${
              statusMessage.type === 'success' 
                ? 'bg-green-900/30 border border-green-800 text-green-200' 
                : statusMessage.type === 'error'
                ? 'bg-red-900/30 border border-red-800 text-red-200'
                : 'bg-blue-900/30 border border-blue-800 text-blue-200'
            }`}>
              <p className="text-sm">{statusMessage.text}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  className="bg-blue-900/20 border-blue-800"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger className="bg-blue-900/20 border-blue-800">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-950 border-blue-800">
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Symposium">Symposium</SelectItem>
                    <SelectItem value="Talk">Talk</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Celebration">Celebration</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Industrial Visit">Industrial Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the event"
                  className="bg-blue-900/20 border-blue-800 min-h-[100px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="e.g., October 15, 2023"
                  className="bg-blue-900/20 border-blue-800"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  className="bg-blue-900/20 border-blue-800"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Event venue"
                  className="bg-blue-900/20 border-blue-800"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Event Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {previewImage ? (
                      <div className="relative aspect-video rounded-md overflow-hidden border border-blue-800 bg-blue-900/20">
                        <Image 
                          src={previewImage} 
                          alt="Image preview" 
                          fill 
                          className="object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={clearImagePreview}
                          className="absolute top-2 right-2 h-8 w-8 bg-red-600/80 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        {uploadStatus === 'error' && (
                          <div className="absolute bottom-0 left-0 right-0 bg-red-900/80 p-2 text-center">
                            <p className="text-white text-xs mb-1">Upload failed</p>
                            <Button 
                              size="sm"
                              variant="secondary"
                              className="bg-white text-red-900 hover:bg-gray-200 text-xs py-0 h-6"
                              onClick={() => handleFileChange({ target: { files: fileInputRef.current?.files } } as any)}
                            >
                              Retry
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="relative aspect-video rounded-md overflow-hidden border border-blue-800 bg-blue-900/20">
                          <Image
                            src={formData.image}
                            alt="Event image"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=200&width=400"
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2 flex flex-col">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="image">Image Path</Label>
                      <Input
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="Image path"
                        className="bg-blue-900/20 border-blue-800"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 mt-auto">
                      <p className="text-xs text-gray-400">Upload a new image or select from existing</p>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploadStatus === 'uploading'}
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            className="border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2 w-full"
                            disabled={uploadStatus === 'uploading'}
                          >
                            {uploadStatus === 'uploading' ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Upload
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setImageDialogOpen(true)}
                          className="border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2"
                          disabled={uploadStatus === 'uploading'}
                        >
                          <ImageIcon size={16} />
                          Browse
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attendees">Expected Attendees</Label>
                <Input
                  id="attendees"
                  name="attendees"
                  type="number"
                  value={formData.attendees || 0}
                  onChange={handleInputChange}
                  placeholder="Number of expected attendees"
                  className="bg-blue-900/20 border-blue-800"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={formData.featured}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("featured", checked === true)
                  }
                />
                <Label htmlFor="featured">Featured Event</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="registration" 
                  checked={formData.registration}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("registration", checked === true)
                  }
                />
                <Label htmlFor="registration">Requires Registration</Label>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="registrationLink">Registration Link</Label>
                  <Input
                    id="registrationLink"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleInputChange}
                    placeholder="Enter registration link (URL)"
                  />
                </div>
                <div>
                  <Label htmlFor="detailsLink">Details Link</Label>
                  <Input
                    id="detailsLink"
                    name="detailsLink"
                    value={formData.detailsLink}
                    onChange={handleInputChange}
                    placeholder="Enter details link (URL)"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancelForm}
                className="border-gray-600 text-gray-300 hover:bg-blue-900/30"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
              >
                {formMode === "add" ? "Add Event" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Image Browser Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="bg-blue-950 border-blue-800 text-white max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Event Image</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose an image from the existing event images
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant={imageDirectory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setImageDirectory('all')}
              className={imageDirectory === 'all' ? 'bg-blue-600' : 'border-blue-500 text-blue-400'}
            >
              All Images
            </Button>
            <Button 
              variant={imageDirectory === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setImageDirectory('upcoming')}
              className={imageDirectory === 'upcoming' ? 'bg-blue-600' : 'border-blue-500 text-blue-400'}
            >
              Upcoming Events
            </Button>
            <Button 
              variant={imageDirectory === 'events' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setImageDirectory('events')}
              className={imageDirectory === 'events' ? 'bg-blue-600' : 'border-blue-500 text-blue-400'}
            >
              Past Events
            </Button>
          </div>
          
          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableImages.length > 0 ? (
                availableImages
                  .filter(imagePath => {
                    if (imageDirectory === 'all') return true
                    return imagePath.startsWith(`/${imageDirectory}/`)
                  })
                  .map((imagePath, index) => (
                    <div 
                      key={index} 
                      className="cursor-pointer group relative aspect-video border border-blue-800 rounded-md overflow-hidden hover:border-blue-500 transition-all"
                      onClick={() => handleImageSelect(imagePath)}
                    >
                      <Image
                        src={imagePath}
                        alt={`Event image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=100&width=200"
                        }}
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-blue-900/60 flex items-center justify-center transition-opacity">
                        <Button variant="outline" size="sm" className="text-white border-white/70 bg-transparent hover:bg-blue-800/50">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-4 text-center py-8 text-gray-400">
                  No images available
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="border-t border-blue-800/50 pt-4 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setImageDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-blue-900/30"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-blue-950 border-blue-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-blue-900/30">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvent}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  )
} 