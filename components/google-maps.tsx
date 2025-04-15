"use client"

import { useEffect, useRef, useState } from "react"

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        Animation: {
          DROP: number;
        };
      };
    };
  }
}

interface GoogleMapProps {
  center: { lat: number; lng: number }
  zoom: number
  markerTitle?: string
  height?: string
}

// Track if the API is already loaded globally
let isApiLoaded = false

export default function GoogleMap({ center, zoom, markerTitle, height = "400px" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  useEffect(() => {
    // Create a unique callback name for this map instance
    const callbackName = `initMap_${Math.random().toString(36).substring(2, 15)}`
    
    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current) return
      
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
          ],
        })
        
        if (markerTitle) {
          new window.google.maps.Marker({
            position: center,
            map,
            title: markerTitle,
            animation: window.google.maps.Animation.DROP
          })
        }
        
        setMapLoaded(true)
      } catch (err) {
        console.error("Error initializing Google Map:", err)
      }
    }
    
    // Load Google Maps API if not already loaded
    if (!isApiLoaded) {
      // Set global callback
      window[callbackName as keyof Window] = () => {
        isApiLoaded = true
        initializeMap()
        delete window[callbackName as keyof Window]
      }
      
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=${callbackName}`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      
      return () => {
        // Clean up callback to prevent memory leaks
        if (window[callbackName as keyof Window]) {
          delete window[callbackName as keyof Window]
        }
      }
    } else {
      // API already loaded, initialize map directly
      initializeMap()
    }
  }, [center, zoom, markerTitle])
  
  return (
    <div 
      ref={mapRef} 
      style={{ height, width: "100%" }}
      className={`rounded-lg ${!mapLoaded ? "bg-blue-950/20" : ""}`}
    ></div>
  )
} 