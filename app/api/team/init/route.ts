import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getTeamData } from '@/app/lib/teamUtils';

// Default team data
const defaultTeamData = {
  faculty: [
    {
      id: "faculty1",
      name: "Dr. PUNITH KUMAR M B",
      position: "HOD, Dept. of Electronics and Communication Engineering",
      role: "Faculty Advisor, IEEE PESCE",
      description: "Dr. Punith Kumar M B brings extensive experience in academia and research. He has been instrumental in guiding the IEEE PESCE Student Branch and has helped shape it into one of the most active student branches in the region.",
      imagePath: "/punithk.jpg"
    }
  ],
  members: [
    {
      id: "member-1",
      name: "Prarthana Sridhar",
      position: "Chairperson",
      department: "Electrical & Electronics Engineering",
      year: "3rd Year",
      imagePath: "/Prarthana_S_Ji.png?height=100&width=100",
      linkedinUrl: "http://linkedin.com/in/prarthana-sridhar-7a1813266"
    },
    {
      id: "member-2",
      name: "Meera Devi Raval",
      position: "Vice Chairperson",
      department: "Electronics & Communication Engineering",
      year: "3rd Year",
      imagePath: "/meera_devi_ji.jpeg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/meera-devi-raval/"
    },
    {
      id: "member-3",
      name: "Komal N",
      position: "General Secretary",
      department: "Artificial Intelligence & Machine Learning",
      year: "3rd Year",
      imagePath: "/IMG_20241124_124604 - Komal N.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/komalnjain"
    },
    {
      id: "member-4",
      name: "Navyashree C",
      position: "Joint Secretary",
      department: "Electronics & Communication Engineering",
      year: "3rd Year",
      imagePath: "/IMG_20241124_111252 - Navyashree.C..jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/navyashree-c-933774266"
    },
    {
      id: "member-5",
      name: "Janhavi R Namoshi",
      position: "Assistant Secretary",
      department: "Computer Science & Engineering",
      year: "1st Year",
      imagePath: "/jahnavi.png?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/janhavi-r-namoshi-46090933a"
    }
  ]
};

export async function GET() {
  try {
    // Make sure data directory exists
    const dataDir = path.join(process.cwd(), 'app/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Path to the JSON file
    const dataFilePath = path.join(process.cwd(), 'app/data/team.json');
    
    // Write default data to file
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultTeamData, null, 2));
    
    // Verify that the data can be read
    const verifiedData = getTeamData();
    
    return NextResponse.json({ 
      message: 'Team data initialized successfully',
      members: verifiedData.members.length,
      faculty: verifiedData.faculty.length
    });
  } catch (error) {
    console.error('Error initializing team data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize team data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
