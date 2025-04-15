"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  PenIcon, 
  PlusIcon, 
  TrashIcon,
  AlertTriangle,
  Home,
  LogOut,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
              <Home size={16} />
              Dashboard
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-red-600"
            onClick={() => {
              localStorage.removeItem("isAdminLoggedIn")
              window.location.href = "/admin"
            }}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
import type { Chapter } from "@/app/lib/types"

export default function ChaptersAdmin() {
  const [chapters, setChapters] = useState<Record<string, Chapter>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  // Authentication check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    if (!isLoggedIn) {
      window.location.href = "/admin"
    }
  }, [router])

  // Load chapters
  useEffect(() => {
    fetchChapters()
  }, [])

  const fetchChapters = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chapters')
      
      if (!response.ok) {
        throw new Error('Failed to fetch chapters')
      }
      
      const chaptersData = await response.json()
      setChapters(chaptersData)
    } catch (error) {
      console.error("Error loading chapters:", error)
      setError("Failed to load chapters data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (confirm(`Are you sure you want to delete the chapter "${chapters[chapterId].name}"?`)) {
      try {
        setIsDeleting(chapterId)
        const response = await fetch(`/api/chapters/${chapterId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete chapter')
        }
        
        // Remove from local state
        const updatedChapters = { ...chapters }
        delete updatedChapters[chapterId]
        setChapters(updatedChapters)
      } catch (error) {
        console.error("Error deleting chapter:", error)
        setError("Failed to delete chapter")
      } finally {
        setIsDeleting(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <AdminNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Chapters</h1>
            <Link href="/admin/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <Home size={16} />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 size={24} className="animate-spin text-blue-500" />
              <span>Loading chapters...</span>
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
          <h1 className="text-2xl font-bold">Manage Chapters</h1>
          <Link href="/admin/chapters/new">
            <Button className="flex items-center gap-2">
              <PlusIcon size={16} />
              Add New Chapter
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(chapters).length > 0 ? (
            Object.entries(chapters).map(([id, chapter]) => (
              <Card key={id} className="overflow-hidden border border-gray-200 dark:border-gray-800">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{chapter.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/chapters/${id}`)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
                      >
                        <PenIcon size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteChapter(id)}
                        disabled={isDeleting === id}
                        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        {isDeleting === id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <TrashIcon size={16} />
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-between mb-2">
                      <span>Chapter ID:</span>
                      <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                        {chapter.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Projects:</span>
                      <span className="font-semibold">{chapter.projects?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Events:</span>
                      <span className="font-semibold">{chapter.events?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Team Members:</span>
                      <span className="font-semibold">{chapter.team?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No chapters found.</p>
              <Link href="/admin/chapters/new">
                <Button variant="outline" className="flex items-center gap-2">
                  <PlusIcon size={16} />
                  Add Your First Chapter
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 