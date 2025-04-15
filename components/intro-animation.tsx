"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function IntroAnimation() {
  const [animationPhase, setAnimationPhase] = useState(1)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Phase 1: Initial rotation (2 seconds)
    const phase1Timer = setTimeout(() => {
      setAnimationPhase(2)
    }, 1000)

    // Phase 2: Zoom effect (2 seconds after phase 1)
    const phase2Timer = setTimeout(() => {
      setAnimationPhase(3)
    }, 2000)

    return () => {
      clearTimeout(phase1Timer)
      clearTimeout(phase2Timer)
    }
  }, [])

  // Pre-generate star positions to avoid hydration mismatch
  const stars = Array.from({ length: 50 }).map(() => ({
    width: Math.random() * 3 + 1,
    height: Math.random() * 3 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }))

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {/* Stars background - only render on client */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {stars.map((star, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: star.width + "px",
                height: star.height + "px",
                top: star.top + "%",
                left: star.left + "%",
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                repeatType: "reverse",
                delay: star.delay,
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* IEEE Logo with rotation and zoom effect */}
        <motion.div
          className="relative w-72 h-72"
          initial={{ rotateY: 0, scale: 1, opacity: 1 }}
          animate={{
            rotateY: 0,
            scale: animationPhase === 3 ? 10 : 1,
            opacity: animationPhase === 3 ? 0 : 1,
          }}
          transition={{
            rotateY: { duration: 2, ease: "easeInOut" },
            scale: { duration: 2, ease: "easeInOut" },
            opacity: { duration: 2, ease: "easeInOut" },
          }}
        >
          <Image src="/ieee1.png" alt="IEEE PESCE Logo" fill className="object-contain" priority />
        </motion.div>

        {/* Glowing effect around the logo */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full"
          initial={{ boxShadow: "0 0 0 rgba(0, 102, 161, 0)" }}
          animate={{
            boxShadow: "0 0 70px 10px rgba(0, 102, 161, 0.9), 0 0 40px rgba(0, 102, 161, 0.8)",
            scale: animationPhase === 3 ? 10 : 1,
            opacity: animationPhase === 3 ? 0 : 1,
          }}
          transition={{
            boxShadow: { duration: 2, ease: "easeInOut" },
            scale: { duration: 2, ease: "easeInOut" },
            opacity: { duration: 2, ease: "easeInOut" },
          }}
        />
      </motion.div>
    </div>
  )
}

