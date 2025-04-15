"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Canvas } from "@react-three/fiber"
import { Float, Environment, PerspectiveCamera, Text3D } from "@react-three/drei"
import type * as THREE from "three"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Users,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { toast } from "@/components/ui/use-toast"
import type { ContactInfo } from "@/app/lib/contactUtils"
import GoogleMap from "@/components/google-maps"

// Default contact information (as fallback)
const defaultContactInfo: ContactInfo = {
  address: "PES College of Engineering, Mandya - Bangalore Road, Mandya, Karnataka 571401",
  email: "ieee.sbyp@gmail.com",
  phone: "+91 9742286934",
  mapLocation: {
    center: { lat: 12.5212, lng: 76.9049 },
    zoom: 16,
  },
  socialMedia: {
    instagram: "https://www.instagram.com/ieee_pesce_mandya",
    linkedin: "https://www.linkedin.com/company/ieee-pesce-mandya/",
    twitter: "https://twitter.com/ieee_pesce",
    facebook: "https://www.facebook.com/ieeepesce",
  },
}

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
        {/* Contact Us */}
        <meshStandardMaterial color="#0066A1" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Float>
  )
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)
  const [isLoading, setIsLoading] = useState(true)
  const [formStatus, setFormStatus] = useState<null | "loading" | "success" | "error">(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const formRef = useRef<HTMLDivElement>(null)
  const formInView = useInView(formRef, { once: true, amount: 0.2 })

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInView = useInView(mapRef, { once: true, amount: 0.2 })

  const faqRef = useRef<HTMLDivElement>(null)
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 })
  
  // Fetch contact info from API
  useEffect(() => {
    async function fetchContactInfo() {
      setIsLoading(true)
      try {
        const response = await fetch('/api/contact')
        if (!response.ok) {
          throw new Error('Failed to fetch contact information')
        }
        const data = await response.json()
        setContactInfo(data)
      } catch (error) {
        console.error('Error fetching contact information:', error)
        // Use default if API fails
        setContactInfo(defaultContactInfo)
      } finally {
        setIsLoading(false)
      }
    }
    
    window.scrollTo(0, 0)
    
    // Fetch contact information
    fetchContactInfo()
  }, [])
  
  // Load the EmailJS SDK
  useEffect(() => {
    const script = document.createElement('script')
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
    script.async = true
    document.body.appendChild(script)
    
    script.onload = () => {
      // Initialize EmailJS with user ID from environment variable
      // @ts-ignore
      window.emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID)
    }
    
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("loading")
    
    try {
      // @ts-ignore
      await window.emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: "IEEE PESCE Team" // Adding recipient name for the template
        }
      )
      
      setFormStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
      
      // Show success toast
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error sending email:", error)
      setFormStatus("error")
      
      // Show error toast
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Have questions or want to connect with IEEE PESCE? We'd love to hear from you.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gradient-to-b from-black to-blue-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Our Location</h3>
              <p className="text-gray-300">
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </span>
                ) : (
                  contactInfo.address
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Email Us</h3>
              <p className="text-gray-300">
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </span>
                ) : (
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-blue-400 transition-colors">
                    {contactInfo.email}
                  </a>
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Call Us</h3>
              <p className="text-gray-300">
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </span>
                ) : (
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-blue-400 transition-colors">
                    {contactInfo.phone}
                  </a>
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Office Hours</h3>
              <p className="text-gray-300">Monday - Friday<br />9:00 AM - 5:00 PM</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Social Media Section */}
      <section className="py-16 bg-blue-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Connect with Us on <span className="text-blue-400">Social Media</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Stay updated with our latest events, achievements, and announcements by following us on social media.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {isLoading ? (
              <div className="flex items-center justify-center w-full py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <span className="ml-3 text-blue-400">Loading social media links...</span>
              </div>
            ) : (
              <>
                <a 
                  href={contactInfo.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-900/30 hover:bg-blue-800/50 transition-colors rounded-full p-6 group"
                >
                  <Instagram className="h-10 w-10 text-blue-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href={contactInfo.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-900/30 hover:bg-blue-800/50 transition-colors rounded-full p-6 group"
                >
                  <Linkedin className="h-10 w-10 text-blue-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href={contactInfo.socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-900/30 hover:bg-blue-800/50 transition-colors rounded-full p-6 group"
                >
                  <Twitter className="h-10 w-10 text-blue-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href={contactInfo.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-900/30 hover:bg-blue-800/50 transition-colors rounded-full p-6 group"
                >
                  <Facebook className="h-10 w-10 text-blue-400 group-hover:text-white transition-colors" />
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-blue-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -20 }}
              animate={formInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-white">
                Send Us a <span className="text-blue-400">Message</span>
              </h2>
              <p className="text-gray-300 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white mb-2">
                    Subject
                  </label>
                  <Select onValueChange={handleSelectChange} value={formData.subject}>
                    <SelectTrigger className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-950 border-blue-800">
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="events">Events & Activities</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white min-h-[150px]"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  disabled={formStatus === "loading"}
                >
                  {formStatus === "loading" ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-300 rounded-full border-t-white"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {formStatus === "success" && (
                  <div className="bg-green-900/20 border border-green-900/50 rounded-md p-4 text-green-400">
                    Your message has been sent successfully. We'll get back to you soon!
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="bg-red-900/20 border border-red-900/50 rounded-md p-4 text-red-400">
                    There was an error sending your message. Please try again later.
                  </div>
                )}
              </form>
            </motion.div>

            {/* Map */}
            <motion.div
              ref={mapRef}
              initial={{ opacity: 0, x: 20 }}
              animate={mapInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-white">
                Find <span className="text-blue-400">Us</span>
              </h2>
              <p className="text-gray-300 mb-8">
                Visit us at our campus location in PES College of Engineering, Mandya.
              </p>

              <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-blue-900/50">
                <GoogleMap
                  center={contactInfo.mapLocation.center}
                  zoom={contactInfo.mapLocation.zoom}
                  markerTitle="PES College of Engineering, Mandya"
                />
              </div>

              <div className="mt-6 bg-blue-950/20 border border-blue-900/50 rounded-xl p-4">
                <h3 className="text-lg font-bold mb-2 text-white">Directions</h3>
                <p className="text-gray-300 text-sm">
                  From Bangalore: Take the Mysore Road (SH 17) and drive towards Mandya. PES College of Engineering is
                  located on the outskirts of Mandya city.
                </p>
                <a 
                  href="https://www.google.com/maps/dir//PES+College+of+Engineering,+Mandya,+Karnataka" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center mt-2"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Get Directions
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Frequently Asked <span className="text-blue-400">Questions</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about IEEE PESCE Student Branch.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">How can I join IEEE PESCE?</h3>
                  <p className="text-gray-300">
                    To join IEEE PESCE, you first need to become an IEEE member through the official IEEE website. After
                    that, you can register with our student branch by visiting our office or contacting our membership
                    coordinator.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">What are the benefits of joining IEEE PESCE?</h3>
                  <p className="text-gray-300">
                    Members get access to technical resources, networking opportunities, workshops, competitions, and
                    leadership experiences. You'll also have access to IEEE Xplore Digital Library and various IEEE
                    publications.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">How can I participate in IEEE PESCE events?</h3>
                  <p className="text-gray-300">
                    Most of our events are open to all students, but IEEE members often get priority registration and
                    discounted rates. Check our events page or follow our social media channels for upcoming events and
                    registration details.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">Can I volunteer with IEEE PESCE?</h3>
                  <p className="text-gray-300">
                    Yes, we welcome volunteers for our various activities and events. Contact our executive committee or
                    visit our office to learn about volunteer opportunities and how you can contribute.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4">Didn't find what you're looking for? Feel free to contact us directly.</p>
            <a href="mailto:ieee.pesce@gmail.com">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Users className="h-4 w-4 mr-2" />
                Contact Support Team
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

