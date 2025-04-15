"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-black to-blue-950">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              About <span className="text-blue-400">IEEE PESCE</span>
            </h2>
            <p className="text-gray-300 mb-6">
              The IEEE Student Branch at PES College of Engineering, Mandya was established in 2009 with the aim of
              providing students a platform to enhance their technical and professional skills beyond the classroom.
            </p>
            <p className="text-gray-300 mb-6">
              Our mission is to foster technological innovation and excellence for the benefit of humanity. We organize
              workshops, technical talks, project competitions, and various other activities to help students stay
              updated with the latest technological trends.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-blue-900/30 p-4 rounded-lg flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-400">100+</span>
                <span className="text-sm text-gray-300">Active Members</span>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-lg flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-400">20+</span>
                <span className="text-sm text-gray-300">Events Per Year</span>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-lg flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-400">2</span>
                <span className="text-sm text-gray-300">Technical Chapters</span>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Learn More About Us</Button>
          </motion.div>

          <motion.div variants={itemVariants} className="order-1 lg:order-2 relative">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
              <Image src="/home/1.JPG?height=800&width=600" alt="IEEE PESCE Team" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-blue-800 p-4 rounded-lg shadow-xl">
              <p className="text-white font-medium">
                "We are a team of dedicated students who are passionate about technology and innovation."
              </p>
              <p className="text-sm text-blue-200 mt-2">- Dedicated IEEE PESCE Members</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

