import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20 duration-75"></div>
          <div className="absolute h-20 w-20 animate-ping rounded-full bg-primary/40 duration-150 delay-75"></div>
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/60 duration-200 delay-150"></div>
          <div className="z-10 h-12 w-12 rounded-full bg-primary"></div>
        </div>
        <p className="text-xl font-medium text-foreground">Loading...</p>
      </div>
    </div>
  )
} 