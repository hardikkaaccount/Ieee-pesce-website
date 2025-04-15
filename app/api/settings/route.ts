import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings, Settings } from '@/app/lib/settingsUtils';

// GET /api/settings - Retrieve website settings
export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update website settings
export async function PUT(request: NextRequest) {
  try {
    const newSettings: Settings = await request.json();
    
    // Validate required fields
    if (!newSettings.title || !newSettings.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    const updatedSettings = updateSettings(newSettings);
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 