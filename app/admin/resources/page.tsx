"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { BookOpen, FileText, Video, Download, ExternalLink, Search, Edit, Trash2, Plus, ChevronLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Resource } from "@/app/lib/resourcesUtils"

// Resource types and categories (same as in the resources page)
const resourceTypes = ["Research", "Networking", "Career", "Education", "Technical", "Mobile", "Magazine"]
const categories = ["Academic", "Career", "Learning", "Technical", "Tools", "News"]

// Map icon strings to actual components
const iconMap = {
  BookOpen: <BookOpen className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  Video: <Video className="h-5 w-5" />,
  Download: <Download className="h-5 w-5" />,
  ExternalLink: <ExternalLink className="h-5 w-5" />,
  Search: <Search className="h-5 w-5" />,
}

export default function ResourcesAdmin() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [resources, setResources] = useState<Resource[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form fields
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [icon, setIcon] = useState("BookOpen")
  const [featured, setFeatured] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    // Load resources from API
    fetchResources()
  }, [router])

  // Function to fetch resources from API
  const fetchResources = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/resources')
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      
      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
      showStatusMessage('error', 'Failed to load resources')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to show status messages
  const showStatusMessage = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text })
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const handleAddResource = () => {
    resetForm()
    setEditingResource(null)
    setIsDialogOpen(true)
  }

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource)
    setTitle(resource.title)
    setType(resource.type)
    setCategory(resource.category)
    setDescription(resource.description || '')
    setLink(resource.link)
    setIcon(resource.icon || 'BookOpen')
    setFeatured(resource.featured || false)
    setIsDialogOpen(true)
  }

  const handleDeleteResource = async (id: string) => {
    try {
      setIsDeleting(id)
      const response = await fetch(`/api/resources?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete resource')
      }
      
      // Remove from local state
      setResources(resources.filter(resource => resource.id !== id))
      showStatusMessage('success', 'Resource deleted successfully')
    } catch (error) {
      console.error('Error deleting resource:', error)
      showStatusMessage('error', 'Failed to delete resource')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!title || !type || !category || !link) {
        showStatusMessage('error', 'Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      const resourceData = {
        title,
        type,
        category,
        description,
        link,
        icon,
        featured
      }

      if (editingResource) {
        // Update existing resource
        const response = await fetch('/api/resources', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: editingResource.id,
            ...resourceData
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to update resource')
        }
        
        const updatedResource = await response.json()
        
        // Update in local state
        setResources(resources.map(resource => 
          resource.id === editingResource.id ? updatedResource : resource
        ))
        
        showStatusMessage('success', 'Resource updated successfully')
      } else {
        // Add new resource
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resourceData)
        })
        
        if (!response.ok) {
          throw new Error('Failed to add resource')
        }
        
        const newResource = await response.json()
        
        // Add to local state
        setResources([...resources, newResource])
        
        showStatusMessage('success', 'Resource added successfully')
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving resource:', error)
      showStatusMessage('error', 'Failed to save resource')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setType("")
    setCategory("")
    setDescription("")
    setLink("")
    setIcon("BookOpen")
    setFeatured(false)
  }

  const goBack = () => {
    router.push("/admin/dashboard")
  }

  if (!isClient) {
    return null // Prevents hydration errors
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-20">
        <Button
          variant="ghost"
          onClick={goBack}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 mb-6 flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Manage Resources
          </h1>

          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            onClick={handleAddResource}
          >
            <Plus size={16} />
            Add Resource
          </Button>
        </div>

        {statusMessage && (
          <Alert 
            className={`mb-6 ${
              statusMessage.type === 'success' 
                ? 'bg-green-900/30 border-green-800 text-green-200' 
                : 'bg-red-900/30 border-red-800 text-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{statusMessage.text}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mr-2" />
            <span>Loading resources...</span>
          </div>
        ) : (
          <div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="categories">By Category</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <Card className="bg-blue-950/20 border border-blue-900/50">
                  <CardHeader>
                    <CardTitle>All Resources</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage all resources available to IEEE PESCE members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-blue-950/50 border-blue-900/50">
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resources.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                              No resources found. Add your first resource!
                            </TableCell>
                          </TableRow>
                        ) : (
                          resources.map((resource) => (
                            <TableRow key={resource.id} className="hover:bg-blue-950/50 border-blue-900/50">
                              <TableCell className="font-mono">{resource.id.toString().slice(0, 6)}</TableCell>
                              <TableCell className="font-medium">{resource.title}</TableCell>
                              <TableCell>{resource.type}</TableCell>
                              <TableCell>{resource.category}</TableCell>
                              <TableCell>{resource.featured ? "Yes" : "No"}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditResource(resource)}
                                  className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                                >
                                  <Edit size={16} />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteResource(resource.id)}
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                  disabled={isDeleting === resource.id}
                                >
                                  {isDeleting === resource.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="featured">
                <Card className="bg-blue-950/20 border border-blue-900/50">
                  <CardHeader>
                    <CardTitle>Featured Resources</CardTitle>
                    <CardDescription className="text-gray-400">
                      These resources are highlighted on the resources page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-blue-950/50 border-blue-900/50">
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resources.filter(r => r.featured).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                              No featured resources found. Edit a resource to make it featured.
                            </TableCell>
                          </TableRow>
                        ) : (
                          resources.filter(r => r.featured).map((resource) => (
                            <TableRow key={resource.id} className="hover:bg-blue-950/50 border-blue-900/50">
                              <TableCell className="font-mono">{resource.id.toString().slice(0, 6)}</TableCell>
                              <TableCell className="font-medium">{resource.title}</TableCell>
                              <TableCell>{resource.type}</TableCell>
                              <TableCell>{resource.category}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditResource(resource)}
                                  className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                                >
                                  <Edit size={16} />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteResource(resource.id)}
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                  disabled={isDeleting === resource.id}
                                >
                                  {isDeleting === resource.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="categories">
                {/* Tab content for categories */}
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-blue-950/50 border-blue-900/50 text-white">
            <DialogHeader>
              <DialogTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingResource 
                  ? "Update the details of this resource." 
                  : "Add a new resource to the IEEE PESCE library."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-blue-900/20 border-blue-900/50 mt-1"
                    placeholder="Resource title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={type} onValueChange={(value) => setType(value)}>
                      <SelectTrigger className="bg-blue-900/20 border-blue-900/50 mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-950 border-blue-900/50">
                        {resourceTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(value) => setCategory(value)}>
                      <SelectTrigger className="bg-blue-900/20 border-blue-900/50 mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-950 border-blue-900/50">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-blue-900/20 border-blue-900/50 mt-1 min-h-[100px]"
                    placeholder="Resource description"
                  />
                </div>
                
                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="bg-blue-900/20 border-blue-900/50 mt-1"
                    placeholder="https://..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={icon} onValueChange={(value) => setIcon(value)}>
                      <SelectTrigger className="bg-blue-900/20 border-blue-900/50 mt-1">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-950 border-blue-900/50">
                        {Object.entries(iconMap).map(([name, icon]) => (
                          <SelectItem key={name} value={name}>
                            <div className="flex items-center space-x-2">
                              {icon}
                              <span>{name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center h-full pt-7">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={() => setFeatured(!featured)}
                        className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 bg-transparent focus:ring-blue-500"
                      />
                      <span>Featured Resource</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex space-x-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-transparent border-blue-900/50 hover:bg-blue-900/30"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  )
} 