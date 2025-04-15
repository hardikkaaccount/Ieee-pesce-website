"use client"

import type { Metadata } from "next"
import { BlogJsonLd } from "@/components/seo/json-ld"
import { getBlogById } from "@/app/lib/blogs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"

type Props = {
  params: {
    id: string
  }
}

// Generate dynamic metadata based on the blog post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id
  
  try {
    const blog = await getBlogById(id)
    
    if (!blog) {
      return {
        title: "Blog Not Found | IEEE PESCE Student Branch",
        description: "The requested blog post could not be found.",
      }
    }
    
    return {
      title: `${blog.title} | IEEE PESCE Student Branch Blog`,
      description: blog.excerpt || "Read this insightful article from IEEE PESCE Student Branch.",
      keywords: ["IEEE", "PESCE", blog.category, "technical blog", "engineering article"],
      alternates: {
        canonical: `/blogs/${id}`,
      },
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        url: `/blogs/${id}`,
        siteName: "IEEE PESCE Student Branch",
        images: [
          {
            url: blog.image || "/images/blog-cover.jpg",
            width: 800,
            height: 600,
            alt: blog.title,
          },
        ],
        locale: "en_US",
        type: "article",
        publishedTime: blog.date,
        authors: [blog.author],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog | IEEE PESCE Student Branch",
      description: "Read insightful articles from IEEE PESCE Student Branch.",
    }
  }
}

export default async function BlogPage({ params }: Props) {
  const id = params.id
  const blog = await getBlogById(id)
  
  if (!blog) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
          <p className="mb-8">The blog post you're looking for does not exist or has been removed.</p>
          <Link href="/blogs" className="inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="mr-2" size={16} />
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    )
  }
  
  return (
    <>
      <BlogJsonLd
        url={`/blogs/${id}`}
        title={blog.title}
        images={[blog.image || "/images/blog-cover.jpg"]}
        datePublished={blog.date}
        dateModified={blog.date}
        authorName={blog.author}
        description={blog.excerpt}
      />
      
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        
        <main className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link href="/blogs" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
            <ArrowLeft className="mr-2" size={16} />
            Back to Blogs
          </Link>
          
          {/* Blog Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-8">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{blog.readTime}</span>
              </div>
              <div className="bg-blue-900/30 px-3 py-1 rounded-full text-blue-300 text-sm">
                {blog.category}
              </div>
            </div>
            
            <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden">
              <Image
                src={blog.image || "/images/blog-cover.jpg"}
                alt={blog.title}
                className="object-cover"
                fill
                priority
              />
            </div>
          </div>
          
          {/* Blog Content */}
          <div className="max-w-3xl mx-auto prose prose-lg prose-invert">
            <p className="text-xl text-gray-300 mb-6">{blog.excerpt}</p>
            
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            
            {blog.articleUrl && (
              <div className="my-8 p-4 border border-blue-800 rounded-lg bg-blue-900/20">
                <p className="mb-2">Read the full article:</p>
                <a 
                  href={blog.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  {blog.articleUrl}
                </a>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
} 