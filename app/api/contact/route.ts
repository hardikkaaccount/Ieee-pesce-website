import { NextResponse } from 'next/server';
import { getContactInfo, updateContactInfo } from '@/app/lib/contactUtils';
import type { ContactInfo } from '@/app/lib/contactUtils';

// GET handler to fetch contact information
export async function GET() {
  try {
    console.log('Attempting to fetch contact data...');
    const contactInfo = getContactInfo();
    
    console.log('Successfully fetched contact data');
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch contact data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT handler to update contact information
export async function PUT(request: Request) {
  try {
    const data = await request.json() as ContactInfo;
    console.log('Attempting to update contact data:', data);
    
    // Validate the required fields
    if (!data.address || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields: address, email, and phone are required' },
        { status: 400 }
      );
    }
    
    // Validate map location
    if (!data.mapLocation || !data.mapLocation.center || 
        typeof data.mapLocation.center.lat !== 'number' || 
        typeof data.mapLocation.center.lng !== 'number' ||
        typeof data.mapLocation.zoom !== 'number') {
      return NextResponse.json(
        { error: 'Invalid map location data' },
        { status: 400 }
      );
    }
    
    // Validate social media links
    if (!data.socialMedia || 
        !data.socialMedia.instagram || 
        !data.socialMedia.linkedin || 
        !data.socialMedia.twitter || 
        !data.socialMedia.facebook) {
      return NextResponse.json(
        { error: 'Missing required social media links' },
        { status: 400 }
      );
    }
    
    // Update the contact information
    const updatedContact = updateContactInfo(data);
    
    console.log('Successfully updated contact data');
    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update contact data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 