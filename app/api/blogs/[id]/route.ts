import { NextResponse } from 'next/server';
import { getBlogPosts, updateBlogPost, deleteBlogPost } from '@/app/lib/blogUtils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blogs = getBlogPosts();
    const blog = blogs.find(blog => blog.id === parseInt(params.id));
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const blogData = await request.json();
    
    const updatedBlog = updateBlogPost(id, blogData);
    
    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog post not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const success = deleteBlogPost(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Blog post not found or delete failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 