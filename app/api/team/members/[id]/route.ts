import { NextResponse } from 'next/server';
import { updateTeamMember, deleteTeamMember } from '@/app/lib/teamUtils';

// PUT handler to update a team member
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { name, position, department, year, imagePath, linkedinUrl } = await request.json();
    
    const updatedMember = updateTeamMember(id, {
      name,
      position,
      department,
      year,
      imagePath,
      linkedinUrl
    });
    
    if (!updatedMember) {
      return NextResponse.json(
        { error: 'Team member not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a team member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const success = deleteTeamMember(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Team member not found or delete failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Team member deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
} 