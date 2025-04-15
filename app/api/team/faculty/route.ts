import { NextRequest, NextResponse } from 'next/server';
import { addFaculty } from '@/app/lib/teamUtils';

// POST handler to add a new faculty member
export async function POST(request: NextRequest) {
  try {
    const { name, position, role, description, imagePath } = await request.json();
    
    // Add the new faculty member
    const newFaculty = addFaculty({
      name,
      position,
      role,
      description,
      imagePath
    });
    
    if (!newFaculty) {
      return NextResponse.json(
        { error: 'Failed to add faculty member' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(newFaculty);
  } catch (error) {
    console.error('Error adding faculty member:', error);
    return NextResponse.json(
      { error: 'Failed to add faculty member' },
      { status: 500 }
    );
  }
} 