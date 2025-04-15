import { NextRequest, NextResponse } from 'next/server';
import { getGalleryItems, saveGalleryItem, generateGalleryItemId } from '@/app/lib/galleryUtils';
import { GalleryItem } from '@/app/lib/galleryUtils';

// GET /api/gallery - Get all gallery items
export async function GET(request: NextRequest) {
  try {
    const galleryItems = await getGalleryItems();
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Failed to get gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to get gallery items' },
      { status: 500 }
    );
  }
}

// POST /api/gallery - Create a new gallery item
export async function POST(request: NextRequest) {
  try {
    const galleryData: Omit<GalleryItem, 'id'> = await request.json();
    
    // Validate required fields
    if (!galleryData.title || !galleryData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate a new ID
    const newId = generateGalleryItemId();
    const newGalleryItem: GalleryItem = { 
      ...galleryData, 
      id: newId,
      // Ensure images is an array
      images: Array.isArray(galleryData.images) ? galleryData.images : [],
      // If no thumbnail specified, use the first image or empty string
      thumbnail: galleryData.thumbnail || (galleryData.images && galleryData.images.length > 0 ? galleryData.images[0] : '')
    };
    
    // Save the gallery item
    const success = await saveGalleryItem(newGalleryItem);
    
    if (success) {
      return NextResponse.json(newGalleryItem);
    } else {
      return NextResponse.json(
        { error: 'Failed to save gallery item' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to create gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
} 