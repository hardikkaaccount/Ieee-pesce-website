import type { Metadata } from "next"
import { BlogJsonLd } from "@/components/seo/json-ld"
import { getBlogById } from "@/app/lib/blogs"

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

// Add the BlogJsonLd component in the component return
export default async function BlogPage({ params }: Props) {
  const id = params.id
  
  // Existing code...
  
  const blog = await getBlogById(id)
  
  if (!blog) {
    return <div>Blog not found</div>
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
      {/* Existing component structure */}
      // ... existing code ...
    </>
  )
} 