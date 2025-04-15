"use client"

import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Canvas } from "@react-three/fiber"
import { Float, Environment, PerspectiveCamera, Text3D } from "@react-three/drei"
import type * as THREE from "three"
import { Briefcase, Building, Handshake, Award, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

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
        {/* Sponsors */}
        <meshStandardMaterial color="#0066A1" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Float>
  )
}

// Sample sponsors data
const sponsors = [
  {
    id: 1,
    name: "TechCorp",
    category: "Platinum",
    logo: "/placeholder.svg?height=200&width=200",
    description: "Leading technology company specializing in software solutions and digital transformation.",
    website: "#",
  },
  {
    id: 2,
    name: "InnovateSystems",
    category: "Gold",
    logo: "/placeholder.svg?height=200&width=200",
    description: "Innovation-driven company focused on cutting-edge research and development.",
    website: "#",
  },
]

// Sample collaborators data
const collaborators = [
  {
    id: 1,
    name: "IEEE Bangalore Section",
    type: "IEEE Entity",
    logo: "/placeholder.svg?height=200&width=200",
    description: "Regional IEEE section supporting student branches and technical activities in Bangalore.",
    website: "#",
  },
  {
    id: 2,
    name: "Tech University",
    type: "Academic",
    logo: "/placeholder.svg?height=200&width=200",
    description: "Leading technical university known for research and innovation in engineering and technology.",
    website: "#",
  },
]

export default function SponsorsPage() {
  const sponsorsRef = useRef<HTMLDivElement>(null)
  const sponsorsInView = useInView(sponsorsRef, { once: true, amount: 0.2 })

  const collaboratorsRef = useRef<HTMLDivElement>(null)
  const collaboratorsInView = useInView(collaboratorsRef, { once: true, amount: 0.2 })

  const benefitsRef = useRef<HTMLDivElement>(null)
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })

  useEffect(() => {
    window.scrollTo(0, 0)
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
              Sponsors & Collaborations
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Meet the organizations that support IEEE PESCE and help us advance technology for humanity.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Sponsors Section */}
      <section ref={sponsorsRef} className="py-16 bg-gradient-to-b from-black to-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sponsorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Our <span className="text-blue-400">Sponsors</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We are grateful to these organizations for their generous support of IEEE PESCE activities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={sponsorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-white p-2 flex-shrink-0">
                  <Image src={sponsor.logo || "/placeholder.svg"} alt={sponsor.name} fill className="object-contain" />
                </div>
                <div>
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                    {sponsor.category} Sponsor
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{sponsor.name}</h3>
                  <p className="text-gray-300 mb-4">{sponsor.description}</p>
                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Visit Website
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborators Section */}
      <section ref={collaboratorsRef} className="py-16 bg-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={collaboratorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Our <span className="text-blue-400">Collaborators</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We collaborate with these organizations to enhance our technical activities and provide better
              opportunities for our members.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collaborators.map((collaborator, index) => (
              <motion.div
                key={collaborator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={collaboratorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-white p-2 flex-shrink-0">
                  <Image
                    src={collaborator.logo || "/placeholder.svg"}
                    alt={collaborator.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                    {collaborator.type}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{collaborator.name}</h3>
                  <p className="text-gray-300 mb-4">{collaborator.description}</p>
                  <a href={collaborator.website} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Visit Website
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Benefits */}
      <section ref={benefitsRef} className="py-16 bg-gradient-to-b from-blue-950 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Sponsorship <span className="text-blue-400">Benefits</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Partner with IEEE PESCE and gain access to a range of benefits while supporting the next generation of
              engineers and technologists.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={benefitsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Brand Visibility</h3>
              <p className="text-gray-300">
                Showcase your brand to over 500 engineering students and faculty through our events, website, and social
                media.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={benefitsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Talent Recruitment</h3>
              <p className="text-gray-300">
                Connect with skilled engineering students for internships, projects, and potential recruitment
                opportunities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={benefitsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Networking</h3>
              <p className="text-gray-300">
                Engage with faculty, industry professionals, and students through our events and collaborative
                activities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={benefitsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">CSR Fulfillment</h3>
              <p className="text-gray-300">
                Fulfill your corporate social responsibility by supporting educational and technical initiatives for
                students.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Sponsorship <span className="text-blue-400">Tiers</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose the sponsorship level that best aligns with your organization's goals and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Platinum Tier */}
            <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                Premium
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Platinum</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-blue-400">₹50,000</span>
                <span className="text-gray-400 ml-1">/ year</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Logo on all event banners and promotional materials</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Prominent logo placement on website</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Opportunity to conduct 3 workshops or tech talks</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Exclusive access to student resumes</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Recognition in all IEEE PESCE publications</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Become a Platinum Sponsor</Button>
            </div>

            {/* Gold Tier */}
            <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-2 text-white">Gold</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-blue-400">₹30,000</span>
                <span className="text-gray-400 ml-1">/ year</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Logo on major event banners</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Logo on website</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Opportunity to conduct 2 workshops or tech talks</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Recognition in major IEEE PESCE publications</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Become a Gold Sponsor</Button>
            </div>

            {/* Silver Tier */}
            <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-2 text-white">Silver</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-blue-400">₹15,000</span>
                <span className="text-gray-400 ml-1">/ year</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Logo on select event banners</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Logo on website</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Opportunity to conduct 1 workshop or tech talk</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs">✓</span>
                  </div>
                  <p className="text-gray-300">Recognition in select IEEE PESCE publications</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Become a Silver Sponsor</Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4">
              Interested in a custom sponsorship package? Contact us to discuss your specific requirements.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 mx-auto">
              <Mail className="h-4 w-4" />
              Contact for Custom Packages
            </Button>
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section className="py-16 bg-gradient-to-b from-black to-blue-950">
        <div className="container mx-auto px-4">
          <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              Collaboration <span className="text-blue-400">Opportunities</span>
            </h2>
            <p className="text-gray-300 mb-8 text-center">
              Beyond sponsorship, we welcome various forms of collaboration with organizations that share our vision of
              advancing technology for humanity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-white">Technical Collaborations</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">1</span>
                    </div>
                    <p>Joint research projects and technical paper publications</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">2</span>
                    </div>
                    <p>Technical workshops and training programs</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">3</span>
                    </div>
                    <p>Hackathons and coding competitions</p>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-white">Academic Collaborations</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">1</span>
                    </div>
                    <p>Guest lectures and expert talks</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">2</span>
                    </div>
                    <p>Industrial visits and field trips</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">3</span>
                    </div>
                    <p>Internship and project opportunities</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Explore Collaboration Opportunities</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

