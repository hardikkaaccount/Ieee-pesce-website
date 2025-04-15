"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, Filter, Plus, Search, Trash2, Upload, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { BlogPost, addBlogPost, deleteBlogPost, getBlogPosts, updateBlogPost } from "@/app/lib/blogUtils"

export default function AdminBlog() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [blogToEdit, setBlogToEdit] = useState<BlogPost | null>(null)
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState<Omit<BlogPost, "id">>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    authorRole: "",
    date: "",
    readTime: "",
    category: "Events",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    articleUrl: "",
    detailsLink: ""
  })
  
  // Status messages
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info' | null;
    text: string;
  }>({ type: null, text: '' })
  
  // Initialize data from server
  useEffect(() => {
    setIsClient(true)
    
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }
    
    // Load blogs from API
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setStatusMessage({
          type: 'error',
          text: 'Failed to load blog posts. Please try again.'
        });
      }
    };
    
    fetchBlogs();
    // Get list of available images
    fetchImages();
  }, [router])
  
  const fetchImages = async () => {
    try {
      // In a real app, this would be an API call to fetch image list
      // For this demo, we'll use a predefined list of image paths
      const blogImages = [
        "/placeholder.svg?height=400&width=600",
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
      ]
      setAvailableImages(blogImages)
    } catch (error) {
      console.error("Error fetching blog images:", error)
    }
  }
  
  const handleGoBack = () => {
    router.push("/admin/dashboard")
  }
  
  const openAddBlogForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      authorRole: "",
      date: "",
      readTime: "",
      category: "Events",
      image: "/placeholder.svg?height=400&width=600",
      featured: false,
      articleUrl: "",
      detailsLink: ""
    })
    setFormMode("add")
    setFormDialogOpen(true)
  }
  
  const openEditBlogForm = (blog: BlogPost) => {
    setBlogToEdit(blog)
    setFormData({ ...blog })
    setFormMode("edit")
    setFormDialogOpen(true)
  }
  
  const handleDeleteBlog = (blog: BlogPost) => {
    setBlogToDelete(blog)
    setDeleteDialogOpen(true)
  }
  
  const confirmDeleteBlog = async () => {
    if (!blogToDelete) return
    
    try {
      const response = await fetch(`/api/blogs/${blogToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }
      
      // Update local state after successful deletion
      setBlogPosts(blogPosts.filter(b => b.id !== blogToDelete.id));
      setStatusMessage({
        type: 'success',
        text: 'Blog post deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setStatusMessage({
        type: 'error',
        text: 'Failed to delete blog post. Please try again.'
      });
    } finally {
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
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
  
  const handleBrowseImages = () => {
    setImageDialogOpen(true)
  }
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadStatus('uploading')
    
    // Preview image
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    // In a real app, you would upload to a server here
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, we're just setting a local URL
      // In a real app, you would get the URL from your server response
      const fileName = `image-${Date.now()}.jpg`
      const imagePath = `/blog/${fileName}`
      
      setFormData(prev => ({ ...prev, image: imagePath }))
      setUploadStatus('success')
      setStatusMessage({
        type: 'success',
        text: 'Image uploaded successfully!'
      })
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
  
  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear status messages
    setStatusMessage({ type: null, text: '' })
    
    try {
      if (formMode === "add") {
        // Send request to add new blog post
        const response = await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add blog post');
        }
        
        const newBlog = await response.json();
        setBlogPosts([...blogPosts, newBlog]);
        
        setStatusMessage({
          type: 'success',
          text: 'Blog post added successfully!'
        });
      } else if (formMode === "edit" && blogToEdit) {
        // Send request to update blog post
        const response = await fetch(`/api/blogs/${blogToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update blog post');
        }
        
        const updatedBlog = await response.json();
        setBlogPosts(blogPosts.map(b => (b.id === blogToEdit.id ? updatedBlog : b)));
        
        setStatusMessage({
          type: 'success',
          text: 'Blog post updated successfully!'
        });
      }
      
      setFormDialogOpen(false);
      setBlogToEdit(null);
      setPreviewImage(null);
      setUploadStatus('idle');
    } catch (error) {
      console.error('Error saving blog post:', error);
      setStatusMessage({
        type: 'error',
        text: `Failed to save blog post: ${(error as Error).message}`
      });
    }
  }
  
  const handleCancelForm = () => {
    setFormDialogOpen(false)
    setBlogToEdit(null)
    setPreviewImage(null)
    setUploadStatus('idle')
    setStatusMessage({ type: null, text: '' })
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
            Blog Management
          </h1>
        </div>
        
        <div className="mb-6">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            onClick={openAddBlogForm}
          >
            <Plus size={16} />
            Add New Blog Post
          </Button>
        </div>
        
        <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 mb-8">
          <div className="overflow-x-auto">
            <Table className="border-collapse w-full">
              <TableHeader>
                <TableRow className="bg-blue-950/30">
                  <TableHead className="w-[50px]">Image</TableHead>
                  <TableHead className="w-1/4">Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Has Article URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((blog) => (
                  <TableRow key={blog.id} className="border-b border-blue-900/30">
                    <TableCell>
                      <div className="relative h-10 w-10 rounded overflow-hidden">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=40&width=40"
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>{blog.date}</TableCell>
                    <TableCell>{blog.category}</TableCell>
                    <TableCell>{blog.featured ? "Yes" : "No"}</TableCell>
                    <TableCell>{blog.articleUrl ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditBlogForm(blog)}
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-950/50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBlog(blog)}
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
        </div>
      </div>
      
      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="bg-blue-950 border-blue-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formMode === "add" ? "Add New Blog Post" : "Edit Blog Post"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the blog post below
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
          
          <form onSubmit={handleSubmitBlog} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Blog Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
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
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Workshops">Workshops</SelectItem>
                    <SelectItem value="Achievements">Achievements</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Announcements">Announcements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the blog post"
                  className="bg-blue-900/20 border-blue-800 min-h-[80px]"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Full blog content"
                  className="bg-blue-900/20 border-blue-800 min-h-[200px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  className="bg-blue-900/20 border-blue-800"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authorRole">Author Role</Label>
                <Input
                  id="authorRole"
                  name="authorRole"
                  value={formData.authorRole}
                  onChange={handleInputChange}
                  placeholder="Enter author role"
                  className="bg-blue-900/20 border-blue-800"
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
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 min read"
                  className="bg-blue-900/20 border-blue-800"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Blog Image</Label>
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
                              onClick={() => handleImageUpload({ target: { files: fileInputRef.current?.files } } as any)}
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
                            alt="Blog image"
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
                            onChange={handleImageUpload}
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
                          onClick={handleBrowseImages}
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
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={formData.featured}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("featured", checked === true)
                  }
                />
                <Label htmlFor="featured">Featured Blog Post</Label>
              </div>
              
              <div className="space-y-4 md:col-span-2">
                <div>
                  <Label htmlFor="articleUrl" className="flex items-center gap-2">
                    <LinkIcon size={14} className="text-blue-400"/>
                    Article URL (Google Drive or external link)
                  </Label>
                  <Input
                    id="articleUrl"
                    name="articleUrl"
                    value={formData.articleUrl}
                    onChange={handleInputChange}
                    placeholder="Enter Google Drive or external article URL"
                    className="bg-blue-900/20 border-blue-800"
                  />
                </div>
                <div>
                  <Label htmlFor="detailsLink" className="flex items-center gap-2">
                    <LinkIcon size={14} className="text-blue-400"/>
                    Details Page Link
                  </Label>
                  <Input
                    id="detailsLink"
                    name="detailsLink"
                    value={formData.detailsLink}
                    onChange={handleInputChange}
                    placeholder="Enter details page link (e.g., /blog/1)"
                    className="bg-blue-900/20 border-blue-800"
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
                {formMode === "add" ? "Add Blog Post" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Image Browser Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="bg-blue-950 border-blue-800 text-white max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Blog Image</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose an image from the existing images
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableImages.length > 0 ? (
                availableImages.map((imagePath, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer group relative aspect-video border border-blue-800 rounded-md overflow-hidden hover:border-blue-500 transition-all"
                    onClick={() => handleImageSelect(imagePath)}
                  >
                    <Image
                      src={imagePath}
                      alt={`Image ${index + 1}`}
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
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-blue-900/30">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBlog}
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