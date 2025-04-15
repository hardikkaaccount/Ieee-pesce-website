// Website configuration settings

type WebsiteSettings = {
  membershipFormUrl: string;
  membershipFee: string;
  originalFee?: string;
  // Chapters are now stored separately in chapters.json
}

// Default settings
const defaultSettings: WebsiteSettings = {
  membershipFormUrl: "https://forms.gle/HCxLcGRfDpvURwD46",
  membershipFee: "₹750",
  originalFee: "₹1500"
};

/**
 * Get website settings from localStorage or defaults
 */
export function getSettings(): WebsiteSettings {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  const savedSettings = localStorage.getItem('websiteSettings');
  
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (error) {
      console.error('Error parsing settings:', error);
      return defaultSettings;
    }
  }
  
  // Initialize with default settings if none exist
  localStorage.setItem('websiteSettings', JSON.stringify(defaultSettings));
  return defaultSettings;
}

/**
 * Save website settings to localStorage
 */
export function saveSettings(settings: WebsiteSettings): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem('websiteSettings', JSON.stringify(settings));
}

/**
 * Update a specific setting
 */
export function updateSetting<K extends keyof WebsiteSettings>(
  key: K, 
  value: WebsiteSettings[K]
): WebsiteSettings {
  const currentSettings = getSettings();
  const updatedSettings = {
    ...currentSettings,
    [key]: value
  };
  
  saveSettings(updatedSettings);
  return updatedSettings;
} 