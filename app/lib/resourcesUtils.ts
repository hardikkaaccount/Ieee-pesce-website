import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface Resource {
  id: string;
  title: string;
  type: string; // 'pdf', 'link', 'video', etc.
  category: string; // 'slides', 'papers', 'tutorials', etc.
  link: string;
  description?: string;
  thumbnail?: string;
  dateAdded?: string;
  tags?: string[];
  date?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Path to resources.json
const dataDir = path.join(process.cwd(), 'app', 'data');
const resourcesPath = path.join(dataDir, 'resources.json');

// Default resources if none exist
const DEFAULT_RESOURCES: Resource[] = [];

// Get all resources from JSON file
export function getResources(): Resource[] {
  try {
    // Ensure the data directory exists
    // Create directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create empty resources file if it doesn't exist
    if (!fs.existsSync(resourcesPath)) {
      fs.writeFileSync(resourcesPath, JSON.stringify([], null, 2));
      return [];
    }

    // Read and parse resources file
    const resourcesData = fs.readFileSync(resourcesPath, 'utf8');
    return JSON.parse(resourcesData);
  } catch (error) {
    console.error('Error reading resources:', error);
    return [];
  }
}

// Save resources to JSON file
export function updateResources(resources: Resource[]): Resource[] {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write resources to file
    fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2));
    
    return resources;
  } catch (error) {
    console.error('Error updating resources:', error);
    throw new Error('Failed to update resources');
  }
}

// Add a new resource
export function addResource(resource: Omit<Resource, 'id' | 'dateAdded'>): Resource {
  try {
    const resources = getResources();
    
    // Create new resource with ID and date
    const newResource: Resource = {
      ...resource,
      id: uuidv4(),
      dateAdded: new Date().toISOString(),
    };
    
    // Add to resources and save
    resources.push(newResource);
    updateResources(resources);
    
    return newResource;
  } catch (error) {
    console.error('Error adding resource:', error);
    throw new Error('Failed to add resource');
  }
}

// Update an existing resource
export function updateResource(id: string, resourceUpdate: Partial<Resource>): Resource | null {
  try {
    const resources = getResources();
    const resourceIndex = resources.findIndex(res => res.id === id);
    
    if (resourceIndex === -1) {
      return null;
    }
    
    // Update resource
    const updatedResource = {
      ...resources[resourceIndex],
      ...resourceUpdate,
    };
    
    resources[resourceIndex] = updatedResource;
    updateResources(resources);
    
    return updatedResource;
  } catch (error) {
    console.error('Error updating resource:', error);
    throw new Error('Failed to update resource');
  }
}

// Delete a resource
export function deleteResource(id: string): boolean {
  try {
    const resources = getResources();
    const resourceIndex = resources.findIndex(res => res.id === id);
    
    if (resourceIndex === -1) {
      return false;
    }
    
    // Remove resource
    resources.splice(resourceIndex, 1);
    updateResources(resources);
    
    return true;
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw new Error('Failed to delete resource');
  }
}

// Get resource by ID
export function getResourceById(id: string): Resource | null {
  try {
    const resources = getResources();
    const resource = resources.find(r => r.id === id);
    return resource || null;
  } catch (error) {
    console.error('Error getting resource by ID:', error);
    return null;
  }
} 