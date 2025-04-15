"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { BlogPost } from '@/app/lib/blogUtils';

export default function BlogDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch blog post from API
    async function fetchBlogPost() {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          throw new Error('Blog post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBlogPost();
  }, [params.id]);

  if (loading) {
    return <div className="container mx-auto p-6 max-w-5xl">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <Link href="/blog">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{post.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="mb-8">
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative w-full h-64 sm:h-96">
          <Image 
            src={post.image || '/images/placeholder.jpg'}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg font-medium text-gray-700 mb-4">{post.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {post.articleUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Read the complete article:</h3>
              <Link href={post.articleUrl} target="_blank">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Read Full Article
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 