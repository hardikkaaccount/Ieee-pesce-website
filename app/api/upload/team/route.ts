import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';

// POST /api/upload/team - Upload team/faculty images
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const prefix = formData.get('prefix') as string || 'team'; // 'team' or 'faculty'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!['team', 'faculty'].includes(prefix)) {
      return NextResponse.json(
        { error: 'Invalid prefix, must be "team" or "faculty"' },
        { status: 400 }
      );
    }
    
    // Create a unique filename
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
    const originalFilename = file.name.replace(/\s+/g, '_').toLowerCase();
    const filename = `${uniqueId}_${originalFilename}`;
    
    // Ensure the directory exists
    const uploadDir = path.join(process.cwd(), 'public', prefix);
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Path where the file will be stored
    const filepath = path.join(uploadDir, filename);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write the file to disk
    await writeFile(filepath, buffer);
    
    // Return the path that can be used in Image components
    const publicPath = `/${prefix}/${filename}`;
    
    return NextResponse.json({
      success: true,
      path: publicPath
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
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