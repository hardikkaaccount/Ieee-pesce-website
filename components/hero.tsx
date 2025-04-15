"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Float, Environment, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { getSettings } from "@/app/lib/settings"
import type * as THREE from "three"

function CircuitModel() {
  // This is a placeholder for a 3D model
  // In a real implementation, you would use a custom circuit board model
  const mesh = useRef<THREE.Mesh>(null)

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={mesh} position={[0, 0, 0]} scale={2}>
        <torusKnotGeometry args={[1, 0.3, 100, 16]} />
        <meshStandardMaterial
          color="#0066A1"
          metalness={0.8}
          roughness={0.2}
          emissive="#003366"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  
  // Get the membership form URL from settings
  const settings = getSettings()
  const membershipFormUrl = settings.membershipFormUrl
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <Navbar />

      {/* 3D Background - only render on client */}
      {isMounted && (
        <div className="absolute inset-0 z-0 opacity-90">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <CircuitModel />
            <Environment preset="city" />
          </Canvas>
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        style={{ y, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
            Advancing Technology for Humanity
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            IEEE PESCE Student Branch - Empowering students to innovate, collaborate, and lead in the world of
            technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto">
                Explore Events
              </Button>
            </Link>
            <a href={membershipFormUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-900/20 text-lg px-8 py-6 h-auto"
              >
                Join IEEE
              </Button>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
        }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </div>
  )
}

