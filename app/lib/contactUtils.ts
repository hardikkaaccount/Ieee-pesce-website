import fs from 'fs';
import path from 'path';

// Path to the contact data JSON file
const contactFilePath = path.join(process.cwd(), 'app/data/contact.json');

// Contact information type
export type ContactInfo = {
  address: string;
  email: string;
  phone: string;
  mapLocation: {
    center: { 
      lat: number; 
      lng: number; 
    };
    zoom: number;
  };
  socialMedia: {
    instagram: string;
    linkedin: string;
    twitter: string;
    facebook: string;
  };
};

/**
 * Get contact information from JSON file
 */
export function getContactInfo(): ContactInfo {
  try {
    // Read the contact.json file
    const fileData = fs.readFileSync(contactFilePath, 'utf8');
    // Parse the JSON data
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading contact data:', error);
    throw new Error('Failed to read contact data');
  }
}

/**
 * Update contact information in JSON file
 */
export function updateContactInfo(contactInfo: ContactInfo): ContactInfo {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(contactFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write the updated contact info to the file
    fs.writeFileSync(
      contactFilePath,
      JSON.stringify(contactInfo, null, 2),
      'utf8'
    );
    
    return contactInfo;
  } catch (error) {
    console.error('Error updating contact data:', error);
    throw new Error('Failed to update contact data');
  }
} 