import { NextResponse } from 'next/server';
import { getBlogPosts, addBlogPost } from '@/app/lib/blogUtils';

export async function GET() {
  try {
    const blogs = getBlogPosts();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const blogData = await request.json();
    const newBlog = addBlogPost(blogData);
    
    if (!newBlog) {
      return NextResponse.json(
        { error: 'Failed to add blog post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error adding blog post:', error);
    return NextResponse.json(
      { error: 'Failed to add blog post' },
      { status: 500 }
    );
  }
} 