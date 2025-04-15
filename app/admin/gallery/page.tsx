"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  X,
  Edit,
  Trash2,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Bookmark,
  Camera,
  Tag,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuthCheck from "@/components/auth-check"

// Categories for filtering
const categories = [
  "Events",
  "Workshops",
  "Celebrations",
  "Industrial Visits",
  "Exhibitions",
  "Competitions",
]

export default function GalleryAdmin() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<any>(null)
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info" | null; text: string }>({
    type: null,
    text: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    title: "",
    category: "Events",
    date: "",
    location: "",
    description: "",
    images: [] as string[],
    thumbnail: "",
  })

  // Store image preview URL mappings
  const [previewMap, setPreviewMap] = useState<Record<string, string>>({});
  
  // Server images fetched from the file system
  const [serverImages, setServerImages] = useState<string[]>([]);

  // Function to get the image source with proper error handling
  const getImageSrc = (imagePath: string) => {
    if (!imagePath) {
      return "/placeholder.svg?height=100&width=150";
    }
    
    // First check our preview map for recently uploaded images
    if (previewMap[imagePath]) {
      return previewMap[imagePath];
    }
    
    // If it starts with /gallery/, it's a server path and we can use it directly
    if (imagePath.startsWith('/gallery/')) {
      return imagePath;
    }
    
    // Fallback to placeholder
    return "/placeholder.svg?height=100&width=150";
  }

  useEffect(() => {
    setIsClient(true)
    
    // Fetch gallery items from API
    const fetchGalleryItems = async () => {
      try {
        setStatusMessage({ type: "info", text: "Loading gallery items..." });
        const response = await fetch('/api/gallery');
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setGalleryItems(data);
        } else {
          // If API returns empty array, initialize with default item
          const sampleGalleryItems = [
            {
              id: "1",
              title: "IEEE Day Celebration",
              category: "Events",
              date: "October 1, 2023",
              location: "PESCE Campus",
              description: "Annual IEEE Day celebration with technical activities, games, and networking.",
              images: ["/placeholder.svg?height=600&width=800&text=IEEE+Day"],
              thumbnail: "/placeholder.svg?height=600&width=800&text=IEEE+Day"
            }
          ];
          setGalleryItems(sampleGalleryItems);
          
          // Add default item to API
          await fetch('/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(sampleGalleryItems[0])
          });
        }
        
        setStatusMessage({ type: null, text: "" });
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setStatusMessage({ type: "error", text: "Failed to load gallery items" });
        
        // Use default items on error
        const sampleGalleryItems = [
          {
            id: "1",
            title: "IEEE Day Celebration",
            category: "Events",
            date: "October 1, 2023",
            location: "PESCE Campus",
            description: "Annual IEEE Day celebration with technical activities, games, and networking.",
            images: ["/placeholder.svg?height=600&width=800&text=IEEE+Day"],
            thumbnail: "/placeholder.svg?height=600&width=800&text=IEEE+Day"
          }
        ];
        setGalleryItems(sampleGalleryItems);
      }
    };
    
    fetchGalleryItems();

    // Fetch gallery images from server
    const fetchServerImages = async () => {
      try {
        const response = await fetch('/api/images/gallery');
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const data = await response.json();
        
        if (data.images && Array.isArray(data.images)) {
          setServerImages(data.images);
          // Also update available images with server images
          setAvailableImages(data.images);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };
    
    fetchServerImages();
  }, [router])

  const handleGoBack = () => {
    router.push("/admin/dashboard")
  }

  const openAddGalleryForm = () => {
    setFormMode("add")
    setFormData({
      id: Date.now().toString(),
      title: "",
      category: "Events",
      date: "",
      location: "",
      description: "",
      images: [],
      thumbnail: "",
    })
    setPreviewImages([])
    setSelectedImages([])
    setFormDialogOpen(true)
    setStatusMessage({ type: null, text: "" })
  }

  const openEditGalleryForm = (item: any) => {
    setFormMode("edit")
    setFormData({
      id: item.id,
      title: item.title,
      category: item.category,
      date: item.date,
      location: item.location,
      description: item.description,
      images: item.images || [],
      thumbnail: item.thumbnail || item.images[0] || "",
    })
    setSelectedImages(item.images || [])
    setPreviewImages([])
    setFormDialogOpen(true)
    setStatusMessage({ type: null, text: "" })
  }

  const handleDeleteGallery = (item: any) => {
    setSelectedItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteGallery = async () => {
    if (selectedItemToDelete) {
      try {
        setStatusMessage({ type: "info", text: "Deleting gallery item..." });
        
        // Remove from local state first for immediate feedback
        const updatedItems = galleryItems.filter((item) => item.id !== selectedItemToDelete.id);
        setGalleryItems(updatedItems);
        
        // Call API to delete
        const response = await fetch(`/api/gallery/${selectedItemToDelete.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete gallery item');
        }
        
        // Close the dialog
        setDeleteDialogOpen(false);
        setSelectedItemToDelete(null);
        
        // Show success message
        setStatusMessage({ type: "success", text: "Gallery item deleted successfully" });
        
        // Clear status message after delay
        setTimeout(() => {
          setStatusMessage({ type: null, text: "" });
        }, 3000);
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        
        // Revert the state change if the API call failed
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setGalleryItems(data);
        }
        
        setStatusMessage({ type: "error", text: "Failed to delete gallery item. Please try again." });
      }
    }
  };

  const handleCancelForm = () => {
    setFormDialogOpen(false)
    setPreviewImages([])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.category) {
      setStatusMessage({ type: "error", text: "Title and category are required" });
      return;
    }

    // Validate that at least one image is selected
    if (selectedImages.length === 0) {
      setStatusMessage({ type: "error", text: "Please select at least one image for the gallery item" });
      return;
    }

    const newFormData = {
      ...formData,
      images: selectedImages,
      // Use first image as thumbnail if none selected
      thumbnail: formData.thumbnail || (selectedImages.length > 0 ? selectedImages[0] : "")
    };

    try {
      setStatusMessage({ type: "info", text: `${formMode === "add" ? "Adding" : "Updating"} gallery item...` });
      
      let apiUrl = '/api/gallery';
      let method = 'POST';
      
      if (formMode === "edit") {
        apiUrl = `/api/gallery/${formData.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFormData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${formMode === "add" ? "add" : "update"} gallery item`);
      }
      
      const savedItem = await response.json();
      
      if (formMode === "add") {
        // Add to local state
        setGalleryItems([...galleryItems, savedItem]);
        setStatusMessage({ type: "success", text: "Gallery item added successfully" });
      } else {
        // Find and update the item
        const updatedItems = galleryItems.map((item) =>
          item.id === formData.id ? savedItem : item
        );
        
        setGalleryItems(updatedItems);
        setStatusMessage({ type: "success", text: "Gallery item updated successfully" });
      }
      
      // Clear status message after delay
      setTimeout(() => {
        setStatusMessage({ type: null, text: "" });
      }, 3000);
      
      // Close the form dialog
      setFormDialogOpen(false);
    } catch (error) {
      console.error(`Error ${formMode === "add" ? "adding" : "updating"} gallery item:`, error);
      setStatusMessage({ 
        type: "error", 
        text: `Failed to ${formMode === "add" ? "add" : "update"} gallery item. Please try again.` 
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadStatus("uploading")
    
    // Process files one by one
    const processFiles = async () => {
      try {
        const newPreviewImages: string[] = []
        const uploadedPaths: string[] = []
        const newPreviewMap = { ...previewMap }
        
        // Process each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          
          // Create a preview URL for immediate display
          const previewUrl = URL.createObjectURL(file)
          newPreviewImages.push(previewUrl)
          
          // Upload file to server
          const uploadFormData = new FormData()
          uploadFormData.append('file', file)
          uploadFormData.append('category', formData.category)
          
          const response = await fetch('/api/upload/gallery', {
            method: 'POST',
            body: uploadFormData
          })
          
          if (!response.ok) {
            throw new Error('Failed to upload image to server')
          }
          
          const result = await response.json()
          const serverPath = result.path
          uploadedPaths.push(serverPath)
          
          // Store the mapping between serverPath and previewUrl
          newPreviewMap[serverPath] = previewUrl
        }
        
        // Add preview images
        setPreviewImages([...previewImages, ...newPreviewImages])
        
        // Update preview map
        setPreviewMap(newPreviewMap)
        
        // Add to available images
        const updatedAvailableImages = [...availableImages, ...uploadedPaths]
        setAvailableImages(updatedAvailableImages)
        
        // Add to selected images for this form
        setSelectedImages([...selectedImages, ...uploadedPaths])
        
        // If this is the first image, set it as thumbnail
        if (!formData.thumbnail && uploadedPaths.length > 0) {
          setFormData(prev => ({
            ...prev,
            thumbnail: uploadedPaths[0]
          }))
        }
        
        setUploadStatus("success")
        setStatusMessage({
          type: "success",
          text: `${uploadedPaths.length} image${uploadedPaths.length > 1 ? 's' : ''} uploaded successfully!`,
        })
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        
        // Auto-clear success message
        setTimeout(() => {
          setStatusMessage({ type: null, text: "" })
        }, 3000)
      } catch (error) {
        console.error("Error handling file:", error)
        setUploadStatus("error")
        setStatusMessage({
          type: "error",
          text: "Failed to upload images. Please try again.",
        })
      }
    }
    
    processFiles()
  }
  
  // Helper function to convert File to base64 string
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const clearImagePreview = (index: number) => {
    const updatedPreviews = [...previewImages]
    updatedPreviews.splice(index, 1)
    setPreviewImages(updatedPreviews)
  }

  const handleImageSelect = (imagePath: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imagePath)) {
        // If this is the thumbnail, reset the thumbnail
        if (formData.thumbnail === imagePath) {
          setFormData(prev => ({ ...prev, thumbnail: "" }));
        }
        return prev.filter(img => img !== imagePath);
      } else {
        // If this is the first image, set it as thumbnail by default
        if (prev.length === 0) {
          setFormData(prev => ({ ...prev, thumbnail: imagePath }));
        }
        return [...prev, imagePath];
      }
    });
  };

  const setAsThumbnail = (imagePath: string) => {
    if (selectedImages.includes(imagePath)) {
      setFormData(prev => ({ ...prev, thumbnail: imagePath }));
    }
  };

  const handleRemoveImage = (imagePath: string) => {
    setSelectedImages(selectedImages.filter(img => img !== imagePath))
    
    // If this was the thumbnail, reset it
    if (formData.thumbnail === imagePath) {
      setFormData(prev => ({
        ...prev,
        thumbnail: selectedImages.length > 0 ? selectedImages[0] : ""
      }))
    }
  }

  if (!isClient) {
    return null // Prevents hydration errors
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Gallery Management
            </h1>
          </div>
          
          {statusMessage.type && (
            <div className={`p-3 mb-6 rounded-md ${
              statusMessage.type === 'success' 
                ? 'bg-green-900/30 border border-green-800 text-green-200' 
                : statusMessage.type === 'error'
                ? 'bg-red-900/30 border border-red-800 text-red-200'
                : 'bg-blue-900/30 border border-blue-800 text-blue-200'
            }`}>
              <p>{statusMessage.text}</p>
            </div>
          )}
          
          <div className="mb-6">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              onClick={openAddGalleryForm}
            >
              <Plus size={16} />
              Add New Gallery Item
            </Button>
          </div>
          
          <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 mb-8">
            <div className="overflow-x-auto">
              <Table className="border-collapse w-full">
                <TableHeader>
                  <TableRow className="bg-blue-950/30">
                    <TableHead className="w-[50px]">Thumbnail</TableHead>
                    <TableHead className="w-1/4">Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Images Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {galleryItems.length > 0 ? (
                    galleryItems.map((item) => (
                      <TableRow key={item.id} className="border-b border-blue-900/30">
                        <TableCell>
                          <div className="relative h-10 w-10 rounded overflow-hidden">
                            <Image
                              src={getImageSrc(item.thumbnail || item.images[0] || "/placeholder.svg?height=40&width=40")}
                              alt={item.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=40&width=40"
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.images?.length || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditGalleryForm(item)}
                              className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-950/50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteGallery(item)}
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-400">
                        No gallery items found. Add your first gallery item!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        {/* Form Dialog */}
        <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
          <DialogContent className="bg-blue-950 border-blue-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{formMode === "add" ? "Add New Gallery Item" : "Edit Gallery Item"}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the details of the gallery item below
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
            
            <form onSubmit={handleSubmitGallery} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
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
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Main Auditorium, PESCE"
                    className="bg-blue-900/20 border-blue-800"
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Event description"
                    className="bg-blue-900/20 border-blue-800 min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Gallery Images</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={uploadStatus === 'uploading'}
                        />
                        <Button
                          type="button" 
                          variant="outline"
                          className="border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2"
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
                              Upload Images
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
                        Browse Images
                      </Button>
                    </div>
                  </div>

                  {/* Preview of new uploads */}
                  {previewImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Uploaded Images:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {previewImages.map((previewUrl, index) => (
                          <div key={`preview-${index}`} className="relative aspect-video border border-blue-800 rounded-md overflow-hidden">
                            <Image 
                              src={previewUrl} 
                              alt={`Preview ${index + 1}`} 
                              fill 
                              className="object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => clearImagePreview(index)}
                              className="absolute top-1 right-1 h-6 w-6 bg-red-600/80 hover:bg-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Currently selected images */}
                  {selectedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Selected Images:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {selectedImages.map((imagePath, index) => (
                          <div 
                            key={`selected-${index}`} 
                            className={`relative aspect-video border rounded-md overflow-hidden ${
                              formData.thumbnail === imagePath 
                                ? 'border-blue-400 ring-2 ring-blue-400/50' 
                                : 'border-blue-800'
                            }`}
                          >
                            <Image 
                              src={getImageSrc(imagePath)} 
                              alt={`Selected ${index + 1}`} 
                              fill 
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=100&width=150"
                              }}
                            />
                            <div className="absolute top-1 right-1 flex gap-1">
                              {formData.thumbnail !== imagePath && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setAsThumbnail(imagePath)}
                                  className="h-6 w-6 bg-blue-800/80 hover:bg-blue-700 border-transparent"
                                  title="Set as thumbnail"
                                >
                                  <Bookmark className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemoveImage(imagePath)}
                                className="h-6 w-6 bg-red-600/80 hover:bg-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            {formData.thumbnail === imagePath && (
                              <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-sm">
                                Thumbnail
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedImages.length === 0 && (
                    <div className="bg-blue-900/20 border border-blue-800 rounded-md p-4 text-center">
                      <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400">No images selected. Upload or select images for this gallery item.</p>
                    </div>
                  )}
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
                  {formMode === "add" ? "Add Gallery Item" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Image Browser Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="bg-blue-950 border-blue-800 text-white max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Select Gallery Images</DialogTitle>
              <DialogDescription className="text-gray-400">
                Choose images from server or uploaded images
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto flex-1 pr-2 -mr-2">
              <div className="mt-6">
                {serverImages.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mb-2">Server Images</h3>
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
                      {serverImages.map((imagePath, index) => (
                        <div key={index} className="relative group">
                          <div className={`relative overflow-hidden rounded-md border-2 ${selectedImages.includes(imagePath) ? 'border-blue-500' : 'border-gray-300'} ${formData.thumbnail === imagePath ? 'ring-2 ring-yellow-500' : ''}`}>
                            <Image
                              src={imagePath}
                              alt={`Gallery image ${index + 1}`}
                              width={150}
                              height={150}
                              className="object-cover w-full h-28 cursor-pointer"
                              onClick={() => handleImageSelect(imagePath)}
                            />
                            {formData.thumbnail === imagePath && (
                              <div className="absolute top-1 right-1 bg-yellow-500 text-white rounded-full p-1">
                                <Star className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          {selectedImages.includes(imagePath) && (
                            <div className="absolute top-1 left-1 flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setAsThumbnail(imagePath)}
                                className="h-6 w-6 bg-yellow-500/80 hover:bg-yellow-400 border-transparent"
                                title="Set as thumbnail"
                              >
                                <Star className="h-3 w-3 text-white" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {availableImages.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mb-2 mt-4">Uploaded Images</h3>
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
                      {availableImages.map((imagePath, index) => (
                        <div key={index} className="relative group">
                          <div className={`relative overflow-hidden rounded-md border-2 ${selectedImages.includes(imagePath) ? 'border-blue-500' : 'border-gray-300'} ${formData.thumbnail === imagePath ? 'ring-2 ring-yellow-500' : ''}`}>
                            <Image
                              src={getImageSrc(imagePath)}
                              alt={`Uploaded image ${index + 1}`}
                              width={150}
                              height={150}
                              className="object-cover w-full h-28 cursor-pointer"
                              onClick={() => handleImageSelect(imagePath)}
                            />
                            {formData.thumbnail === imagePath && (
                              <div className="absolute top-1 right-1 bg-yellow-500 text-white rounded-full p-1">
                                <Star className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          {selectedImages.includes(imagePath) && (
                            <div className="absolute top-1 left-1 flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setAsThumbnail(imagePath)}
                                className="h-6 w-6 bg-yellow-500/80 hover:bg-yellow-400 border-transparent"
                                title="Set as thumbnail"
                              >
                                <Star className="h-3 w-3 text-white" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {serverImages.length === 0 && availableImages.length === 0 && (
                  <div className="flex flex-col items-center justify-center mt-4">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                    <p className="text-gray-500 mt-2">No images available. Upload images first.</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="border-t border-blue-800/50 pt-4 mt-4">
              <Button 
                type="button" 
                onClick={() => setImageDialogOpen(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-blue-950 border-blue-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This will permanently delete the gallery item "{selectedItemToDelete?.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-blue-900/30 hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteGallery}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Footer />
      </div>
    </AuthCheck>
  )
} 