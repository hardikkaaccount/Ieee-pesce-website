"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, MapPin, Phone, Send, Instagram, Linkedin, Twitter, Facebook, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [formStatus, setFormStatus] = useState<null | "loading" | "success" | "error">(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("loading")
    
    // Validate form fields
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all the required fields.",
        variant: "destructive",
        duration: 5000,
      })
      setFormStatus(null)
      return
    }
    
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
          to_name: "IEEE PESCE Team"
        }
      )
      
      setFormStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error sending email:", error)
      setFormStatus("error")
      
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <section ref={ref} className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Get in <span className="text-blue-400">Touch</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions or want to collaborate? Reach out to us through any of the channels below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-900/30 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Email</h4>
                  <p className="text-white">ieeepescem@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-900/30 p-3 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Address</h4>
                  <p className="text-white">PES College of Engineering, Mandya, Karnataka - 571401</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-900/30 p-3 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Phone</h4>
                  <p className="text-white">(0823) 2220043</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-10 mb-6 text-white">Follow Us</h3>

            <div className="flex gap-4">
              <a href="https://www.instagram.com/ieee_pesce_mandya" className="bg-blue-900/30 p-3 rounded-lg hover:bg-blue-800/50 transition-colors">
                <Instagram className="h-5 w-5 text-blue-400" />
              </a>
              <a href="https://www.linkedin.com/company/ieee-pes-college-of-engineering" className="bg-blue-900/30 p-3 rounded-lg hover:bg-blue-800/50 transition-colors">
                <Linkedin className="h-5 w-5 text-blue-400" />
              </a>
              <a href="https://twitter.com/ieee_pesce" className="bg-blue-900/30 p-3 rounded-lg hover:bg-blue-800/50 transition-colors">
                <Twitter className="h-5 w-5 text-blue-400" />
              </a>
              <a href="https://www.facebook.com/ieeepesce" className="bg-blue-900/30 p-3 rounded-lg hover:bg-blue-800/50 transition-colors">
                <Facebook className="h-5 w-5 text-blue-400" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-6 text-white">Send us a Message</h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm text-gray-400 mb-1 block">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm text-gray-400 mb-1 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="text-sm text-gray-400 mb-1 block">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Subject"
                  className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm text-gray-400 mb-1 block">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Your Message"
                  rows={5}
                  className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white resize-none"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2"
                disabled={formStatus === "loading"}
              >
                {formStatus === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

