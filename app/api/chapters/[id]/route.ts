import { NextRequest, NextResponse } from 'next/server';
import { getChapter, saveChapter, deleteChapter } from '@/app/lib/chaptersUtils';
import { Chapter } from '@/app/lib/types';

// GET /api/chapters/[id] - Get a specific chapter
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapter = await getChapter(params.id);
    
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(chapter);
  } catch (error) {
    console.error(`Failed to get chapter ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to get chapter' },
      { status: 500 }
    );
  }
}

// PUT /api/chapters/[id] - Update a chapter
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterData: Chapter = await request.json();
    
    // Ensure ID in the URL matches the ID in the body
    if (params.id !== chapterData.id) {
      return NextResponse.json(
        { error: 'Chapter ID mismatch' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!chapterData.name || !chapterData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if chapter exists
    const existingChapter = await getChapter(params.id);
    if (!existingChapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }
    
    // Update the chapter
    const success = await saveChapter(chapterData);
    
    if (success) {
      return NextResponse.json(chapterData);
    } else {
      return NextResponse.json(
        { error: 'Failed to update chapter' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Failed to update chapter ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    );
  }
}

// DELETE /api/chapters/[id] - Delete a chapter
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if chapter exists
    const existingChapter = await getChapter(params.id);
    if (!existingChapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }
    
    // Delete the chapter
    const success = await deleteChapter(params.id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete chapter' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Failed to delete chapter ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
} 