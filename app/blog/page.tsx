"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Clock, Search, ChevronDown, Filter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { BlogPost } from "@/app/lib/blogUtils"
import dynamic from "next/dynamic"
import { WebPageJsonLd } from "@/components/seo/json-ld"

const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gradient-to-b from-blue-950 to-black" />
})

// Categories for filtering
const categories = ["All Categories", "Events", "Workshops", "Achievements", "Technical", "Announcements"]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch blogs from the server
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBlogs();
  }, []);

  // Filter blog posts based on search term and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredRef = useRef<HTMLDivElement>(null)
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.2 })

  const postsRef = useRef<HTMLDivElement>(null)
  const postsInView = useInView(postsRef, { once: true, amount: 0.2 })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <WebPageJsonLd
        title="IEEE PESCE Blog"
        description="Explore articles, technical content, and event highlights from IEEE PESCE Student Branch. Stay updated with the latest from our student community."
        url="/blog"
        image="/blog/ieee-pesce-hosts-successful-hackathon-1744566886290.jpg"
      />
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-gradient-to-b from-blue-950 to-black">
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
                IEEE PESCE Blog
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Stay updated with the latest news, events, and technical articles from IEEE PESCE Student Branch.
              </p>

              {/* Search */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white pl-10 h-12 text-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Featured Posts */}
        <section ref={featuredRef} className="py-16 bg-gradient-to-b from-black to-blue-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">
                Featured <span className="text-blue-400">Articles</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Read our latest featured articles and stay informed about IEEE PESCE activities.
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-300">Loading featured articles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {blogPosts
                  .filter((post) => post.featured)
                  .map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-blue-950/30 rounded-xl overflow-hidden border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300 group h-full flex flex-col"
                    >
                      <div className="relative h-64">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {post.category}
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 mb-4 flex-grow">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <User size={16} />
                          <span className="text-sm">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Calendar size={16} />
                          <span className="text-sm">{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 mb-4">
                          <Clock size={16} />
                          <span className="text-sm">{post.readTime}</span>
                        </div>
                        <Link href={post.articleUrl || `/blog/${post.id}`} 
                          className="mt-auto"
                          target={post.articleUrl ? "_blank" : "_self"}
                        >
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            {post.articleUrl ? "Read Full Article" : "View Details"}
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* All Posts */}
        <section ref={postsRef} className="py-16 bg-blue-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={postsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">
                Latest <span className="text-blue-400">Articles</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">Browse all our articles and filter by category.</p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex justify-center mb-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2"
                  >
                    <Filter size={18} />
                    Category: {selectedCategory}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-blue-950 border-blue-800">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="hover:bg-blue-900/30"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={postsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-blue-950/20 rounded-xl overflow-hidden border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300 group h-full flex flex-col"
                  >
                    <div className="relative h-48">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 mb-4 flex-grow">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span className="text-sm">{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span className="text-sm">{post.readTime}</span>
                        </div>
                      </div>
                      <Link href={post.articleUrl || `/blog/${post.id}`} 
                        className="mt-auto"
                        target={post.articleUrl ? "_blank" : "_self"}
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          {post.articleUrl ? "Read Full Article" : "View Details"}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No articles found matching your search criteria.</p>
                </div>
              )}
            </div>

            {/* Pagination - Just for UI, not functional in this example */}
            <div className="flex justify-center mt-12">
              <div className="flex bg-blue-950/30 rounded-lg p-1">
                <button className="px-4 py-2 rounded-md bg-blue-600 text-white">1</button>
                <button className="px-4 py-2 rounded-md text-gray-300 hover:text-white">2</button>
                <button className="px-4 py-2 rounded-md text-gray-300 hover:text-white">3</button>
                <button className="px-4 py-2 rounded-md text-gray-300 hover:text-white">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-gradient-to-b from-blue-950 to-black">
          <div className="container mx-auto px-4">
            <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Subscribe to Our <span className="text-blue-400">Newsletter</span>
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Stay updated with the latest articles, events, and announcements from IEEE PESCE. We'll send you a
                  monthly digest of our activities.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-blue-900/20 border-blue-900/50 focus:border-blue-500 text-white h-12"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 md:w-auto w-full">Subscribe</Button>
              </div>
              <p className="text-gray-400 text-sm mt-4 text-center">
                We respect your privacy. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Write for Us */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">
                  Write for <span className="text-blue-400">IEEE PESCE</span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Are you passionate about technology and enjoy writing? We welcome contributions from students, faculty,
                  and IEEE members.
                </p>
                <p className="text-gray-300 mb-6">
                  Share your technical knowledge, project experiences, or insights about the latest technological trends
                  with our community.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="https://forms.gle/M3B1yUdEYziHNYJD8" target="_blank" rel="noopener noreferrer">
                    Submit an Article
                  </Link>
                </Button>
              </div>

              <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Article Guidelines</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">1</span>
                    </div>
                    <p>Articles should be related to technology, engineering, or IEEE activities.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">2</span>
                    </div>
                    <p>Content should be original and not published elsewhere.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">3</span>
                    </div>
                    <p>Ideal length is 800-1500 words with relevant images or diagrams.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-900/30 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-400 text-sm font-bold">4</span>
                    </div>
                    <p>All submissions will be reviewed by our editorial team before publication.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

