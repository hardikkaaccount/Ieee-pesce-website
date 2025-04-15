import { NextRequest, NextResponse } from 'next/server';
import { moveEventToPast } from '@/app/lib/eventsUtils';

// POST /api/events/move-to-past/[id] - Move an event from upcoming to past events
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id, 10);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    const success = await moveEventToPast(eventId);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to move event to past or event not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Failed to move event ${params.id} to past:`, error);
    return NextResponse.json(
      { error: 'Failed to move event to past' },
      { status: 500 }
    );
  }
} 