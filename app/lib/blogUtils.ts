import fs from 'fs';
import path from 'path';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  articleUrl: string;
  detailsLink: string;
}

const BLOG_FILE_PATH = path.join(process.cwd(), 'app/data/blogs.json');

export const getBlogPosts = (): BlogPost[] => {
  try {
    const fileContent = fs.readFileSync(BLOG_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.blogs;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
};

export const saveBlogPosts = (blogs: BlogPost[]): boolean => {
  try {
    const data = { blogs };
    fs.writeFileSync(BLOG_FILE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving blog posts:', error);
    return false;
  }
};

export const addBlogPost = (newPost: Omit<BlogPost, 'id'>): BlogPost | null => {
  try {
    const blogs = getBlogPosts();
    const maxId = Math.max(...blogs.map(blog => blog.id), 0);
    const blogPost: BlogPost = {
      ...newPost,
      id: maxId + 1
    };
    blogs.push(blogPost);
    saveBlogPosts(blogs);
    return blogPost;
  } catch (error) {
    console.error('Error adding blog post:', error);
    return null;
  }
};

export const updateBlogPost = (id: number, updatedPost: Partial<BlogPost>): BlogPost | null => {
  try {
    const blogs = getBlogPosts();
    const index = blogs.findIndex(blog => blog.id === id);
    if (index === -1) return null;
    
    blogs[index] = { ...blogs[index], ...updatedPost };
    saveBlogPosts(blogs);
    return blogs[index];
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
};

export const deleteBlogPost = (id: number): boolean => {
  try {
    const blogs = getBlogPosts();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    return saveBlogPosts(filteredBlogs);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}; 