"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import AboutSection from "@/components/about-section"
import EventsSection from "@/components/events-section"
import ChaptersSection from "@/components/chapters-section"
import ContactSection from "@/components/contact-section"
import TeamSection from "@/components/team-section"
import Footer from "@/components/footer"
import { OrganizationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld"

// Dynamically import components with 3D elements to prevent hydration mismatch
const IntroAnimation = dynamic(() => import("@/components/intro-animation"), { ssr: false })
const Hero = dynamic(() => import("@/components/hero"), { ssr: false })

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Show intro for 4 seconds then fade out
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    // Return a simple loading state or placeholder
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <OrganizationJsonLd 
        name="IEEE PESCE Student Branch"
        url={process.env.NEXT_PUBLIC_SITE_URL || "https://ieeepescesb.org"}
        logo="/ieee-logo.png"
        description="IEEE PESCE Student Branch at PES College of Engineering, Mandya. Advancing technology for humanity."
        sameAs={[
          "https://www.facebook.com/ieeepescestudentbranch",
          "https://twitter.com/ieee_pesce",
          "https://www.linkedin.com/company/ieee-pesce",
          "https://www.instagram.com/ieee_pesce"
        ]}
      />
      <WebPageJsonLd
        title="IEEE PESCE - Home"
        description="IEEE PESCE Student Branch at PES College of Engineering, Mandya. Join us in our journey of technological innovation and professional development."
        url="/"
        image="/ieee-logo.png"
      />
      <main className="min-h-screen bg-black text-white overflow-hidden">
        <AnimatePresence>
          {showIntro ? (
            <motion.div
              key="intro"
              className="fixed inset-0 z-50 flex items-center justify-center"
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <IntroAnimation />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full"
            >
              <Hero />
              <AboutSection />
              <EventsSection />
              <ChaptersSection />
              <TeamSection />
              <ContactSection />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

