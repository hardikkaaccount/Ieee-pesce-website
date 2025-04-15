import { NextRequest, NextResponse } from 'next/server';
import { getChapters, saveChapter } from '@/app/lib/chaptersUtils';
import { Chapter } from '@/app/lib/types';

// GET /api/chapters - Get all chapters
export async function GET(request: NextRequest) {
  try {
    const chapters = await getChapters();
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Failed to get chapters:', error);
    return NextResponse.json(
      { error: 'Failed to get chapters' },
      { status: 500 }
    );
  }
}

// POST /api/chapters - Create a new chapter
export async function POST(request: NextRequest) {
  try {
    const chapterData: Chapter = await request.json();
    
    // Validate required fields
    if (!chapterData.id || !chapterData.name || !chapterData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save the chapter
    const success = await saveChapter(chapterData);
    
    if (success) {
      return NextResponse.json(chapterData);
    } else {
      return NextResponse.json(
        { error: 'Failed to save chapter' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to create chapter:', error);
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    );
  }
} 