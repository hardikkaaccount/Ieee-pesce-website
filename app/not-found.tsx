import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Home } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | IEEE PESCE Student Branch',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        
        <h2 className="text-3xl font-bold mt-8">Page Not Found</h2>
        
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Go back home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/contact" className="gap-2">
              <Search className="h-4 w-4" />
              Contact us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 