import fs from 'fs';
import path from 'path';

// Gallery item type definition
export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  images: string[];
  thumbnail: string;
}

// Path to the JSON file
const galleryFilePath = path.join(process.cwd(), 'app/data/gallery.json');

// Default gallery data
export const defaultGalleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "IEEE Day Celebration",
    category: "Events",
    date: "October 1, 2023",
    location: "PESCE Campus",
    description: "Annual IEEE Day celebration with technical activities, games, and networking.",
    images: ["/placeholder.svg?height=600&width=800&text=IEEE+Day"],
    thumbnail: "/placeholder.svg?height=600&width=800&text=IEEE+Day"
  },
  {
    id: "2",
    title: "AI Workshop",
    category: "Workshops",
    date: "September 28, 2023",
    location: "CS Department, PESCE",
    description: "Hands-on workshop on artificial intelligence and machine learning fundamentals.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=AI+Workshop+Image+2",
    ],
    thumbnail: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "3",
    title: "Industrial Visit to ISRO",
    category: "Industrial Visits",
    date: "June 15, 2023",
    location: "ISRO, Bangalore",
    description: "Educational visit to Indian Space Research Organization.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=ISRO+Visit+Image+2",
    ],
    thumbnail: "/placeholder.svg?height=600&width=800",
  }
];

// Ensure the data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'app/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize the JSON file with default data if it doesn't exist
function initializeDataFile() {
  ensureDataDirectory();
  if (!fs.existsSync(galleryFilePath)) {
    fs.writeFileSync(galleryFilePath, JSON.stringify(defaultGalleryItems, null, 2));
  }
}

// Get all gallery items
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    initializeDataFile();
    const data = fs.readFileSync(galleryFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading gallery data:', error);
    return defaultGalleryItems;
  }
}

// Get a specific gallery item by ID
export async function getGalleryItem(id: string): Promise<GalleryItem | null> {
  try {
    const galleryItems = await getGalleryItems();
    const item = galleryItems.find(item => item.id === id);
    return item || null;
  } catch (error) {
    console.error(`Error getting gallery item ${id}:`, error);
    return null;
  }
}

// Save all gallery items
export async function saveGalleryItems(items: GalleryItem[]): Promise<boolean> {
  try {
    ensureDataDirectory();
    fs.writeFileSync(galleryFilePath, JSON.stringify(items, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving gallery data:', error);
    return false;
  }
}

// Add or update a gallery item
export async function saveGalleryItem(item: GalleryItem): Promise<boolean> {
  try {
    const galleryItems = await getGalleryItems();
    const existingIndex = galleryItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      galleryItems[existingIndex] = item;
    } else {
      galleryItems.push(item);
    }
    
    return await saveGalleryItems(galleryItems);
  } catch (error) {
    console.error(`Error saving gallery item ${item.id}:`, error);
    return false;
  }
}

// Delete a gallery item
export async function deleteGalleryItem(id: string): Promise<boolean> {
  try {
    const galleryItems = await getGalleryItems();
    const filteredItems = galleryItems.filter(item => item.id !== id);
    
    if (filteredItems.length !== galleryItems.length) {
      return await saveGalleryItems(filteredItems);
    }
    
    return false;
  } catch (error) {
    console.error(`Error deleting gallery item ${id}:`, error);
    return false;
  }
}

// Generate a unique ID for gallery items
export function generateGalleryItemId(): string {
  return Date.now().toString();
} 