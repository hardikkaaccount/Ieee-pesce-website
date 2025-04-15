import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET /api/images/gallery - Get all gallery images
export async function GET(request: NextRequest) {
  try {
    const galleryDir = path.join(process.cwd(), 'public/gallery');
    
    // Check if directory exists
    if (!fs.existsSync(galleryDir)) {
      return NextResponse.json({ 
        images: [],
        message: 'Gallery directory not found' 
      });
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(galleryDir);
    
    // Filter for image files (jpg, jpeg, png, gif)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });
    
    // Create paths relative to the public directory (for use in <Image> components)
    const imagePaths = imageFiles.map(file => `/gallery/${file}`);
    
    return NextResponse.json({ images: imagePaths });
  } catch (error) {
    console.error('Failed to get gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to get gallery images' },
      { status: 500 }
    );
  }
} 