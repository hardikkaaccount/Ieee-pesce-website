import { BlogPost, getBlogPosts } from '../app/lib/blogUtils';

/**
 * Get a blog post by its ID
 * @param id The ID of the blog post as a string
 * @returns The blog post or undefined if not found
 */
export async function getBlogById(id: string): Promise<BlogPost | undefined> {
  try {
    // Convert string ID to number since the data model uses number IDs
    const numericId = parseInt(id, 10);
    
    // If ID isn't a valid number, return undefined
    if (isNaN(numericId)) {
      return undefined;
    }
    
    const blogs = getBlogPosts();
    return blogs.find(blog => blog.id === numericId);
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return undefined;
  }
} 