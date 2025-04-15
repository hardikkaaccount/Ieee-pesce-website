import fs from 'fs';
import path from 'path';

// Path to the settings data JSON file
const settingsFilePath = path.join(process.cwd(), 'app', 'data', 'settings.json');

// Settings type
export type ChapterMember = {
  name: string;
  role: string;
  image: string;
};

export type ChapterEvent = {
  title: string;
  date: string;
  description: string;
};

export type ChapterProject = {
  title: string;
  description: string;
};

export type Chapter = {
  id: string;
  name: string;
  description: string;
  projects: ChapterProject[];
  events: ChapterEvent[];
  team: ChapterMember[];
};

export type WebsiteSettings = {
  membershipFormUrl: string;
  membershipFee: string;
  chapters: Record<string, Chapter>;
  // Add any other global settings here as needed
};

// Define the interface for website settings
export interface Settings {
  title: string;
  description: string;
  keywords: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  footerText: string;
  copyrightText: string;
}

const DATA_DIR = path.join(process.cwd(), 'app', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Default settings if none exist
const DEFAULT_SETTINGS: Settings = {
  title: 'IEEE PESCE Student Branch',
  description: 'Official website of IEEE PESCE Student Branch',
  keywords: 'IEEE, PESCE, engineering, student branch',
  logoUrl: '/images/logo.png',
  faviconUrl: '/favicon.ico',
  contactEmail: 'ieee@pesce.ac.in',
  contactPhone: '+91 1234567890',
  address: 'PES College of Engineering, Mandya, Karnataka',
  socialLinks: {
    facebook: 'https://facebook.com/ieeepesce',
    twitter: 'https://twitter.com/ieeepesce',
    instagram: 'https://instagram.com/ieeepesce',
    linkedin: 'https://linkedin.com/company/ieeepesce',
    youtube: 'https://youtube.com/ieeepesce'
  },
  footerText: 'IEEE PESCE Student Branch - Empowering Innovation',
  copyrightText: '© IEEE PESCE Student Branch'
};

/**
 * Get website settings
 */
export function getSettings(): Settings {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // If settings file doesn't exist, create it with default settings
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
      return DEFAULT_SETTINGS;
    }

    // Read and parse the settings file
    const settingsData = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(settingsData);
  } catch (error) {
    console.error('Error reading settings file:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Update website settings
 */
export function updateSettings(newSettings: Settings): Settings {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Merge with existing settings to ensure all fields are present
    const existingSettings = getSettings();
    const updatedSettings = { ...existingSettings, ...newSettings };

    // Write updated settings to file
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2));
    return updatedSettings;
  } catch (error) {
    console.error('Error updating settings file:', error);
    throw new Error('Failed to update settings');
  }
}

/**
 * Update a specific setting
 */
export function updateSetting<K extends keyof Settings>(
  key: K, 
  value: Settings[K]
): Settings {
  const currentSettings = getSettings();
  const updatedSettings = {
    ...currentSettings,
    [key]: value
  };
  
  return updateSettings(updatedSettings);
} 