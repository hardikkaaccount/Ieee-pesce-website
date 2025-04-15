// Type definitions for the application

export type ChapterMember = {
  name: string;
  role: string;
  image: string;
}

export type ChapterEvent = {
  title: string;
  date: string;
  description: string;
}

export type ChapterProject = {
  title: string;
  description: string;
}

export type Chapter = {
  id: string;
  name: string;
  description: string;
  projects: ChapterProject[];
  events: ChapterEvent[];
  team: ChapterMember[];
} 