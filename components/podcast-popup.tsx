"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X, Play, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PodcastPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show popup after 3 seconds (after intro animation)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="relative bg-gradient-to-br from-blue-950 to-black rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image Section */}
              <div className="relative h-64 md:h-full rounded-xl overflow-hidden">
                <Image
                  src="/IEEEVISTAAR.png"
                  alt="IEEE VISTAAR Podcast"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-blue-400">🎙️ New Podcast Alert!</h3>
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    IEEE-VISTAAR
                  </h2>
                  <p className="text-gray-300">
                    Tune in to our latest episode exploring the future of technology and innovation!
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Link href="/podcast" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Play className="mr-2 h-5 w-5" />
                      Listen Now
                    </Button>
                  </Link>
                  <Link
                    href="https://open.spotify.com/episode/5lUj4oEpfjRC5Wb7B59LOt?si=_4gZBWaEQjKzMENpboy0Lw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10">
                      <Music className="mr-2 h-5 w-5" />
                      Subscribe on Spotify
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 