import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

// POST /api/upload/gallery - Upload gallery images
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'Events';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create a unique filename
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
    const originalFilename = file.name.replace(/\s+/g, '_').toLowerCase();
    const filename = `${uniqueId}_${originalFilename}`;

    // Ensure the directory exists
    const categoryDir = path.join(process.cwd(), 'public/gallery', category);
    if (!fs.existsSync(categoryDir)) {
      await mkdir(categoryDir, { recursive: true });
    }
    
    // Path where the file will be stored
    const filepath = path.join(categoryDir, filename);
    
    // Create a buffer from the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write the file to disk
    await writeFile(filepath, buffer);
    
    // Return the relative path that can be used in <Image> components
    const relativePath = `/gallery/${category}/${filename}`;
    
    return NextResponse.json({ 
      success: true,
      path: relativePath 
    });
  } catch (error) {
    console.error('Failed to upload image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Configure to handle large files
export const config = {
  api: {
    bodyParser: false,
  },
}; 