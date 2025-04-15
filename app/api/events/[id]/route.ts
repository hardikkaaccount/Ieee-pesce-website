import { NextRequest, NextResponse } from 'next/server';
import { getEvent, saveEvent, deleteEvent, getEvents, getPastEvents } from '@/app/lib/eventsUtils';
import { Event } from '@/app/lib/eventsUtils';

// GET /api/events/[id] - Get a specific event
export async function GET(
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
    
    const event = await getEvent(eventId);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error(`Failed to get event ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to get event' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update an event
export async function PUT(
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
    
    const eventData: Event = await request.json();
    const url = new URL(request.url);
    const isPast = url.searchParams.get('past') === 'true';
    
    // Ensure ID in URL matches ID in body
    if (eventId !== eventData.id) {
      return NextResponse.json(
        { error: 'Event ID mismatch' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!eventData.title || !eventData.date || !eventData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if event exists
    const existingEvent = await getEvent(eventId);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Determine if the event is a past event or upcoming event
    // If not specified in query, check both collections
    if (isPast === undefined) {
      const pastEvents = await getPastEvents();
      isPast = pastEvents.some(e => e.id === eventId);
    }
    
    // Update the event
    const success = await saveEvent(eventData, isPast);
    
    if (success) {
      return NextResponse.json(eventData);
    } else {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Failed to update event ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete an event
export async function DELETE(
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
    
    const url = new URL(request.url);
    const isPast = url.searchParams.get('past') === 'true';
    
    // Check if event exists
    const existingEvent = await getEvent(eventId);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Determine if the event is a past event or upcoming event
    // If not specified in query, check both collections
    let eventIsPast = isPast;
    if (eventIsPast === undefined) {
      const pastEvents = await getPastEvents();
      eventIsPast = pastEvents.some(e => e.id === eventId);
    }
    
    // Delete the event
    const success = await deleteEvent(eventId, eventIsPast);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Failed to delete event ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 