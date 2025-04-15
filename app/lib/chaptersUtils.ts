import fs from 'fs';
import path from 'path';
import { Chapter, ChapterEvent, ChapterMember, ChapterProject } from './types';

// Path to the JSON file
const dataFilePath = path.join(process.cwd(), 'app/data/chapters.json');

// Default chapters data
export const defaultChapters: Record<string, Chapter> = {
  comsoc: {
    id: "comsoc",
    name: "Communication Society",
    description: "The IEEE Communication Society (ComSoc) is a student chapter focused on exploring the latest developments in communication technologies. It provides a platform for aspiring engineers to dive deep into wireless systems, network architectures, and signal processing. Through interactive sessions, collaborative projects, and industry exposure, the chapter aims to cultivate innovation and technical excellence among students.",
    projects: [
      {
        title: "CampusMesh: Building a Local Communication Network",
        description: "A hands-on project where students develop a working mesh network within campus to understand routing, data transmission, and peer-to-peer connectivity."
      },
      {
        title: "LoRa-based Smart Communication",
        description: "Designing an energy-efficient and long-range communication system using LoRa technology for real-time data transmission in smart applications."
      },
      {
        title: "Signal Processing using Python",
        description: "Application of Python libraries to process, filter, and visualize signals in real-time for understanding communication system behavior."
      },
      {
        title: "5G Use Case Simulations",
        description: "Simulation and analysis of real-world 5G applications such as smart traffic systems, remote surgeries, and autonomous networks using NS-3 or MATLAB."
      }
    ],
    events: [
      {
        title: "Future of 5G: A Panel Discussion",
        date: "February 17, 2025",
        description: "Expert talk on the future of 5G technology and its applications."
      },
      {
        title: "The Evolution of Mobile Networks",
        date: "March 5, 2025",
        description: "Expert talk on the future of 5G technology and its applications. Guest: Ms. Ava Sharma – Senior Network Architect at Ericsson India"
      },
      {
        title: "TechTalk: Satellite Communication & Space Networks",
        date: "March 22, 2025",
        description: "A knowledge-packed session on the role of satellite communication in global connectivity, covering technologies like Starlink, satellite orbits, and space-based internet infrastructure."
      },
      {
        title: "CodeComm: Build a Chat App in 3 Hours",
        date: "April 6, 2025",
        description: "A coding-based mini-workshop where participants collaboratively build a simple real-time chat application using socket programming, understanding the fundamentals of data transmission."
      }
    ],
    team: [
      {
        name: "Darshan Hegde",
        role: "Chapter Chair",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Darshan Hegde.jpg"
      },
      {
        name: "Harsha M",
        role: "Chapter Vice Chair",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Harsha Mohan.jpg"
      },
      {
        name: "Jashwanth",
        role: "Secretary",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Jashwanth .D.jpg"
      },
      {
        name: "Abhishek A R",
        role: "Treasurer",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Abhishek AR.jpg"
      },
      {
        name: "Sonu N",
        role: "Membership Development Chair",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - sonu Narendrababu.jpg"
      },
      {
        name: "Yashwanth P M",
        role: "Designer",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Yashwanth PM.jpg"
      }
    ]
  },
  wie: {
    id: "wie",
    name: "Women in Engineering (WIE)",
    description: "WIE (Women in Engineering) is a dedicated community under IEEE that aims to inspire, engage, and empower women in the field of engineering and technology. Our chapter works towards fostering inclusivity, breaking stereotypes, and creating a supportive environment for aspiring women engineers to thrive and lead. Through interactive events, impactful projects, and mentorship initiatives, WIE strives to bridge the gender gap and promote equal opportunities in STEM.",
    projects: [
      {
        title: "Tech Her Way: Women in Coding",
        description: "A coding club specifically designed to help women engineering students develop programming skills in various languages and frameworks, with peer mentoring and collaborative project development."
      },
      {
        title: "STEM Career Guidance Program",
        description: "A structured program providing career guidance, resume building, interview preparation, and networking opportunities specifically tailored for women pursuing careers in engineering and technology."
      },
      {
        title: "Innovation Challenge for Women Engineers",
        description: "An annual innovation challenge that encourages women students to propose and develop technological solutions for real-world problems, with mentorship and resources provided."
      }
    ],
    events: [
      {
        title: "Panel Discussion on Empowering Women in Engineering",
        date: "February 19th, 2024",
        description: "An introductory session for the WIE chapter where experienced panelists from academia and industry shared insights on empowerment, diversity, and breaking societal barriers in the engineering domain. The event laid the foundation for future initiatives by encouraging open conversations and collaborative growth."
      },
      {
        title: "Tech Meets Therapy: AI's New Frontier in Mental Health",
        date: "March 8th, 2025",
        description: "Organized on International Women's Day, this event explored how AI is revolutionizing mental health care. Featuring experts in tech and psychology, the session emphasized the importance of emotional well-being among engineers and showcased innovative AI-based solutions aimed at mental health support, especially for women in STEM."
      }
    ],
    team: [
      {
        name: "Deepthi C Shekhar",
        role: "Chapter Chairperson",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Deepthi C Shekar.jpg"
      },
      {
        name: "Sinchana Satish Gowda",
        role: "Chapter Vice-Chairperson",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Sinchana S.jpg"
      },
      {
        name: "Minchu NC",
        role: "Secretary",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Minchu NC.jpg"
      },
      {
        name: "Sampada",
        role: "Joint Secretary",
        image: "/bd303069-b25a-4d17-980a-a15bb1a0a547 - Sam.jpg"
      }
    ]
  }
};

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
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultChapters, null, 2));
  }
}

// Get all chapters
export async function getChapters(): Promise<Record<string, Chapter>> {
  try {
    initializeDataFile();
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chapters data:', error);
    return defaultChapters;
  }
}

// Get a specific chapter by ID
export async function getChapter(id: string): Promise<Chapter | null> {
  try {
    const chapters = await getChapters();
    return chapters[id] || null;
  } catch (error) {
    console.error(`Error getting chapter ${id}:`, error);
    return null;
  }
}

// Save all chapters
export async function saveChapters(chapters: Record<string, Chapter>): Promise<boolean> {
  try {
    ensureDataDirectory();
    fs.writeFileSync(dataFilePath, JSON.stringify(chapters, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving chapters data:', error);
    return false;
  }
}

// Add or update a chapter
export async function saveChapter(chapter: Chapter): Promise<boolean> {
  try {
    const chapters = await getChapters();
    chapters[chapter.id] = chapter;
    return await saveChapters(chapters);
  } catch (error) {
    console.error(`Error saving chapter ${chapter.id}:`, error);
    return false;
  }
}

// Delete a chapter
export async function deleteChapter(id: string): Promise<boolean> {
  try {
    const chapters = await getChapters();
    if (chapters[id]) {
      delete chapters[id];
      return await saveChapters(chapters);
    }
    return false;
  } catch (error) {
    console.error(`Error deleting chapter ${id}:`, error);
    return false;
  }
} 