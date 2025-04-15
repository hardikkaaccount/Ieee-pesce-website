"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Trophy, Users, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Float,
  PerspectiveCamera,
  Text3D,
} from "@react-three/drei";
import type * as THREE from "three";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

// Type definitions for faculty and members
interface Faculty {
  id: string;
  name: string;
  position: string;
  role: string;
  description: string;
  imagePath: string;
}

interface Member {
  id: string;
  name: string;
  position: string;
  department: string;
  year: string;
  imagePath: string;
  linkedinUrl: string;
}

// Default faculty data
const defaultFaculty: Faculty = {
  id: "faculty1",
  name: "Dr. PUNITH KUMAR M B",
  position: "HOD, Dept. of Electronics and Communication Engineering",
  role: "Faculty Advisor, IEEE PESCE",
  description: "Dr. Punith Kumar M B brings extensive experience in academia and research. He has been instrumental in guiding the IEEE PESCE Student Branch and has helped shape it into one of the most active student branches in the region.",
  imagePath: "/punithk.jpg",
};

// Default committee members data
const defaultMembers: Member[] = [
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
    },
    {
      id: "member-6",
      name: "Tilak T Swamy",
      position: "Treasurer",
      department: "Electronics & Communication Engineering",
      year: "3rd Year",
      imagePath: "/tilak.jpeg?height=100&width=100",
      linkedinUrl: "#"
    },
    {
      id: "member-7",
      name: "Aryan Trivedi",
      position: "Web Master",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      imagePath: "/aryan trivedi.jpeg?height=100&width=100",
      linkedinUrl: "#"
    },
    {
      id: "member-8",
      name: "Darshan MS",
      position: "Assistant Web Master",
      department: "Information Science & Engineering",
      year: "2nd Year",
      imagePath: "/IMG_20240510_234724 - Darshan .m.s.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/darshan-m-s-a08170292"
    },
    {
      id: "member-9",
      name: "Mohammed Ubair",
      position: "Assistant Web Master",
      department: "Computer Science & Engineering",
      year: "1st Year",
      imagePath: "/IMG_20241023_232940 - Mohammad Ubair.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/m-ubair-9a3427220"
    },
    {
      id: "member-10",
      name: "Niranjan Dalapathy",
      position: "Membership Development Chair",
      department: "Electronics & Communication Engineering",
      year: "2nd Year",
      imagePath: "/1719205316202 - NIRANJAN N DALAPATHI.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/niranjan-n-dalapathi-b4330b2a1"
    },
    {
      id: "member-11",
      name: "Sudheendra Shenoy",
      position: "Director of Membership – I",
      department: "Computer Science & Data Science",
      year: "2nd Year",
      imagePath: "/IMG-20241124-WA0001 - Meera Rawal.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/b-sudhindra-shenoy-697023295"
    },
    {
      id: "member-12",
      name: "Adarsh M",
      position: "Director of Membership – III",
      department: "Computer Science & Engineering",
      year: "1st Year",
      imagePath: "/Picsart_24-10-02_12-19-57-692 - Adarsh M.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/adarsh-m-608b26315"
    },
    {
      id: "member-13",
      name: "Harshitha Shetty",
      position: "Director of Student Activities I",
      department: "Electrical & Electronics Engineering",
      year: "3rd Year",
      imagePath: "/IMG_20241126_112651 - Harshitha Shetty.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/harshitha-shetty-3a4749213"
    },
    {
      id: "member-14",
      name: "Spandana N",
      position: "Director of Student Activities II",
      department: "Computer Science & Data Science",
      year: "2nd Year",
      imagePath: "/Spandana.N..jpg?height=100&width=100",
      linkedinUrl: "#"
    },
    {
      id: "member-15",
      name: "Keerthana Indalker",
      position: "Director of Social Activities I",
      department: "Electronics & Communication Engineering",
      year: "3rd Year",
      imagePath: "/Keerthana Indalker - Keerthana Indalker.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/keerthana-indalker-a4388a276"
    },
    {
      id: "member-16",
      name: "Khushi V Kumar",
      position: "Director of Social Activities II",
      department: "Electronics & Communication Engineering",
      year: "3rd Year",
      imagePath: "/khushi.png?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/khushi-vishwakumar-a0a096267"
    },
    {
      id: "member-17",
      name: "Hardik Jain",
      position: "Director of Technical Activities",
      department: "Artificial Intelligence & Machine Learning",
      year: "3rd Year",
      imagePath: "/Hardik.jpeg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/hardikjain108"
    },
    {
      id: "member-18",
      name: "Roopa K",
      position: "Student Project Coordinator I",
      department: "Electrical & Electronics Engineering",
      year: "3rd Year",
      imagePath: "/WhatsApp Image 2024-11-24 at 08.35.51_c5b8bcbc - Roopa K.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/roopa-k-roopa-k-374769266"
    },
    {
      id: "member-19",
      name: "Poorvika KS",
      position: "Student Project Coordinator II",
      department: "Electronics & Communication Engineering",
      year: "2nd Year",
      imagePath: "/poorvika ks.jpeg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/poorvika-ks-76330630b"
    },
    {
      id: "member-20",
      name: "Darshan Hegde",
      position: "COMSOC Chairperson",
      department: "Electronics & Communication Engineering",
      year: "3rd Year",
      imagePath: "/Darshan Hegde.jpg?height=100&width=100",
      linkedinUrl: "https://in.linkedin.com/in/darshan-hegde-5b4b03265"
    },
    {
      id: "member-21",
      name: "Harsha Mohan",
      position: "COMSOC Vice Chairperson",
      department: "Information Science & Engineering",
      year: "2nd Year",
      imagePath: "/20240818_161659 - Harsha Mohan.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/harshamohan"
    },
    {
      id: "member-22",
      name: "Jashwanth D",
      position: "COMSOC Secretary",
      department: "Artificial Intelligence & Machine Learning",
      year: "2nd Year",
      imagePath: "/IMG-20241123-WA0114~2 - Jashwanth .D.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/jashwanth-d-a68777292"
    },
    {
      id: "member-23",
      name: "Abhishek AR",
      position: "COMSOC Treasurer",
      department: "Computer Science & Engineering",
      year: "2nd Year",
      imagePath: "/IMG_20241122_114642037 - Abhishek AR.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/abhishek-a-r-b234582a4"
    },
    {
      id: "member-24",
      name: "Sonu N",
      position: "COMSOC MDC",
      department: "Electronics & Communication Engineering",
      year: "2nd Year",
      imagePath: "/IMG_20240903_133935_917 - sonu Narendrababu.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/sonu-narendrababu-a70b76294"
    },
    {
      id: "member-25",
      name: "Deepthi C Shekhar",
      position: "WIE Chairperson",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      imagePath: "/Deepthi C Shekar.jpg?height=100&width=100",
      linkedinUrl: "#"
    },
    {
      id: "member-26",
      name: "Sinchana Satish Gowda",
      position: "WIE Vice Chairperson",
      department: "Electronics & Communication Engineering",
      year: "2nd Year",
      imagePath: "/ME - Sinchana S.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/sinchana-satish-gowda-93a7ba294"
    },
    {
      id: "member-27",
      name: "Minchu N C",
      position: "WIE Secretary",
      department: "Computer Science & Data Science",
      year: "2nd Year",
      imagePath: "/IMG-20240730-WA0029 - Minchu NC.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/minchu-n-c-a942142b7"
    },
    {
      id: "member-28",
      name: "Sampada",
      position: "WIE Join Secretary",
      department: "Computer Science & Engineering",
      year: "1st Year",
      imagePath: "/IMG-20240825-WA0040 - Sam.jpg?height=100&width=100",
      linkedinUrl: "#"
    },
    {
      id: "member-29",
      name: "Nilesh",
      position: "Chief Designer",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      imagePath: "/nilesh.jpeg?height=100&width=100",
      linkedinUrl: "#"
    },
    {
      id: "member-30",
      name: "Hrudhay M",
      position: "Assistant Designer -I",
      department: "Computer Science & Engineering",
      year: "2nd Year",
      imagePath: "/hurdhay m.jpeg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/hrudhay-h"
    },
    {
      id: "member-31",
      name: "Navaneeth M R",
      position: "Assistant Designer – II",
      department: "Electronics & Communication Engineering",
      year: "1st Year",
      imagePath: "/20241123_225010 - Navaneeth.M.R Navaneeth.M.R.png?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/navaneeth-m-r-navaneeth-m-r-899a9b333"
    },
    {
      id: "member-32",
      name: "Yashwanth PM",
      position: "Assistant Designer – III",
      department: "Electronics & Communication Engineering",
      year: "2nd Year",
      imagePath: "/IMG-20241029-WA0011 - Yashwanth PM.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/yashwanth-pm -2860932a4"
    },
    {
      id: "member-33",
      name: "Inchara Prakash",
      position: "Assistant Designer – IV",
      department: "Electrical & Electronics Engineering",
      year: "3rd Year",
      imagePath: "/Screenshot_20231231_215018_Photos~2 - Inchara Prakash.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/inchara-prakash-874814266"
    },
    {
      id: "member-34",
      name: "Raghuveer C",
      position: "Content Lead",
      department: "Computer Science & Business Systems",
      year: "2nd Year",
      imagePath: "/IMG_2806 - RAGHUVEER C GOWDA.jpeg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/raghuveer-c-gowda-882984293"
    },
    {
      id: "member-35",
      name: "Monish",
      position: "Chief Video Coordinator",
      department: "Computer Science & Business Systems",
      year: "2nd Year",
      imagePath: "/Screenshot_20241101_165345_Drive - Monish Gowda.jpg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/monish-gowda-7059ab2a7"
    },
    {
      id: "member-36",
      name: "Mohammed Ayaan",
      position: "Assistant Video editor I",
      department: "Computer Science & Data Science",
      year: "2nd Year",
      imagePath: "/Ayaan.png?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/mohammed-ayaan-066a2426a"
    },
    {
      id: "member-37",
      name: "Mohammed Aftab M Nadaf",
      position: "Assistant Video editor II",
      department: "Computer Science & Data Science",
      year: "2nd Year",
      imagePath: "/aftab.jpg?height=100&width=100",
      linkedinUrl: "#"
    },
    {
      id: "member-38",
      name: "Farhan",
      position: "Assistant Video editor III",
      department: "Artificial Intelligence & Machine Learning",
      year: "2nd Year",
      imagePath: "/farhan.png?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/farhan-khan-ghori-797b69299"
    },
    {
      id: "member-39",
      name: "Manju P",
      position: "Media Lead",
      department: "Computer Science & Business Systems",
      year: "2nd Year",
      imagePath: "/FullSizeRender - Manju P.jpeg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/manju-p-aa4a71326"
    },
    {
      id: "member-40",
      name: "Mirza Baig",
      position: "Social Media Coordinator",
      department: "Computer Science & Engineering",
      year: "2nd Year",
      imagePath: "/IMG_0942 - Mirza Shifran.jpeg?height=100&width=100",
      linkedinUrl: "https://www.linkedin.com/in/mirza-shifran-baig-a47020269"
    }
  ];

function FloatingText() {
  const mesh = useRef<THREE.Mesh>(null);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        ref={mesh}
        font="/fonts/Inter_Bold.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
        position={[-1.75, 0, 0]}
      >
        {/* About */}
        <meshStandardMaterial color="#0066A1" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Float>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true, amount: 0.1 });

  const achievementsRef = useRef<HTMLDivElement>(null);
  const achievementsInView = useInView(achievementsRef, {
    once: true,
    amount: 0.2,
  });

  const historyRef = useRef<HTMLDivElement>(null);
  const historyInView = useInView(historyRef, { once: true, amount: 0.2 });
  
  // State for team members and faculty
  const [faculty, setFaculty] = useState<Faculty[]>([defaultFaculty]);
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [imageUrlMappings, setImageUrlMappings] = useState<Record<string, string>>({});
  
  // Function to handle image URLs from localStorage or fallback to direct paths
  const getImageUrl = (imagePath: string) => {
    return imageUrlMappings[imagePath] || imagePath;
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load team data from API
    const fetchTeamData = async () => {
      try {
        // Fetch team data from API
        const response = await fetch('/api/team');
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        
        const data = await response.json();
        
        // Set team members and faculty data
        if (Array.isArray(data.members) && data.members.length > 0) {
          setMembers(data.members);
        }
        
        if (Array.isArray(data.faculty) && data.faculty.length > 0) {
          setFaculty(data.faculty);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };
    
    fetchTeamData();
    
    // Load image mappings for backward compatibility
    try {
      const storedMappings = localStorage.getItem('imageUrlMappings');
      if (storedMappings) {
        setImageUrlMappings(JSON.parse(storedMappings));
      }
    } catch (error) {
      console.error("Error loading image URL mappings:", error);
    }
  }, []);

  const replaceDivs = (content: string) => {
    // Replace all member card divs with standardized styling
    return content.replace(
      /<div className="bg-blue-950\/20 border border-blue-900\/50 rounded-xl p-6 text-center">/g,
      '<div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center h-full flex flex-col">'
    ).replace(
      /<p className="text-gray-300 text-sm mt-2">/g,
      '<p className="text-gray-300 text-sm mt-2 mb-auto">'
    );
  };
  
  // Faculty Advisor component
  const FacultyAdvisor = ({ faculty }: { faculty: Faculty }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold mb-6 text-white text-center">
          Faculty Advisor
        </h3>
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
            <Image
              src={getImageUrl(faculty.imagePath)}
              alt="Faculty Advisor"
              fill
              unoptimized
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg?height=160&width=160";
              }}
            />
          </div>
          <h4 className="text-xl font-bold text-white">
            {faculty.name}
          </h4>
          <p className="text-gray-400">
            {faculty.position}
          </p>
          <p className="text-blue-400 mt-2">{faculty.role}</p>
          <p className="text-gray-300 max-w-2xl text-center mt-4">
            {faculty.description}
          </p>
        </div>
      </motion.div>
    );
  };

  // Committee Member component
  const CommitteeMember = ({ member }: { member: Member }) => {
    return (
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center h-full flex flex-col">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
          <Image
            src={getImageUrl(member.imagePath)}
            alt={member.position}
            fill
            unoptimized
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg?height=96&width=96";
            }}
          />
        </div>
        <h4 className="text-lg font-bold text-white">
          {member.name}
        </h4>
        <p className="text-blue-400">{member.position}</p>
        <p className="text-gray-300 text-sm mt-2 mb-auto">
          {member.year}, {member.department}
        </p>
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-blue-400"
          >
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
          </svg>
        </a>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div
        ref={containerRef}
        className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden"
      >
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              castShadow
            />
            <FloatingText />
            <Environment preset="city" />
          </Canvas>
        </div>
        
        {/* Content */}
        <motion.div 
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-20"
          style={{ y, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              About IEEE PESCE
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Founded with a vision to create a community of technically
              equipped and professionally skilled students.
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Mission and Vision */}
      <section className="py-16 bg-gradient-to-b from-black to-blue-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">
                Our Mission
              </h2>
              <p className="text-gray-300 mb-4">
                To foster technological innovation and excellence for the
                benefit of humanity through organizing technical activities,
                providing opportunities to develop professional networks, and
                promoting student welfare through education.
              </p>
              <p className="text-gray-300">
                We aim to create a platform where students can explore their
                potential beyond academics and contribute to technological
                advancements.
              </p>
            </div>
            
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">
                Our Vision
              </h2>
              <p className="text-gray-300 mb-4">
                To be the leading technical student chapter that empowers
                students with knowledge, skills, and resources needed to excel
                in the field of engineering and technology.
              </p>
              <p className="text-gray-300">
                We envision a community of innovators and leaders who will drive
                technological advancement and contribute significantly to
                society.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* History Timeline */}
      <section ref={historyRef} className="py-16 bg-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Our <span className="text-blue-400">Journey</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Since our inception, we have grown significantly and achieved
              various milestones.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-600/30"></div>
            
            <div className="space-y-12">
              {/* 2009 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-white">2009</h3>
                  <p className="text-gray-300">
                    Official Establishment: IEEE PESCE Mandya was founded, marking the beginning of a dedicated technical community at PES College of Engineering.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-8 flex justify-start md:justify-start">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10"></div>
                </div>
              </motion.div>
              
              {/* 2011 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right order-1 md:order-1 mb-4 md:mb-0">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10 ml-auto"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 order-2 md:order-2">
                  <h3 className="text-xl font-bold text-white">2011</h3>
                  <p className="text-gray-300">
                    Technical Festivals: Introduced odd and even semester technical fests, AUCTUS in odd semesters and CRESCO in even semesters.
                  </p>
                </div>
              </motion.div>
              
              {/* 2014 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-white">2014</h3>
                  <p className="text-gray-300">
                    Regional Symposiums & Recognition: Organized regional technical symposiums bringing together academicians and industry experts. Also received the best website award.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-8 flex justify-start md:justify-start">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10"></div>
                </div>
              </motion.div>
              
              {/* 2016 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right order-1 md:order-1 mb-4 md:mb-0">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10 ml-auto"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 order-2 md:order-2">
                  <h3 className="text-xl font-bold text-white">2016</h3>
                  <p className="text-gray-300">
                    Industry Collaborations: Strengthened ties with industry partners, leading to guest lectures, internship opportunities, and collaborative projects to enrich student learning.
                  </p>
                </div>
              </motion.div>
              
              {/* 2020 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-white">2020</h3>
                  <p className="text-gray-300">
                    Virtual Transition: Quickly adapted to the COVID-19 pandemic by shifting activities online, ensuring continued engagement and learning despite global challenges. Received the Best Student Branch Award.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-8 flex justify-start md:justify-start">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10"></div>
                </div>
              </motion.div>
              
              {/* 2021 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right order-1 md:order-1 mb-4 md:mb-0">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10 ml-auto"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 order-2 md:order-2">
                  <h3 className="text-xl font-bold text-white">2021</h3>
                  <p className="text-gray-300">
                    Hybrid Model & Recognition: Introduced a hybrid model combining in-person and online events. Won the IEEE Mysore Subsection Most Promising Student Branch Award and Best SB Award.
                  </p>
                </div>
              </motion.div>

              {/* 2022 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-white">2022</h3>
                  <p className="text-gray-300">
                    International Conference: Successfully organized the International Conference on Emerging Research in Electronics, Computer Science and Technology (ICERECT).
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-8 flex justify-start md:justify-start">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10"></div>
                </div>
              </motion.div>
              
              {/* 2023 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right order-1 md:order-1 mb-4 md:mb-0">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10 ml-auto"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 order-2 md:order-2">
                  <h3 className="text-xl font-bold text-white">2023</h3>
                  <p className="text-gray-300">
                    COMSOC Inauguration: Launched the IEEE Communications Society (COMSOC) chapter, expanding our technical community and specialized offerings.
                  </p>
                </div>
              </motion.div>

              {/* 2024 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-white">2024</h3>
                  <p className="text-gray-300">
                    Excellence Continues: Received the IEEE Mysore Subsection Outstanding Large Student Branch Award, continuing our legacy of excellence and recognition.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-8 flex justify-start md:justify-start">
                  <div className="bg-blue-600 rounded-full w-4 h-4 z-10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Achievements */}
      <section
        ref={achievementsRef}
        className="py-16 bg-gradient-to-b from-blue-950 to-black"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              achievementsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Our <span className="text-blue-400">Achievements</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Recognitions and milestones that showcase our commitment to
              excellence.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                achievementsInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Best Student Branch
              </h3>
              <p className="text-gray-300">
                Received the Best Student Branch Award in 2012, 2020, 2021, and 2024, recognizing our consistent excellence and impact
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                achievementsInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Most Promising Student Branch
              </h3>
              <p className="text-gray-300">
                IEEE Mysore Subsection Most Promising Student Branch Award in 2021 and Outstanding Large Student Branch Award in 2024
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                achievementsInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Technical Excellence
              </h3>
              <p className="text-gray-300">
                Successfully organized the International Conference on Emerging Research in Electronics, Computer Science and Technology (ICERECT) in 2022
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                achievementsInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 text-center"
            >
              <div className="bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Special Recognitions
              </h3>
              <p className="text-gray-300">
                Received Best Website Award in 2014 and established IEEE Communications Society (COMSOC) chapter in 2023
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section ref={teamRef} className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Our <span className="text-blue-400">Team</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Meet the dedicated faculty and student leaders who drive our
              mission forward.
            </p>
          </motion.div>
          
          {/* Faculty Advisors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white text-center">
              Faculty Advisors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {faculty.map(f => (
                <FacultyAdvisor key={f.id} faculty={f} />
              ))}
            </div>
          </motion.div>
          
          {/* Executive Committee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white text-center">
              Executive Committee (2024-2025)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map(member => (
                <CommitteeMember key={member.id} member={member} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-black to-blue-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to <span className="text-blue-400">Join Us</span>?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Be a part of the IEEE PESCE Student Branch and embark on a journey
            of innovation, learning, and professional growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://forms.gle/HCxLcGRfDpvURwD46" target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Join IEEE PESCE
              </Button>
            </a>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
