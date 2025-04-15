"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Canvas } from "@react-three/fiber"
import { Float, Environment, PerspectiveCamera, Text3D } from "@react-three/drei"
import type * as THREE from "three"
import { Award, Check, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getSettings } from "@/app/lib/settings"

function FloatingText() {
  const mesh = useRef<THREE.Mesh>(null)

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        ref={mesh}
        font="/fonts/Inter_Bold.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
        position={[-2.5, 0, 0]}
      >
        {/* Membership */}
        <meshStandardMaterial color="#0066A1" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Float>
  )
}

const benefits = [
  {
    icon: <Users className="h-10 w-10 text-blue-400" />,
    title: "Networking",
    description: "Connect with peers, faculty, and industry professionals through events, workshops, and conferences.",
  },
  {
    icon: <Award className="h-10 w-10 text-blue-400" />,
    title: "Recognition",
    description:
      "Gain recognition for your technical achievements and leadership skills through IEEE awards and competitions.",
  },
  {
    icon: <Zap className="h-10 w-10 text-blue-400" />,
    title: "Technical Growth",
    description:
      "Access cutting-edge technical knowledge through IEEE's vast digital library, journals, and magazines.",
  },
]

export default function MembershipPage() {
  const benefitsRef = useRef<HTMLDivElement>(null)
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })

  const plansRef = useRef<HTMLDivElement>(null)
  const plansInView = useInView(plansRef, { once: true, amount: 0.2 })
  
  const [formUrl, setFormUrl] = useState("https://forms.gle/HCxLcGRfDpvURwD46")
  const [membershipFee, setMembershipFee] = useState("₹750")
  const [originalFee, setOriginalFee] = useState("₹1500")
  const [isClient, setIsClient] = useState(false)
  
  // Define membership plans here to access the dynamic fee
  const membershipPlans = [
    {
      id: 1,
      name: "IEEE PESCE Student Membership",
      price: membershipFee,
      originalPrice: originalFee,
      period: "per year",
      description: "For undergraduate and graduate students enrolled at PESCE",
      features: [
        "Access to IEEE Xplore Digital Library",
        "Networking opportunities with professionals",
        "Discounts on IEEE conferences and events",
        "Access to IEEE email alias",
        "IEEE Spectrum magazine subscription",
        "Career development resources",
        "Exclusive access to IEEE PESCE events",
        "Workshops and hands-on technical sessions",
      ],
      recommended: true,
    },
  ]

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsClient(true)
    
    // Set a fixed, current URL first to ensure the latest one is used
    setFormUrl("https://forms.gle/HCxLcGRfDpvURwD46")
    
    // Then load settings - but override with our current discount values
    const settings = getSettings()
    setMembershipFee("₹750") // Hardcoded discounted price
    setOriginalFee("₹1500") // Original price
    
    // Clear any localStorage cached settings to ensure we're always using the latest
    if (typeof window !== 'undefined') {
      try {
        // Update the settings in localStorage with the current URL
        const currentSettings = JSON.parse(localStorage.getItem('websiteSettings') || '{}')
        currentSettings.membershipFormUrl = "https://forms.gle/HCxLcGRfDpvURwD46"
        currentSettings.membershipFee = "₹750" // Update the settings with discounted price
        localStorage.setItem('websiteSettings', JSON.stringify(currentSettings))
      } catch (error) {
        console.error("Error updating settings:", error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <FloatingText />
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* Content */}
        <motion.div
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
              Join IEEE PESCE
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Become part of the world's largest technical professional organization dedicated to advancing technology
              for the benefit of humanity.
            </p>
            <a href={formUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto">Join Now</Button>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-16 bg-gradient-to-b from-black to-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Membership <span className="text-blue-400">Benefits</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              IEEE membership offers a wide range of benefits to help you advance your career and connect with other
              professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 hover:border-blue-600/50 transition-all duration-300"
              >
                <div className="bg-blue-900/30 p-4 rounded-lg inline-block mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-blue-900/20 border border-blue-900/50 rounded-xl p-6 max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-bold mb-4 text-white text-center">Additional Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <p className="text-gray-300">Access to IEEE Xplore Digital Library</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <p className="text-gray-300">IEEE Spectrum Magazine subscription</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <p className="text-gray-300">Discounts on IEEE conferences</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <p className="text-gray-300">Career development resources</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <p className="text-gray-300">Leadership opportunities</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <p className="text-gray-300">Volunteer opportunities</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Membership Plans */}
      <section ref={plansRef} className="py-16 bg-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={plansInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Membership <span className="text-blue-400">Plan</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join IEEE PESCE Student Branch and take advantage of our membership benefits.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {membershipPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={plansInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-blue-950/20 border border-blue-500 rounded-xl p-6 relative"
              >
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  Student Exclusive
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-blue-400">{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                  <span className="text-gray-500 ml-3 line-through">{plan.originalPrice}</span>
                  <span className="ml-2 bg-green-600/70 text-white text-xs px-2 py-1 rounded">50% OFF</span>
                </div>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                      <p className="text-gray-300">{feature}</p>
                    </div>
                  ))}
                </div>
                <a href={formUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Join Now
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              How to <span className="text-blue-400">Join</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Joining IEEE PESCE is now easier than ever. Simply fill out our membership form and we'll handle the rest.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-blue-950/20 border border-blue-900/50 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-white mb-4">One Simple Step</h3>
                <p className="text-gray-300 mb-6">
                  Complete our online membership form. After submission, our team will verify your information and guide you through any remaining steps.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                    <p className="text-gray-300">Fast and easy process</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                    <p className="text-gray-300">Personal assistance from our team</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                    <p className="text-gray-300">Quick confirmation</p>
                  </div>
                </div>
                <a href={formUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 h-auto">
                    Fill the Form
                  </Button>
                </a>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-xs h-64 rounded-lg overflow-hidden">
                  <Image 
                    src="/ieee_membership.jpg" 
                    alt="IEEE Membership" 
                    fill 
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/IMG_9435.JPG?height=256&width=256";
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-blue-900/50 text-center">
              <p className="text-gray-400">
                For assistance, contact our membership coordinator at{" "}
                <span className="text-blue-400">ieeepescem@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

