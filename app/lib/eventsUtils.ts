import fs from 'fs';
import path from 'path';

// Event type definition
export type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  registration: boolean;
  featured: boolean;
  attendees?: number;
  registrationLink?: string;
  detailsLink?: string;
}

// Path to the JSON files
const upcomingEventsFilePath = path.join(process.cwd(), 'app/data/events.json');
const pastEventsFilePath = path.join(process.cwd(), 'app/data/pastEvents.json');

// Default upcoming events data
export const defaultEvents: Event[] = [
  {
    id: 1,
    title: "TechVista 2023",
    description: "Annual technical symposium featuring workshops, competitions, and expert talks on emerging technologies.",
    date: "October 15, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium, PESCE",
    category: "Symposium",
    image: "/upcoming/tDay.jpg",
    registration: true,
    featured: true,
    attendees: 500
  },
  {
    id: 2,
    title: "Workshop on AI & Machine Learning",
    description: "Hands-on workshop covering the fundamentals and applications of AI and ML with practical sessions.",
    date: "November 5, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "CS Department, PESCE",
    category: "Workshop",
    image: "/upcoming/ai_workshop.jpeg",
    registration: true,
    featured: true,
    attendees: 150
  }
];

// Default past events data
export const defaultPastEvents: Event[] = [
  {
    id: 101,
    title: "Web Development Workshop",
    description: "Hands-on workshop on modern web development technologies including React, Node.js, and MongoDB.",
    date: "August 5, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "CS Department, PESCE",
    category: "Workshop",
    image: "/events/WOMweb.jpeg",
    registration: true,
    featured: false
  }
];

// Ensure the data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'app/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize the JSON files with default data if they don't exist
function initializeDataFiles() {
  ensureDataDirectory();
  
  if (!fs.existsSync(upcomingEventsFilePath)) {
    fs.writeFileSync(upcomingEventsFilePath, JSON.stringify(defaultEvents, null, 2));
  }
  
  if (!fs.existsSync(pastEventsFilePath)) {
    fs.writeFileSync(pastEventsFilePath, JSON.stringify(defaultPastEvents, null, 2));
  }
}

// Get all upcoming events
export async function getEvents(): Promise<Event[]> {
  try {
    initializeDataFiles();
    const data = fs.readFileSync(upcomingEventsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading upcoming events data:', error);
    return defaultEvents;
  }
}

// Get all past events
export async function getPastEvents(): Promise<Event[]> {
  try {
    initializeDataFiles();
    const data = fs.readFileSync(pastEventsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading past events data:', error);
    return defaultPastEvents;
  }
}

// Get a specific event by ID from either upcoming or past events
export async function getEvent(id: number): Promise<Event | null> {
  try {
    // Check upcoming events
    const upcomingEvents = await getEvents();
    let event = upcomingEvents.find(e => e.id === id);
    
    // If not found, check past events
    if (!event) {
      const pastEvents = await getPastEvents();
      event = pastEvents.find(e => e.id === id);
    }
    
    return event || null;
  } catch (error) {
    console.error(`Error getting event ${id}:`, error);
    return null;
  }
}

// Save all upcoming events
export async function saveEvents(events: Event[]): Promise<boolean> {
  try {
    ensureDataDirectory();
    fs.writeFileSync(upcomingEventsFilePath, JSON.stringify(events, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving upcoming events data:', error);
    return false;
  }
}

// Save all past events
export async function savePastEvents(events: Event[]): Promise<boolean> {
  try {
    ensureDataDirectory();
    fs.writeFileSync(pastEventsFilePath, JSON.stringify(events, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving past events data:', error);
    return false;
  }
}

// Add or update an event
export async function saveEvent(event: Event, isPast: boolean = false): Promise<boolean> {
  try {
    if (isPast) {
      const pastEvents = await getPastEvents();
      const existingIndex = pastEvents.findIndex(e => e.id === event.id);
      
      if (existingIndex >= 0) {
        pastEvents[existingIndex] = event;
      } else {
        pastEvents.push(event);
      }
      
      return await savePastEvents(pastEvents);
    } else {
      const upcomingEvents = await getEvents();
      const existingIndex = upcomingEvents.findIndex(e => e.id === event.id);
      
      if (existingIndex >= 0) {
        upcomingEvents[existingIndex] = event;
      } else {
        upcomingEvents.push(event);
      }
      
      return await saveEvents(upcomingEvents);
    }
  } catch (error) {
    console.error(`Error saving event ${event.id}:`, error);
    return false;
  }
}

// Delete an event
export async function deleteEvent(id: number, isPast: boolean = false): Promise<boolean> {
  try {
    if (isPast) {
      const pastEvents = await getPastEvents();
      const filteredEvents = pastEvents.filter(e => e.id !== id);
      
      if (filteredEvents.length !== pastEvents.length) {
        return await savePastEvents(filteredEvents);
      }
    } else {
      const upcomingEvents = await getEvents();
      const filteredEvents = upcomingEvents.filter(e => e.id !== id);
      
      if (filteredEvents.length !== upcomingEvents.length) {
        return await saveEvents(filteredEvents);
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    return false;
  }
}

// Move an event from upcoming to past
export async function moveEventToPast(id: number): Promise<boolean> {
  try {
    const upcomingEvents = await getEvents();
    const eventToMove = upcomingEvents.find(e => e.id === id);
    
    if (!eventToMove) {
      return false;
    }
    
    // Add to past events
    const pastEvents = await getPastEvents();
    pastEvents.push(eventToMove);
    
    // Remove from upcoming events
    const filteredUpcomingEvents = upcomingEvents.filter(e => e.id !== id);
    
    // Save both
    const savedPast = await savePastEvents(pastEvents);
    const savedUpcoming = await saveEvents(filteredUpcomingEvents);
    
    return savedPast && savedUpcoming;
  } catch (error) {
    console.error(`Error moving event ${id} to past:`, error);
    return false;
  }
}

// Generate a new unique ID for events
export function generateEventId(isPast: boolean = false): number {
  // Generate a random ID between 1-1000 for upcoming or 1001-2000 for past events
  const min = isPast ? 1001 : 1;
  const max = isPast ? 2000 : 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 