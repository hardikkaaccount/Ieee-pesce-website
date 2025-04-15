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
    initMap: () => void;
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
  const [isMounted, setIsMounted] = useState(false)
  
  // Only run on client-side
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  useEffect(() => {
    if (!isMounted) return;
    
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
    
    // Define global callback function
    window.initMap = initializeMap;
    
    // Load Google Maps API if not already loaded
    if (!isApiLoaded) {
      const apiKey = "AIzaSyBn_DXgyHzxdOVa2ZzdOCAn8ekrLS_DRpI"; // Hardcoded for testing
      
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      
      script.onload = () => {
        isApiLoaded = true;
      };
      
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
      };
      
      return () => {
        // Clean up callback to prevent memory leaks
        if (window.initMap) {
          // @ts-ignore
          delete window.initMap;
        }
      }
    } else {
      // API already loaded, initialize map directly
      initializeMap()
    }
  }, [center, zoom, markerTitle, isMounted])
  
  if (!isMounted) {
    return <div style={{ height, width: "100%" }} className="rounded-lg bg-blue-950/20" />;
  }
  
  return (
    <div 
      ref={mapRef} 
      style={{ height, width: "100%" }}
      className={`rounded-lg ${!mapLoaded ? "bg-blue-950/20" : ""}`}
    ></div>
  )
} 