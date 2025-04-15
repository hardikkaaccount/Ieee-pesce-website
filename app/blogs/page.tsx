"use client"

import { WebPageJsonLd, BlogJsonLd } from "@/components/seo/json-ld"
import Navbar from "@/components/navbar"

export default function BlogsPage() {
  return (
    <>
      <WebPageJsonLd
        title="IEEE PESCE Blogs"
        description="Discover insightful articles and technical blogs written by IEEE PESCE Student Branch members on engineering, technology, and innovation."
        url="/blogs"
        image="/images/chapters-hero.jpg"
      />
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        {/* Rest of the code... */}
      </div>
    </>
  )
} 