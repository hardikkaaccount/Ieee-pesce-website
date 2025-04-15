"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Save, 
  AlertTriangle, 
  PlusCircle, 
  MinusCircle, 
  ArrowLeft 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
// Try to import AdminNav, but have a fallback
let AdminNav: React.ComponentType<any>
try {
  AdminNav = require("@/components/admin-nav").default
} catch (e) {
  // Create a simple fallback for AdminNav
  AdminNav = () => (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
      <div className="container mx-auto px-4 flex justify-between">
        <Link href="/admin/dashboard" className="font-bold text-lg">IEEE PESCE Admin</Link>
        <div className="flex gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ArrowLeft size={16} />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
import { getSettings, saveSettings } from "@/app/lib/settings"
import type { Chapter, ChapterEvent, ChapterProject, ChapterMember } from "@/app/lib/types"

export default function NewChapter() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Chapter data
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  
  const [projects, setProjects] = useState<ChapterProject[]>([
    { title: "", description: "" }
  ])
  
  const [events, setEvents] = useState<ChapterEvent[]>([
    { title: "", date: "", description: "" }
  ])
  
  const [team, setTeam] = useState<ChapterMember[]>([
    { name: "", role: "", image: "" }
  ])

  // Authentication check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    if (!isLoggedIn) {
      window.location.href = "/admin"
    }
  }, [router])

  // Load settings safely
  const getSettingsSafely = () => {
    try {
      if (typeof window !== 'undefined') {
        return getSettings()
      }
      return { chapters: {} } // Default fallback
    } catch (error) {
      console.error("Error accessing settings:", error)
      return { chapters: {} } // Default fallback
    }
  }

  // Form validation
  const validateForm = () => {
    if (!id) {
      setError("Chapter ID is required")
      return false
    }
    
    if (!name) {
      setError("Chapter name is required")
      return false
    }
    
    if (!description) {
      setError("Chapter description is required")
      return false
    }
    
    // Check if ID already exists
    const settings = getSettingsSafely()
    if (settings.chapters && settings.chapters[id]) {
      setError(`Chapter ID "${id}" already exists`)
      return false
    }
    
    return true
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    setError("")
    
    if (!validateForm()) {
      return
    }
    
    try {
      // Filter out empty projects
      const filteredProjects = projects.filter(
        project => project.title.trim() !== "" && project.description.trim() !== ""
      )
      
      // Filter out empty events
      const filteredEvents = events.filter(
        event => event.title.trim() !== "" && event.date.trim() !== ""
      )
      
      // Filter out empty team members
      const filteredTeam = team.filter(
        member => member.name.trim() !== "" && member.role.trim() !== ""
      )
      
      // Create new chapter
      const newChapter: Chapter = {
        id,
        name,
        description,
        projects: filteredProjects,
        events: filteredEvents,
        team: filteredTeam
      }
      
      // Update settings
      const settings = getSettingsSafely()
      const updatedChapters = {
        ...settings.chapters,
        [id]: newChapter
      }
      
      const updatedSettings = {
        ...settings,
        chapters: updatedChapters
      }
      
      saveSettings(updatedSettings)
      
      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/admin/chapters"
      }, 1500)
    } catch (error) {
      console.error("Error creating chapter:", error)
      setError("Failed to create chapter")
    }
  }

  // Handle adding/removing dynamic fields
  const addProject = () => {
    setProjects([...projects, { title: "", description: "" }])
  }

  const removeProject = (index: number) => {
    if (projects.length > 1) {
      const updatedProjects = [...projects]
      updatedProjects.splice(index, 1)
      setProjects(updatedProjects)
    }
  }

  const updateProject = (index: number, field: keyof ChapterProject, value: string) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    setProjects(updatedProjects)
  }

  const addEvent = () => {
    setEvents([...events, { title: "", date: "", description: "" }])
  }

  const removeEvent = (index: number) => {
    if (events.length > 1) {
      const updatedEvents = [...events]
      updatedEvents.splice(index, 1)
      setEvents(updatedEvents)
    }
  }

  const updateEvent = (index: number, field: keyof ChapterEvent, value: string) => {
    const updatedEvents = [...events]
    updatedEvents[index] = { ...updatedEvents[index], [field]: value }
    setEvents(updatedEvents)
  }

  const addTeamMember = () => {
    setTeam([...team, { name: "", role: "", image: "" }])
  }

  const removeTeamMember = (index: number) => {
    if (team.length > 1) {
      const updatedTeam = [...team]
      updatedTeam.splice(index, 1)
      setTeam(updatedTeam)
    }
  }

  const updateTeamMember = (index: number, field: keyof ChapterMember, value: string) => {
    const updatedTeam = [...team]
    updatedTeam[index] = { ...updatedTeam[index], [field]: value }
    setTeam(updatedTeam)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/admin/chapters">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Chapter</h1>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-600 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            <AlertDescription>Chapter created successfully! Redirecting...</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="id">Chapter ID <span className="text-red-500">*</span></Label>
                      <Input
                        id="id"
                        value={id}
                        onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="e.g. wie, comsoc"
                        className="bg-white dark:bg-gray-800"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Unique identifier (lowercase letters, numbers, hyphens only)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Chapter Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Women in Engineering"
                        className="bg-white dark:bg-gray-800"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter chapter description"
                      className="min-h-32 bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Projects</CardTitle>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addProject}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle size={16} />
                    Add Project
                  </Button>
                </CardHeader>
                <CardContent>
                  {projects.map((project, index) => (
                    <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Project {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProject(index)}
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                          disabled={projects.length === 1}
                        >
                          <MinusCircle size={16} />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`project-title-${index}`}>Title</Label>
                          <Input
                            id={`project-title-${index}`}
                            value={project.title}
                            onChange={(e) => updateProject(index, "title", e.target.value)}
                            placeholder="Project title"
                            className="bg-white dark:bg-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`project-description-${index}`}>Description</Label>
                          <Textarea
                            id={`project-description-${index}`}
                            value={project.description}
                            onChange={(e) => updateProject(index, "description", e.target.value)}
                            placeholder="Project description"
                            className="min-h-20 bg-white dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {projects.length === 0 && (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      <p>No projects added yet.</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addProject}
                        className="mt-2"
                      >
                        Add Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Events</CardTitle>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addEvent}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle size={16} />
                    Add Event
                  </Button>
                </CardHeader>
                <CardContent>
                  {events.map((event, index) => (
                    <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Event {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEvent(index)}
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                          disabled={events.length === 1}
                        >
                          <MinusCircle size={16} />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`event-title-${index}`}>Title</Label>
                          <Input
                            id={`event-title-${index}`}
                            value={event.title}
                            onChange={(e) => updateEvent(index, "title", e.target.value)}
                            placeholder="Event title"
                            className="bg-white dark:bg-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-date-${index}`}>Date</Label>
                          <Input
                            id={`event-date-${index}`}
                            value={event.date}
                            onChange={(e) => updateEvent(index, "date", e.target.value)}
                            placeholder="e.g. March 15, 2025"
                            className="bg-white dark:bg-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`event-description-${index}`}>Description</Label>
                          <Textarea
                            id={`event-description-${index}`}
                            value={event.description}
                            onChange={(e) => updateEvent(index, "description", e.target.value)}
                            placeholder="Event description"
                            className="min-h-20 bg-white dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addTeamMember}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle size={16} />
                    Add Member
                  </Button>
                </CardHeader>
                <CardContent>
                  {team.map((member, index) => (
                    <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Member {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTeamMember(index)}
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                          disabled={team.length === 1}
                        >
                          <MinusCircle size={16} />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`member-name-${index}`}>Name</Label>
                          <Input
                            id={`member-name-${index}`}
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                            placeholder="Member name"
                            className="bg-white dark:bg-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`member-role-${index}`}>Role</Label>
                          <Input
                            id={`member-role-${index}`}
                            value={member.role}
                            onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                            placeholder="e.g. Chapter Chair"
                            className="bg-white dark:bg-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`member-image-${index}`}>Image Path</Label>
                          <Input
                            id={`member-image-${index}`}
                            value={member.image}
                            onChange={(e) => updateTeamMember(index, "image", e.target.value)}
                            placeholder="/bd303069-b25a-4d17-980a-a15bb1a0a547 - Member Name.jpg"
                            className="bg-white dark:bg-gray-700"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Enter the path to the image in the public folder
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              disabled={success}
            >
              <Save size={16} />
              Create Chapter
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 