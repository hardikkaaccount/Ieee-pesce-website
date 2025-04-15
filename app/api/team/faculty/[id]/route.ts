import { NextResponse } from 'next/server';
import { updateFaculty, deleteFaculty } from '@/app/lib/teamUtils';

// PUT handler to update a faculty member
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { name, position, role, description, imagePath } = await request.json();
    
    const updatedFaculty = updateFaculty(id, {
      name,
      position,
      role,
      description,
      imagePath
    });
    
    if (!updatedFaculty) {
      return NextResponse.json(
        { error: 'Faculty member not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedFaculty);
  } catch (error) {
    console.error('Error updating faculty member:', error);
    return NextResponse.json(
      { error: 'Failed to update faculty member' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a faculty member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const success = deleteFaculty(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Faculty member not found or delete failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Faculty member deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting faculty member:', error);
    return NextResponse.json(
      { error: 'Failed to delete faculty member' },
      { status: 500 }
    );
  }
} 