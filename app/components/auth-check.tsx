"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This component handles authentication verification
// It will redirect to login page if not authenticated
export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [isVerifying, setIsVerifying] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('adminToken')
        
        if (!token) {
          // No token found, redirect to login
          router.push('/admin')
          return
        }
        
        // Verify token with API
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        })
        
        const data = await response.json()
        
        if (!response.ok || !data.isValid) {
          // Token invalid or expired, clear localStorage and redirect
          localStorage.removeItem('isAdminLoggedIn')
          localStorage.removeItem('adminToken')
          localStorage.removeItem('tokenExpiry')
          router.push('/admin')
          return
        }
        
        // Token is valid, allow access
        setIsVerifying(false)
      } catch (error) {
        console.error('Auth verification error:', error)
        // On error, redirect to login for safety
        router.push('/admin')
      }
    }
    
    verifyAuth()
  }, [router])
  
  // Show nothing while verifying
  if (isVerifying) {
    return null
  }
  
  // Auth verified, render children
  return <>{children}</>
} 