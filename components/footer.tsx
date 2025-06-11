"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Instagram, Linkedin, Twitter, Facebook, MapPin, Mail, Phone } from "lucide-react"
import { getSettings } from "@/app/lib/settings"

export default function Footer() {
  // Get the membership form URL from settings
  const settings = getSettings()
  const membershipFormUrl = settings.membershipFormUrl
  
  return (
    <footer className="bg-blue-950 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">IEEE PESCE</h3>
            <p className="text-gray-300 mb-3 text-sm">
              IEEE is the world's largest professional association dedicated to advancing technology for the benefit of humanity.
            </p>
            <div className="flex items-center text-gray-300 mb-2">
              <MapPin className="h-4 w-4 mr-2 text-blue-400" />
              <p className="text-xs">PES College of Engineering, Mandya, Karnataka - 571401</p>
            </div>
            <div className="flex items-center text-gray-300 mb-2">
              <Mail className="h-4 w-4 mr-2 text-blue-400" />
              <a href="mailto:ieeepescem@gmail.com" className="text-xs hover:text-blue-400 transition-colors">ieeepescem@gmail.com</a>
            </div>
            <div className="flex items-center text-gray-300 mb-2">
              <Phone className="h-4 w-4 mr-2 text-blue-400" />
              <p className="text-xs">(0823) 2220043, +91 9844096300, +91 8660269799</p>
            </div>
            <div className="flex space-x-3 mt-3">
              <a href="https://www.facebook.com/ieeepescestudentbranch" target="_blank" rel="noopener noreferrer" className="bg-blue-900/30 p-2 rounded-lg hover:bg-blue-800/50 transition-colors">
                <Facebook className="h-4 w-4 text-blue-400" />
              </a>
              <a href="https://twitter.com/ieee_pesce" target="_blank" rel="noopener noreferrer" className="bg-blue-900/30 p-2 rounded-lg hover:bg-blue-800/50 transition-colors">
                <Twitter className="h-4 w-4 text-blue-400" />
              </a>
              <a href="https://www.linkedin.com/company/ieee-pesce" target="_blank" rel="noopener noreferrer" className="bg-blue-900/30 p-2 rounded-lg hover:bg-blue-800/50 transition-colors">
                <Linkedin className="h-4 w-4 text-blue-400" />
              </a>
              <a href="https://www.instagram.com/ieee_pesce" target="_blank" rel="noopener noreferrer" className="bg-blue-900/30 p-2 rounded-lg hover:bg-blue-800/50 transition-colors">
                <Instagram className="h-4 w-4 text-blue-400" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-white">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              <li>
                <Link href="/" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  Podcast
                </Link>
              </li>
              <li>
                <a
                  href={membershipFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Join IEEE
                </a>
              </li>
            </ul>
            
            <h3 className="text-lg font-bold mt-6 mb-3 text-white">Why Join Us?</h3>
            <ul className="space-y-1">
              <li className="text-gray-300 text-sm">● Connect with local IEEE Sections</li>
              <li className="text-gray-300 text-sm">● Find upcoming conferences</li>
              <li className="text-gray-300 text-sm">● Access latest IEEE news and publications</li>
              <li className="text-gray-300 text-sm">● Exclusive IEEE member discounts</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-white">IEEE Resources</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              <li>
                <a href="https://www.ieee.org/index.html" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Official
                </a>
              </li>
              <li>
                <a href="http://ieeexplore.ieee.org/Xplore/home.jsp" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Xplore
                </a>
              </li>
              <li>
                <a href="http://spectrum.ieee.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Spectrum
                </a>
              </li>
              <li>
                <a href="http://wie.ieee.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE WIE
                </a>
              </li>
              <li>
                <a href="https://ieee-collabratec.ieee.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Collabratec
                </a>
              </li>
              <li>
                <a href="https://ieeemysore.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Mysore
                </a>
              </li>
              <li>
                <a href="http://ieeebangalore.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Bengaluru
                </a>
              </li>
              <li>
                <a href="http://www.ieeer10.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Region 10
                </a>
              </li>
              <li>
                <a href="https://standards.ieee.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Standards
                </a>
              </li>
              <li>
                <a href="http://bigdata.ieee.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  IEEE Big Data
                </a>
              </li>
              <li>
                <a href="http://www.pescemandya.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  P.E.S.C.E
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-blue-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} IEEE PESCE Student Branch. <span className="hidden md:inline">Use of this website signifies your agreement to the IEEE Terms and Conditions.</span></p>
            <p className="text-sm text-gray-500 mt-1 md:mt-0">Designed with ❤️ by <Link href="https://www.linkedin.com/in/hardikjain108/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Hardik Jain</Link></p>
          </div>
        </div>
      </div>
    </footer>
  )
}

