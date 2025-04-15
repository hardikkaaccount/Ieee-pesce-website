'use client'

import React from 'react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Check, ExternalLink } from 'lucide-react'

export default function StructuredDataValidator() {
  const [copied, setCopied] = useState(false)
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const validatorUrl = `https://validator.schema.org/#url=${encodeURIComponent(currentUrl)}`
  
  const copyUrl = () => {
    navigator.clipboard.writeText(validatorUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={copyUrl}
      >
        {copied ? <Check className="h-4 w-4 mr-1" /> : null}
        {copied ? 'Copied!' : 'Copy validator URL'}
      </Button>
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => window.open(validatorUrl, '_blank')}
      >
        <ExternalLink className="h-4 w-4 mr-1" />
        Validate structured data
      </Button>
    </div>
  )
} 