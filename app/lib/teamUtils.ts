import fs from 'fs';
import path from 'path';

// Define team member and faculty interfaces
export interface Member {
  id: string;
  name: string;
  position: string;
  department: string;
  year: string;
  imagePath: string;
  linkedinUrl: string;
}

export interface Faculty {
  id: string;
  name: string;
  position: string;
  role: string;
  description: string;
  imagePath: string;
}

interface TeamData {
  members: Member[];
  faculty: Faculty[];
}

// Path to the team data JSON file
const dataFilePath = path.join(process.cwd(), 'app/data/team.json');

// Function to get team data from JSON file
export function getTeamData(): TeamData {
  try {
    // Make sure the data directory exists
    const dataDir = path.join(process.cwd(), 'app/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Check if file exists, if not create with default data
    if (!fs.existsSync(dataFilePath)) {
      const defaultData: TeamData = { members: [], faculty: [] };
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents) as TeamData;
  } catch (error) {
    console.error('Error reading team data:', error);
    return { members: [], faculty: [] };
  }
}

// Function to save team data to the JSON file
function saveTeamData(data: TeamData): boolean {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving team data:', error);
    return false;
  }
}

// Function to get all team members
export function getTeamMembers(): Member[] {
  const data = getTeamData();
  return data.members;
}

// Function to get all faculty
export function getFaculty(): Faculty[] {
  const data = getTeamData();
  return data.faculty;
}

// Function to add a new team member
export function addTeamMember(member: Omit<Member, 'id'>): Member | null {
  try {
    const data = getTeamData();
    
    // Generate a new ID
    const newId = `member-${Date.now()}`;
    
    // Create the new member
    const newMember: Member = {
      ...member,
      id: newId,
    };
    
    // Add to the array and save
    data.members.push(newMember);
    saveTeamData(data);
    
    return newMember;
  } catch (error) {
    console.error('Error adding team member:', error);
    return null;
  }
}

// Function to update an existing team member
export function updateTeamMember(id: string, member: Omit<Member, 'id'>): Member | null {
  try {
    const data = getTeamData();
    
    // Find the index of the member to update
    const index = data.members.findIndex(m => m.id === id);
    
    if (index === -1) return null;
    
    // Update the member
    const updatedMember: Member = {
      ...member,
      id,
    };
    
    data.members[index] = updatedMember;
    saveTeamData(data);
    
    return updatedMember;
  } catch (error) {
    console.error('Error updating team member:', error);
    return null;
  }
}

// Function to delete a team member
export function deleteTeamMember(id: string): boolean {
  try {
    const data = getTeamData();
    
    // Filter out the member with the given ID
    data.members = data.members.filter(member => member.id !== id);
    
    return saveTeamData(data);
  } catch (error) {
    console.error('Error deleting team member:', error);
    return false;
  }
}

// Function to add a faculty member
export function addFaculty(faculty: Omit<Faculty, 'id'>): Faculty | null {
  try {
    const data = getTeamData();
    
    // Generate a new ID
    const newId = `faculty-${Date.now()}`;
    
    // Create the new faculty
    const newFaculty: Faculty = {
      ...faculty,
      id: newId,
    };
    
    // Add to the array and save
    data.faculty.push(newFaculty);
    saveTeamData(data);
    
    return newFaculty;
  } catch (error) {
    console.error('Error adding faculty:', error);
    return null;
  }
}

// Function to update an existing faculty
export function updateFaculty(id: string, faculty: Omit<Faculty, 'id'>): Faculty | null {
  try {
    const data = getTeamData();
    
    // Find the index of the faculty to update
    const index = data.faculty.findIndex(f => f.id === id);
    
    if (index === -1) return null;
    
    // Update the faculty
    const updatedFaculty: Faculty = {
      ...faculty,
      id,
    };
    
    data.faculty[index] = updatedFaculty;
    saveTeamData(data);
    
    return updatedFaculty;
  } catch (error) {
    console.error('Error updating faculty:', error);
    return null;
  }
}

// Function to delete a faculty
export function deleteFaculty(id: string): boolean {
  try {
    const data = getTeamData();
    
    // Filter out the faculty with the given ID
    data.faculty = data.faculty.filter(faculty => faculty.id !== id);
    
    return saveTeamData(data);
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return false;
  }
} 