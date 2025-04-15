"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Save, 
  AlertTriangle, 
  PlusCircle, 
  MinusCircle, 
  ArrowLeft,
  Loader2,
  CheckCircle
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
          <Link href="/admin/chapters">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ArrowLeft size={16} />
              Back to Chapters
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
import type { Chapter, ChapterEvent, ChapterProject, ChapterMember } from "@/app/lib/types"

type EditChapterProps = {
  params: {
    id: string
  }
}

export default function EditChapter({ params }: EditChapterProps) {
  const chapterId = params.id
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Chapter data
  const [id, setId] = useState(chapterId)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [projects, setProjects] = useState<ChapterProject[]>([])
  const [events, setEvents] = useState<ChapterEvent[]>([])
  const [team, setTeam] = useState<ChapterMember[]>([])

  // Authentication check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    if (!isLoggedIn) {
      window.location.href = "/admin"
    }
  }, [router])

  // Load chapter data
  useEffect(() => {
    fetchChapter()
  }, [chapterId])

  const fetchChapter = async () => {
    try {
      setLoading(true)
      
      // For new chapter
      if (chapterId === 'new') {
        setId(generateUniqueId())
        setName("")
        setDescription("")
        setProjects([{ title: "", description: "" }])
        setEvents([{ title: "", date: "", description: "" }])
        setTeam([{ name: "", role: "", image: "" }])
        setLoading(false)
        return
      }
      
      const response = await fetch(`/api/chapters/${chapterId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Chapter not found")
        } else {
          throw new Error('Failed to fetch chapter')
        }
        setLoading(false)
        return
      }
      
      const chapter = await response.json()
      
      setId(chapter.id)
      setName(chapter.name)
      setDescription(chapter.description)
      setProjects(chapter.projects && chapter.projects.length > 0 
        ? chapter.projects 
        : [{ title: "", description: "" }])
      setEvents(chapter.events && chapter.events.length > 0 
        ? chapter.events 
        : [{ title: "", date: "", description: "" }])
      setTeam(chapter.team && chapter.team.length > 0 
        ? chapter.team 
        : [{ name: "", role: "", image: "" }])
    } catch (error) {
      console.error("Error loading chapter:", error)
      setError("Failed to load chapter data")
    } finally {
      setLoading(false)
    }
  }

  // Generate a unique ID for new chapters
  const generateUniqueId = () => {
    return `chapter_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  }

  // Form validation
  const validateForm = () => {
    if (!name) {
      setError("Chapter name is required")
      return false
    }
    
    if (!description) {
      setError("Chapter description is required")
      return false
    }
    
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError("")
    
    if (!validateForm()) {
      return
    }
    
    try {
      setSubmitting(true)
      
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
      
      // Create chapter object
      const chapterData: Chapter = {
        id,
        name,
        description,
        projects: filteredProjects,
        events: filteredEvents,
        team: filteredTeam
      }
      
      // Determine if we're adding a new chapter or updating an existing one
      const isNewChapter = chapterId === 'new'
      const url = isNewChapter 
        ? '/api/chapters' 
        : `/api/chapters/${id}`
      const method = isNewChapter ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chapterData)
      })
      
      if (!response.ok) {
        throw new Error(isNewChapter ? 'Failed to create chapter' : 'Failed to update chapter')
      }
      
      // If it's a new chapter, redirect to the edit page for the new ID
      if (isNewChapter) {
        const responseData = await response.json()
        router.push(`/admin/chapters/${responseData.id}`)
      }
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving chapter:", error)
      setError("Failed to save chapter")
    } finally {
      setSubmitting(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <AdminNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {chapterId === 'new' ? 'Add New Chapter' : 'Edit Chapter'}
            </h1>
            <Link href="/admin/chapters">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Chapters
              </Button>
            </Link>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 size={24} className="animate-spin text-blue-500" />
              <span>Loading chapter data...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {chapterId === 'new' ? 'Add New Chapter' : 'Edit Chapter'}
          </h1>
          <Link href="/admin/chapters">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Chapters
            </Button>
          </Link>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Chapter saved successfully</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Chapter Name*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-32"
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="team" className="w-full">
            <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="team">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Team Members</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addTeamMember}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <PlusCircle size={16} />
                    Add Member
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {team.map((member, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-md font-medium">Team Member {index + 1}</h3>
                        {team.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <MinusCircle size={16} />
                            <span className="ml-1">Remove</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`member-name-${index}`}>Name*</Label>
                          <Input
                            id={`member-name-${index}`}
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`member-role-${index}`}>Role*</Label>
                          <Input
                            id={`member-role-${index}`}
                            value={member.role}
                            onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor={`member-image-${index}`}>Image URL (optional)</Label>
                          <Input
                            id={`member-image-${index}`}
                            value={member.image}
                            onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                            className="mt-1"
                            placeholder="/path/to/image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Projects</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addProject}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <PlusCircle size={16} />
                    Add Project
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-md font-medium">Project {index + 1}</h3>
                        {projects.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeProject(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <MinusCircle size={16} />
                            <span className="ml-1">Remove</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`project-title-${index}`}>Title*</Label>
                          <Input
                            id={`project-title-${index}`}
                            value={project.title}
                            onChange={(e) => updateProject(index, 'title', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`project-description-${index}`}>Description*</Label>
                          <Textarea
                            id={`project-description-${index}`}
                            value={project.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Events</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addEvent}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <PlusCircle size={16} />
                    Add Event
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {events.map((event, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-md font-medium">Event {index + 1}</h3>
                        {events.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeEvent(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <MinusCircle size={16} />
                            <span className="ml-1">Remove</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`event-title-${index}`}>Title*</Label>
                          <Input
                            id={`event-title-${index}`}
                            value={event.title}
                            onChange={(e) => updateEvent(index, 'title', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`event-date-${index}`}>Date*</Label>
                          <Input
                            id={`event-date-${index}`}
                            value={event.date}
                            onChange={(e) => updateEvent(index, 'date', e.target.value)}
                            className="mt-1"
                            placeholder="e.g. March 15, 2025"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor={`event-description-${index}`}>Description*</Label>
                          <Textarea
                            id={`event-description-${index}`}
                            value={event.description}
                            onChange={(e) => updateEvent(index, 'description', e.target.value)}
                            className="mt-1"
                          />
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
              className="flex items-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Chapter
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 