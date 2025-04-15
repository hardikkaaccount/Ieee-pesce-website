"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CalendarDays, LogOut, Users, FileText, Image as ImageIcon, FolderKanban, BookOpen, Phone } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuthCheck from "@/components/auth-check"

export default function AdminDashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn")
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }
  
  const navigateToManageEvents = () => {
    router.push("/admin/events")
  }
  
  const navigateToBlogAdmin = () => {
    router.push("/admin/blog")
  }
  
  const navigateToGalleryAdmin = () => {
    router.push("/admin/gallery")
  }
  
  const navigateToTeamAdmin = () => {
    router.push("/admin/team")
  }
  
  const navigateToSettingsAdmin = () => {
    router.push("/admin/settings")
  }
  
  const navigateToChaptersAdmin = () => {
    window.location.href = "/admin/chapters"
  }
  
  const navigateToResourcesAdmin = () => {
    router.push("/admin/resources")
  }
  
  const navigateToContactAdmin = () => {
    router.push("/admin/contact")
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
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Admin Dashboard
            </h1>
            
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Card className="bg-blue-950/30 border-blue-900/50 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-blue-400" />
                  Chapters
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage IEEE chapters and SIGs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={navigateToChaptersAdmin}
                >
                  Manage Chapters
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-950/30 border-blue-900/50 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-400" />
                  Event Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Add, edit, or remove events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={navigateToManageEvents}
                >
                  Manage Events
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-950/30 border-blue-900/50 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Team Members
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update team member information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={navigateToTeamAdmin}
                >
                  Manage Team Members
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-950/30 border-blue-900/50 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Blog Posts
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Create and publish blog articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={navigateToBlogAdmin}
                >
                  Manage Blog Posts
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-950/30 border-blue-900/50 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-400" />
                  Gallery
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload and manage gallery images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={navigateToGalleryAdmin}
                >
                  Manage Gallery
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-950/30 border-blue-900/50 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-400">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Website Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure website form URLs and other settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={navigateToSettingsAdmin}
                >
                  Manage Settings
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-950/30 border-blue-900/50 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Resources
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage IEEE resources and links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={navigateToResourcesAdmin}
                >
                  Manage Resources
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-950/30 border-blue-900/50 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-400" />
                  Contact Page
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update contact information and social media links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={navigateToContactAdmin}
                >
                  Manage Contact Info
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Admin Activity Log</h2>
            <p className="text-gray-400">No recent activity to display.</p>
          </div>
        </div>
        
        <Footer />
      </div>
    </AuthCheck>
  )
} 