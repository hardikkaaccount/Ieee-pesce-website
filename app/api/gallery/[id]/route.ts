import { NextRequest, NextResponse } from 'next/server';
import { getGalleryItem, saveGalleryItem, deleteGalleryItem } from '@/app/lib/galleryUtils';
import { GalleryItem } from '@/app/lib/galleryUtils';

// GET /api/gallery/[id] - Get a specific gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galleryItem = await getGalleryItem(params.id);
    
    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error(`Failed to get gallery item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to get gallery item' },
      { status: 500 }
    );
  }
}

// PUT /api/gallery/[id] - Update a gallery item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // Store params.id in a local variable
    const galleryData: GalleryItem = await request.json();
    
    // Ensure ID in the URL matches the ID in the body
    if (id !== galleryData.id) {
      return NextResponse.json(
        { error: 'Gallery item ID mismatch' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!galleryData.title || !galleryData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if the gallery item exists
    const existingItem = await getGalleryItem(id);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    
    // Update the gallery item
    const updatedItem: GalleryItem = {
      ...galleryData,
      // Ensure images is an array
      images: Array.isArray(galleryData.images) ? galleryData.images : [],
      // If no thumbnail specified, use the first image or existing thumbnail
      thumbnail: galleryData.thumbnail || 
                (galleryData.images && galleryData.images.length > 0 ? 
                 galleryData.images[0] : existingItem.thumbnail)
    };
    
    const success = await saveGalleryItem(updatedItem);
    
    if (success) {
      return NextResponse.json(updatedItem);
    } else {
      return NextResponse.json(
        { error: 'Failed to update gallery item' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Failed to update gallery item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id] - Delete a gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // Store params.id in a local variable
    
    // Check if the gallery item exists
    const existingItem = await getGalleryItem(id);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    
    // Delete the gallery item
    const success = await deleteGalleryItem(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete gallery item' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Failed to delete gallery item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
} 