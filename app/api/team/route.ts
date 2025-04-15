import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Type definitions
interface Member {
  id: string;
  name: string;
  position: string;
  department: string;
  year: string;
  imagePath: string;
  linkedinUrl: string;
}

interface Faculty {
  id: string;
  name: string;
  position: string;
  role: string;
  description: string;
  imagePath: string;
}

// Path to team data file
const teamDataPath = path.join(process.cwd(), 'app/data/team.json');

// Initialize data file if it doesn't exist
function initializeDataFile() {
  const dataDir = path.join(process.cwd(), 'app/data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create file with default data if it doesn't exist
  if (!fs.existsSync(teamDataPath)) {
    const defaultData = {
      members: [],
      faculty: []
    };
    
    fs.writeFileSync(teamDataPath, JSON.stringify(defaultData, null, 2));
  }
}

// Read team data
function getTeamData() {
  initializeDataFile();
  
  try {
    const data = fs.readFileSync(teamDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading team data:', error);
    return { members: [], faculty: [] };
  }
}

// Save team data
function saveTeamData(data: { members: Member[], faculty: Faculty[] }) {
  try {
    fs.writeFileSync(teamDataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving team data:', error);
    return false;
  }
}

// GET /api/team - Get all team data
export async function GET() {
  try {
    const teamData = getTeamData();
    return NextResponse.json(teamData);
  } catch (error) {
    console.error('Error getting team data:', error);
    return NextResponse.json(
      { error: 'Failed to get team data' },
      { status: 500 }
    );
  }
}

// POST /api/team - Save team data
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate data
    if (!data.members || !Array.isArray(data.members) || 
        !data.faculty || !Array.isArray(data.faculty)) {
      return NextResponse.json(
        { error: 'Invalid team data format' },
        { status: 400 }
      );
    }
    
    // Save data
    const success = saveTeamData(data);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to save team data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving team data:', error);
    return NextResponse.json(
      { error: 'Failed to save team data' },
      { status: 500 }
    );
  }
} 