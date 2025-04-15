"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronLeft, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { ContactInfo } from "@/app/lib/contactUtils"

// Default contact information
const defaultContactInfo: ContactInfo = {
  address: "PES College of Engineering, Mandya - Bangalore Road, Mandya, Karnataka 571401",
  email: "ieee.sbyp@gmail.com",
  phone: "+91 9742286934",
  mapLocation: {
    center: { lat: 12.5212, lng: 76.9049 },
    zoom: 16,
  },
  socialMedia: {
    instagram: "https://www.instagram.com/ieee_pesce",
    linkedin: "https://www.linkedin.com/company/ieee-pes-college-of-engineering",
    twitter: "https://twitter.com/ieee_pesce",
    facebook: "https://www.facebook.com/ieeepesce",
  },
}

export default function ContactAdmin() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    // Fetch contact info from API
    fetchContactInfo()
  }, [router])

  // Function to fetch contact info from API
  const fetchContactInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/contact')
      if (!response.ok) {
        throw new Error('Failed to fetch contact information')
      }
      const data = await response.json()
      setContactInfo(data)
    } catch (error) {
      console.error('Error fetching contact information:', error)
      toast.error('Failed to load contact information')
      // Use default if API fails
      setContactInfo(defaultContactInfo)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    section: string,
    field: string,
    value: string,
    nestedField?: string
  ) => {
    if (section === "general") {
      setContactInfo((prev) => ({
        ...prev,
        [field]: value,
      }))
    } else if (section === "mapLocation") {
      if (field === "center" && nestedField) {
        const numValue = parseFloat(value)
        if (!isNaN(numValue)) {
          setContactInfo((prev) => ({
            ...prev,
            mapLocation: {
              ...prev.mapLocation,
              center: {
                ...prev.mapLocation.center,
                [nestedField]: numValue,
              },
            },
          }))
        }
      } else if (field === "zoom") {
        const numValue = parseInt(value)
        if (!isNaN(numValue)) {
          setContactInfo((prev) => ({
            ...prev,
            mapLocation: {
              ...prev.mapLocation,
              zoom: numValue,
            },
          }))
        }
      }
    } else if (section === "socialMedia") {
      setContactInfo((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [field]: value,
        },
      }))
    }
  }

  const saveContactInfo = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save contact information')
      }

      toast.success("Contact information saved successfully")
    } catch (error) {
      console.error('Error saving contact information:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save contact information')
    } finally {
      setIsSaving(false)
    }
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
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <Button
          variant="ghost"
          onClick={goBack}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 mb-6 -mt-4 flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Manage Contact Information
          </h1>

          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            onClick={saveContactInfo}
            disabled={isLoading || isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-3 text-blue-400">Loading contact information...</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="map">Map Location</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card className="bg-blue-950/20 border border-blue-900/50">
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <Textarea
                      id="address"
                      value={contactInfo.address}
                      onChange={(e) => handleInputChange("general", "address", e.target.value)}
                      placeholder="Enter address"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      value={contactInfo.email}
                      onChange={(e) => handleInputChange("general", "email", e.target.value)}
                      placeholder="Enter email"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => handleInputChange("general", "phone", e.target.value)}
                      placeholder="Enter phone number"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-6">
              <Card className="bg-blue-950/20 border border-blue-900/50">
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="instagram" className="text-sm font-medium">Instagram</label>
                    <Input
                      id="instagram"
                      value={contactInfo.socialMedia.instagram}
                      onChange={(e) => handleInputChange("socialMedia", "instagram", e.target.value)}
                      placeholder="Enter Instagram URL"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</label>
                    <Input
                      id="linkedin"
                      value={contactInfo.socialMedia.linkedin}
                      onChange={(e) => handleInputChange("socialMedia", "linkedin", e.target.value)}
                      placeholder="Enter LinkedIn URL"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="twitter" className="text-sm font-medium">Twitter</label>
                    <Input
                      id="twitter"
                      value={contactInfo.socialMedia.twitter}
                      onChange={(e) => handleInputChange("socialMedia", "twitter", e.target.value)}
                      placeholder="Enter Twitter URL"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="facebook" className="text-sm font-medium">Facebook</label>
                    <Input
                      id="facebook"
                      value={contactInfo.socialMedia.facebook}
                      onChange={(e) => handleInputChange("socialMedia", "facebook", e.target.value)}
                      placeholder="Enter Facebook URL"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="map" className="space-y-6">
              <Card className="bg-blue-950/20 border border-blue-900/50">
                <CardHeader>
                  <CardTitle>Map Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="lat" className="text-sm font-medium">Latitude</label>
                      <Input
                        id="lat"
                        value={contactInfo.mapLocation.center.lat}
                        onChange={(e) => handleInputChange("mapLocation", "center", e.target.value, "lat")}
                        placeholder="Enter latitude"
                        className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lng" className="text-sm font-medium">Longitude</label>
                      <Input
                        id="lng"
                        value={contactInfo.mapLocation.center.lng}
                        onChange={(e) => handleInputChange("mapLocation", "center", e.target.value, "lng")}
                        placeholder="Enter longitude"
                        className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="zoom" className="text-sm font-medium">Zoom Level (1-20)</label>
                    <Input
                      id="zoom"
                      type="number"
                      min="1"
                      max="20"
                      value={contactInfo.mapLocation.zoom}
                      onChange={(e) => handleInputChange("mapLocation", "zoom", e.target.value)}
                      placeholder="Enter zoom level"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-900/30 mt-4">
                    <p className="text-sm text-blue-300">
                      <strong>Tip:</strong> To find the exact coordinates for a location, you can use Google Maps. Right-click on a location and select "What's here?" to view the latitude and longitude.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      <Footer />
    </div>
  )
} 