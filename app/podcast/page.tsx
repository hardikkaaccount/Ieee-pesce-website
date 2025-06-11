"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Music, Calendar, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PodcastPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 })

  const episodesRef = useRef<HTMLDivElement>(null)
  const episodesInView = useInView(episodesRef, { once: true, amount: 0.2 })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse" />

        {/* Content */}
        <motion.div
          ref={heroRef}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              IEEE VISTAAR
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Tune in to our podcast series where we explore the intersection of technology, innovation, and the future of engineering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#latest-episode">
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
                  Listen Now
                </Button>
              </Link>
              <Link
                href="https://open.spotify.com/episode/5lUj4oEpfjRC5Wb7B59LOt?si=_4gZBWaEQjKzMENpboy0Lw"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10 px-8 py-6 text-lg">
                  Subscribe
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Latest Episode Section */}
      <section id="latest-episode" className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/50 to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={episodesRef}
            initial={{ opacity: 0, y: 20 }}
            animate={episodesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center">
              Latest <span className="text-blue-400">Episode</span>
            </h2>

            <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Episode Image */}
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src="/Cover1-podcast.jpg"
                    alt="Connected Car Episode"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/600x400/1e3a8a/ffffff?text=IEEE+VISTAAR";
                    }}
                  />
                </div>

                {/* Episode Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-blue-400 mb-4">
                      <Calendar size={16} />
                      <span>Released June 1, 2024</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      "CONNECTED CAR" Navigating IP in the age of Automotive Software
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Welcome to the debut episode of IEEE VISTAAR, where we explore the evolving landscape of automotive software and its impact on intellectual property (IP). As connected cars become more sophisticated, the intersection of technology, innovation, and legal frameworks is more crucial than ever.
                    </p>
                  </div>

                  {/* Audio Player */}
                  <div className="bg-blue-900/30 rounded-lg p-4">
                    <Link
                      href="https://open.spotify.com/episode/5lUj4oEpfjRC5Wb7B59LOt?si=_4gZBWaEQjKzMENpboy0Lw"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Spotify className="mr-2 h-5 w-5" />
                        Listen on Spotify
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950 to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              More <span className="text-blue-400">Episodes</span> Coming Soon
            </h2>
            <p className="text-gray-300 mb-8">
              Stay tuned for more exciting episodes exploring cutting-edge technology and innovation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group bg-blue-900 border border-blue-900/30 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
                >
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src="/IEEE-VISTAAR.png"
                      alt={`Upcoming Episode ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-blue-900/80 px-3 py-1 rounded-full text-sm font-medium text-blue-200">
                      Coming Soon
                    </div>
                  </div>
                  <div className="p-6 text-center relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 bg-blue-900/90 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500/50 group-hover:border-blue-400 transition-colors duration-300">
                        <Music className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">Episode {i + 1}</h3>
                      <p className="text-gray-400 mb-6">Stay tuned for our next exciting episode</p>
                      <Link
                        href="https://open.spotify.com/episode/5lUj4oEpfjRC5Wb7B59LOt?si=_4gZBWaEQjKzMENpboy0Lw"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button 
                          variant="outline" 
                          className="border-blue-400 text-blue-400 hover:bg-blue-400/10 w-full group-hover:border-blue-300 group-hover:text-blue-300 transition-all duration-300"
                        >
                          <Radio className="mr-2 h-4 w-4" />
                          Subscribe to be notified
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Spotify Icon Component
function Spotify(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
} 