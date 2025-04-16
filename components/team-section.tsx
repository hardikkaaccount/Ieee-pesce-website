"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Member {
  id: string
  name: string
  position: string
  department: string
  imagePath: string
}

interface Faculty {
  id: string
  name: string
  position: string
  department: string
  imagePath: string
}

interface TeamData {
  members: Member[]
  faculty: Faculty[]
}

export default function TeamSection() {
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/team")
        if (!response.ok) {
          throw new Error("Failed to fetch team data")
        }
        const data = await response.json()
        setTeamData(data)
      } catch (error) {
        console.error("Error fetching team data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamData()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  if (isLoading) {
    return (
      <section className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    )
  }

  // Get the top 5 student leaders
  const topMembers = teamData?.members.slice(0, 5) || []

  return (
    <section className="bg-gradient-to-b from-black to-blue-950 py-16 text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Meet Our <span className="text-blue-400">Team</span></h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our dedicated faculty advisors and student leaders work together to make IEEE PESCE a vibrant and dynamic community for all members.
          </p>
        </motion.div>

        {/* Faculty Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center">Faculty Advisors</h3>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {teamData?.faculty.map((faculty) => (
              <motion.div 
                key={faculty.id}
                variants={itemVariants}
                className="bg-blue-950/30 rounded-lg border border-blue-900/50 overflow-hidden transition-transform duration-300 hover:shadow-blue-800/20 hover:-translate-y-1 p-4 text-center"
              >
                <div className="mx-auto h-24 w-24 relative mb-4">
                  <div className="absolute inset-0 rounded-full bg-blue-600/30 animate-pulse"></div>
                  <Image
                    src={faculty.imagePath || "/placeholder-person.jpg"}
                    alt={faculty.name}
                    fill
                    className="object-cover object-top rounded-full border-2 border-blue-500"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">{faculty.name}</h4>
                <p className="text-blue-400 text-sm">{faculty.position}</p>
                <p className="text-gray-400 text-sm mt-1">{faculty.department}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Student Leaders Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center">Student Leaders</h3>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {topMembers.map((member) => (
              <motion.div 
                key={member.id}
                variants={itemVariants}
                className="bg-blue-950/30 rounded-lg border border-blue-900/50 overflow-hidden transition-transform duration-300 hover:shadow-blue-800/20 hover:-translate-y-1 p-3 text-center"
              >
                <div className="mx-auto h-20 w-20 relative mb-3">
                  <Image
                    src={member.imagePath || "/placeholder-person.jpg"}
                    alt={member.name}
                    fill
                    className="object-cover object-top rounded-full border-2 border-blue-400"
                  />
                </div>
                <h4 className="text-base font-bold text-white">{member.name}</h4>
                <p className="text-blue-400 text-xs">{member.position}</p>
                <p className="text-gray-400 text-xs mt-1">{member.department}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* View Full Team Button */}
        <div className="text-center">
          <Link href="/about#team">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              View Full Team
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 