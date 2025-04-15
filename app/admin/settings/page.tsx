"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Define the settings interface
interface Settings {
  membershipFormUrl: string;
  membershipFee: string;
  [key: string]: any;
}

export default function SettingsAdmin() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [membershipFormUrl, setMembershipFormUrl] = useState("")
  const [membershipFee, setMembershipFee] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }
    
    // Load settings from API
    fetchSettings()
  }, [router])
  
  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/settings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      
      const settings = await response.json()
      
      // Update state with fetched settings
      setMembershipFormUrl(settings.membershipFormUrl || "")
      setMembershipFee(settings.membershipFee || "")
    } catch (err) {
      console.error("Error loading settings:", err)
      setError("Failed to load settings")
      setTimeout(() => setError(""), 3000)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      
      // Validate URL format
      if (!membershipFormUrl.startsWith("https://")) {
        setError("URL must start with https://")
        setIsSaving(false)
        return
      }
      
      // Validate fee format (should start with ₹)
      let formattedFee = membershipFee
      if (!formattedFee.startsWith("₹")) {
        formattedFee = "₹" + formattedFee
      }
      
      // Save settings via API
      const updatedSettings: Settings = {
        membershipFormUrl: membershipFormUrl,
        membershipFee: formattedFee
      }
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSettings)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save settings')
      }
      
      // Update state with formatted fee
      setMembershipFee(formattedFee)
      
      setSuccess("Settings saved successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings")
      setTimeout(() => setError(""), 3000)
    } finally {
      setIsSaving(false)
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
            size="icon"
            onClick={() => router.push("/admin/dashboard")}
            className="bg-transparent border-blue-800 hover:bg-blue-900/30"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Website Settings
          </h1>
        </div>
        
        {success && (
          <Alert className="mb-6 bg-green-900/30 border-green-800 text-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="mb-6 bg-red-900/30 border-red-800 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mr-2" />
            <span>Loading settings...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-3xl">
            <Card className="bg-blue-950/30 border-blue-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-blue-400" />
                  Membership Form URL
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set the URL for the IEEE PESCE membership form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="formUrl">Google Form URL</Label>
                  <Input
                    id="formUrl"
                    value={membershipFormUrl}
                    onChange={(e) => setMembershipFormUrl(e.target.value)}
                    placeholder="https://forms.gle/..."
                    className="bg-blue-900/20 border-blue-900/50"
                  />
                  <p className="text-xs text-gray-400">
                    This URL will be used for all "Join Now" buttons on the membership page
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-950/30 border-blue-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-400">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  Membership Fee
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set the annual membership fee amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="membershipFee">Membership Fee</Label>
                  <Input
                    id="membershipFee"
                    value={membershipFee}
                    onChange={(e) => setMembershipFee(e.target.value)}
                    placeholder="₹1500"
                    className="bg-blue-900/20 border-blue-900/50"
                  />
                  <p className="text-xs text-gray-400">
                    This is the annual membership fee displayed on the membership page
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button
                onClick={handleSaveSettings}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
} 