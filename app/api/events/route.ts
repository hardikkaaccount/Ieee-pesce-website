import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET /api/events - Get all events with optional pastEvents query parameter
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const isPast = url.searchParams.get('past') === 'true';
    
    // Determine which JSON file to read
    const filePath = path.join(process.cwd(), `app/data/${isPast ? 'pastEvents' : 'events'}.json`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json(
        { error: 'Events data file not found' },
        { status: 404 }
      );
    }
    
    // Read and parse the JSON file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const events = JSON.parse(fileContents);
    
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error reading events data:', error);
    return NextResponse.json(
      { error: 'Failed to load events data: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const isPast = url.searchParams.get('past') === 'true';
    
    // Validate required fields
    if (!body.title || !body.date || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Determine which JSON file to update
    const filePath = path.join(process.cwd(), `app/data/${isPast ? 'pastEvents' : 'events'}.json`);
    
    // Check if the file exists and create it with an empty array if it doesn't
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf8');
    }
    
    // Read existing events
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let events = JSON.parse(fileContents);
    
    // Generate a new ID (current max ID + 1 or default start)
    const maxId = events.length > 0 ? Math.max(...events.map((e: any) => e.id)) : (isPast ? 1000 : 0);
    const newId = maxId + 1;
    
    // Create the new event object
    const newEvent = {
      id: newId,
      ...body
    };
    
    // Add to events array
    events.push(newEvent);
    
    // Save updated events
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2), 'utf8');
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { error: 'Failed to create event: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 