"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Pencil, Trash2, ArrowLeft, X, CheckCircle, AlertCircle, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AuthCheck from "@/components/auth-check";
import Image from "next/image";

// Type definitions for team members
interface Member {
  id: string;
  name: string;
  position: string;
  department: string;
  year: string;
  imagePath: string;
  linkedinUrl: string;
}

// Type definition for faculty
interface Faculty {
  id: string;
  name: string;
  position: string;
  role: string;
  description: string;
  imagePath: string;
}

// Default faculty data as array
const defaultFaculty: Faculty[] = [
  {
  id: "faculty1",
  name: "Dr. PUNITH KUMAR M B",
  position: "HOD, Dept. of Electronics and Communication Engineering",
  role: "Faculty Advisor, IEEE PESCE",
  description: "Dr. Punith Kumar M B brings extensive experience in academia and research. He has been instrumental in guiding the IEEE PESCE Student Branch and has helped shape it into one of the most active student branches in the region.",
  imagePath: "/punithk.jpg",
  }
];

// Committee members data - keeping the existing 11
const initialMembers: Member[] = [
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

export default function TeamAdmin() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFacultyDialogOpen, setIsFacultyDialogOpen] = useState(false);
  const [isFacultyDeleteDialogOpen, setIsFacultyDeleteDialogOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [imageUrlMappings, setImageUrlMappings] = useState<Record<string, string>>({});
  
  // Member form state
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPosition, setMemberPosition] = useState("");
  const [memberDepartment, setMemberDepartment] = useState("");
  const [memberYear, setMemberYear] = useState("");
  const [memberImagePath, setMemberImagePath] = useState("");
  const [memberLinkedinUrl, setMemberLinkedinUrl] = useState("");
  
  // Faculty form state
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [facultyId, setFacultyId] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [facultyPosition, setFacultyPosition] = useState("");
  const [facultyRole, setFacultyRole] = useState("");
  const [facultyDescription, setFacultyDescription] = useState("");
  const [facultyImagePath, setFacultyImagePath] = useState("");
  const [deletingFacultyId, setDeletingFacultyId] = useState<string | null>(null);

  // Image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  
  // Function to save team data (both members and faculty)
  const saveTeamData = async () => {
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          members,
          faculty
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save team data');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving team data:', error);
      setError('Failed to save team data. Please try again.');
      return false;
    }
  };

  const saveImageToPublic = async (file: File, prefix: string): Promise<string> => {
    try {
    setIsUploading(true);
    
      // Create unique filename
      const uniqueFilename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prefix', prefix);
      
      // Upload file to server
      const response = await fetch('/api/upload/team', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      const imagePath = data.path;
      
      // Create Object URL for preview in the current session
      const objectUrl = URL.createObjectURL(file);
      
      // Update our local mapping
      setImageUrlMappings(prev => ({
        ...prev,
        [imagePath]: objectUrl
      }));
      
      setIsUploading(false);
      return imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
      setIsUploading(false);
      return '';
    }
  };
  
  useEffect(() => {
    setIsClient(true);
    
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/admin");
      return;
    }
    
    // Initialize image URL mappings if it doesn't exist
    if (!localStorage.getItem('imageUrlMappings')) {
      localStorage.setItem('imageUrlMappings', JSON.stringify({}));
    }
    
    // Get the stored image URL mappings
    try {
      const storedMappings = localStorage.getItem('imageUrlMappings');
      if (storedMappings) {
        setImageUrlMappings(JSON.parse(storedMappings));
      }
      } catch (err) {
      console.error("Error loading image mappings:", err);
    }
    
    // Load team members data
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/team');
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        
        const data = await response.json();
        
        // Separate members and faculty data
        if (Array.isArray(data.members)) {
          setMembers(data.members);
        }
        
        if (Array.isArray(data.faculty)) {
          setFaculty(data.faculty);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Failed to load team data. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchTeamData();
  }, [router]);
  
  const resetForm = () => {
    setMemberId("");
    setMemberName("");
    setMemberPosition("");
    setMemberDepartment("");
    setMemberYear("");
    setMemberImagePath("");
    setMemberLinkedinUrl("");
    setEditingMember(null);
    setSelectedImage(null);
    setPreviewUrl(null);
    setUploadStatus("");
  };
  
  const resetFacultyForm = () => {
    setFacultyId("");
    setFacultyName("");
    setFacultyPosition("");
    setFacultyRole("");
    setFacultyDescription("");
    setFacultyImagePath("");
    setSelectedImage(null);
    setPreviewUrl(null);
    setUploadStatus("");
  };
  
  const handleAddNewMember = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setMemberId(member.id);
    setMemberName(member.name);
    setMemberPosition(member.position);
    setMemberDepartment(member.department);
    setMemberYear(member.year);
    setMemberImagePath(member.imagePath);
    setMemberLinkedinUrl(member.linkedinUrl);
    setPreviewUrl(member.imagePath);
    setIsDialogOpen(true);
  };
  
  const handleEditFaculty = () => {
    if (faculty.length > 0) {
      setFacultyId(faculty[0].id);
      setFacultyName(faculty[0].name);
      setFacultyPosition(faculty[0].position);
      setFacultyRole(faculty[0].role);
      setFacultyDescription(faculty[0].description);
      setFacultyImagePath(faculty[0].imagePath);
      setPreviewUrl(faculty[0].imagePath);
    }
    setIsFacultyDialogOpen(true);
  };
  
  const handleEditFacultyMember = (facultyMember: Faculty) => {
    setEditingFaculty(facultyMember);
    setFacultyId(facultyMember.id);
    setFacultyName(facultyMember.name);
    setFacultyPosition(facultyMember.position);
    setFacultyRole(facultyMember.role);
    setFacultyDescription(facultyMember.description);
    setFacultyImagePath(facultyMember.imagePath);
    setPreviewUrl(facultyMember.imagePath);
    setIsFacultyDialogOpen(true);
  };
  
  const handleDeleteConfirm = (id: string) => {
    setDeletingMemberId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteFaculty = async () => {
    if (faculty.length > 0) {
      try {
        // Keep only Dr. Punith Kumar
        const punithFaculty = faculty.find(f => f.id === "faculty1");
        const updatedFaculty = punithFaculty ? [punithFaculty] : defaultFaculty;
        
        setFaculty(updatedFaculty);
        
        // Save to API
        await saveTeamData();
        
        setStatusMessage("Faculty advisors updated, Dr. Punith Kumar retained");
        setSuccess("Faculty advisors updated, Dr. Punith Kumar retained");
        setTimeout(() => {
          setStatusMessage("");
          setSuccess("");
        }, 3000);
      } catch (error) {
        console.error('Error updating faculty:', error);
        setError('Failed to update faculty data');
      }
    }
  };
  
  const handleDeleteFacultyConfirm = (id: string) => {
    setDeletingFacultyId(id);
    setIsFacultyDeleteDialogOpen(true);
  };
  
  const handleDeleteMember = async () => {
    if (!deletingMemberId) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/team/members/${deletingMemberId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete team member');
      }
      
      // Remove from local state
      setMembers(members.filter(m => m.id !== deletingMemberId));
      setIsDeleteDialogOpen(false);
      setDeletingMemberId(null);
      setIsDeleting(false);
      setStatusMessage("Team member deleted successfully");
      setSuccess("Team member deleted successfully");
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage("");
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error('Error deleting team member:', error);
      setError('Failed to delete team member. Please try again.');
      setIsDeleting(false);
    }
  };
  
  const handleDeleteFacultyMember = async () => {
    if (!deletingFacultyId) return;
    
    // Prevent deletion of Dr. Punith Kumar
    if (deletingFacultyId === "faculty1") {
      setStatusMessage("Cannot delete Dr. Punith Kumar");
      setError("Cannot delete Dr. Punith Kumar");
      setIsFacultyDeleteDialogOpen(false);
      setTimeout(() => {
        setStatusMessage("");
        setError("");
      }, 3000);
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Remove from local state
      const updatedFaculty = faculty.filter(f => f.id !== deletingFacultyId);
      setFaculty(updatedFaculty);
      
      // Save to API
      await saveTeamData();
      
      setIsFacultyDeleteDialogOpen(false);
      setDeletingFacultyId(null);
      setIsDeleting(false);
      setStatusMessage("Faculty member deleted successfully");
      setSuccess("Faculty member deleted successfully");
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage("");
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error('Error deleting faculty member:', error);
      setError('Failed to delete faculty member');
      setIsDeleting(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadStatus("Image selected. Click Save to upload.");
    }
  };
  
  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberName || !memberPosition || !memberDepartment || !memberYear) {
      setStatusMessage("Please fill in all required fields");
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
    let imagePath = memberImagePath;
      
      // If there's a file to upload
    if (selectedImage) {
        setIsUploading(true);
        imagePath = await saveImageToPublic(selectedImage, "team");
        setIsUploading(false);
      }
      
      // Prepare data object
      const memberData = {
      name: memberName,
      position: memberPosition,
      department: memberDepartment,
      year: memberYear,
      imagePath: imagePath,
        linkedinUrl: memberLinkedinUrl,
        type: 'member'
    };
    
      // Send to API
      let response;
    
    if (editingMember) {
      // Update existing member
        response = await fetch(`/api/team/members/${editingMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberData),
        });
    } else {
      // Add new member
        response = await fetch('/api/team', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberData),
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to ${editingMember ? 'update' : 'add'} team member`);
      }
      
      // Get the updated or new member from the response
      const updatedMember = await response.json();
      
      if (editingMember) {
        // Replace the old member with the updated one
        setMembers(members.map(m => m.id === editingMember.id ? updatedMember : m));
      } else {
        // Add the new member to the list
        setMembers([...members, updatedMember]);
      }
      
      // Reset form
    resetForm();
      setIsDialogOpen(false);
      setIsSubmitting(false);
      setStatusMessage(`Team member ${editingMember ? 'updated' : 'added'} successfully`);
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage("");
      }, 3000);
    } catch (error) {
      console.error('Error saving team member:', error);
      setError(`Failed to ${editingMember ? 'update' : 'add'} team member. Please try again.`);
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!facultyName || !facultyPosition || !facultyRole) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
    let imagePath = facultyImagePath;
      
      // If there's a file to upload
    if (selectedImage) {
        setIsUploading(true);
        imagePath = await saveImageToPublic(selectedImage, "faculty");
        setIsUploading(false);
      }
      
      // Prepare data object
      const facultyData = {
      name: facultyName,
      position: facultyPosition,
      role: facultyRole,
      description: facultyDescription,
      imagePath: imagePath
    };
      
      // Send to API
      let response;
      
      if (editingFaculty) {
        // Update existing faculty
        response = await fetch(`/api/team/faculty/${editingFaculty.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(facultyData),
        });
      } else {
        // Add new faculty
        response = await fetch('/api/team/faculty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(facultyData),
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to ${editingFaculty ? 'update' : 'add'} faculty member`);
      }
      
      // Get the updated or new faculty from the response
      const updatedFaculty = await response.json();
      
      if (editingFaculty) {
        // Replace the old faculty with the updated one
        setFaculty(faculty.map(f => f.id === editingFaculty.id ? updatedFaculty : f));
      } else {
        // Add the new faculty to the list
        setFaculty([...faculty, updatedFaculty]);
      }
      
      // Reset form
    resetFacultyForm();
      setIsFacultyDialogOpen(false);
      setIsSubmitting(false);
      setStatusMessage(`Faculty ${editingFaculty ? 'updated' : 'added'} successfully`);
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage("");
      }, 3000);
    } catch (error) {
      console.error('Error saving faculty member:', error);
      setError(`Failed to ${editingFaculty ? 'update' : 'add'} faculty member. Please try again.`);
      setIsSubmitting(false);
    }
  };
  
  // Function to set current faculty for editing
  const editFaculty = (index: number) => {
    const facultyToEdit = faculty[index];
    setEditingFaculty(facultyToEdit);
    setFacultyId(facultyToEdit.id);
    setFacultyName(facultyToEdit.name);
    setFacultyPosition(facultyToEdit.position);
    setFacultyRole(facultyToEdit.role);
    setFacultyDescription(facultyToEdit.description);
    setFacultyImagePath(facultyToEdit.imagePath);
    setPreviewUrl(facultyToEdit.imagePath);
    setIsFacultyDialogOpen(true);
  };

  // Function to delete a faculty member
  const deleteFaculty = (index: number) => {
    // Prevent deleting Dr. Punith Kumar (faculty1)
    const facultyToDelete = faculty[index];
    if (facultyToDelete.id === "faculty1") {
      alert("Dr. Punith Kumar M B cannot be removed as he is the main Faculty Advisor.");
      return;
    }
    
    const confirmDelete = window.confirm("Are you sure you want to delete this faculty member?");
    if (confirmDelete) {
      const updatedFaculty = [...faculty];
      updatedFaculty.splice(index, 1);
      setFaculty(updatedFaculty);
    }
  };
  
  if (!isClient) {
    return null; // Prevents hydration errors
  }
  
  return (
    <AuthCheck>
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/dashboard")}
            className="bg-transparent border-blue-800 hover:bg-blue-900/30"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Team Management
          </h1>
        </div>
        
          {statusMessage && (
            <Alert className={`mb-6 ${
              error ? "bg-red-900/30 border-red-800 text-red-200" :
              success ? "bg-green-900/30 border-green-800 text-green-200" :
              "bg-blue-900/30 border-blue-800 text-blue-200"
            }`}>
              {error ? <AlertCircle className="h-4 w-4" /> : 
               success ? <CheckCircle className="h-4 w-4" /> : 
               <InfoIcon className="h-4 w-4" />}
              <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Faculty Advisors</h2>
            
              <Button
                onClick={() => {
                  resetFacultyForm();
                  setEditingFaculty(null);
                  setIsFacultyDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add Faculty
              </Button>
          </div>
          
            {faculty.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faculty.map((facultyMember, index) => (
                      <TableRow key={facultyMember.id}>
                        <TableCell>
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                                src={facultyMember.imagePath}
                                alt={facultyMember.name}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Try to get from our localStorage mapping
                    const imageUrlMappings = JSON.parse(localStorage.getItem('imageUrlMappings') || '{}');
                                  if (imageUrlMappings[facultyMember.imagePath]) {
                                    target.src = imageUrlMappings[facultyMember.imagePath];
                    } else {
                                  target.src = "/placeholder.svg?height=40&width=40";
                    }
                  }}
                />
              </div>
                        </TableCell>
                        <TableCell className="font-medium">{facultyMember.name}</TableCell>
                        <TableCell>{facultyMember.position}</TableCell>
                        <TableCell>{facultyMember.role}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => editFaculty(index)}
                              className="h-8 w-8 bg-transparent border-blue-800 hover:bg-blue-900/30"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => deleteFaculty(index)}
                              className="h-8 w-8 bg-transparent border-red-800 hover:bg-red-900/30 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
              </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
          ) : (
              <p className="text-gray-400">No faculty advisors available.</p>
          )}
        </div>
        
        <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Committee Members</h2>
            
            <Button
              onClick={handleAddNewMember}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Member
            </Button>
          </div>
          
          {members.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={member.imagePath}
                            alt={member.name}
                            fill
                            unoptimized
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              // Try to get from our localStorage mapping
                              const imageUrlMappings = JSON.parse(localStorage.getItem('imageUrlMappings') || '{}');
                              if (imageUrlMappings[member.imagePath]) {
                                target.src = imageUrlMappings[member.imagePath];
                              } else {
                                target.src = "/placeholder.svg?height=40&width=40";
                              }
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.year}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditMember(member)}
                            className="h-8 w-8 bg-transparent border-blue-800 hover:bg-blue-900/30"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteConfirm(member.id)}
                            className="h-8 w-8 bg-transparent border-red-800 hover:bg-red-900/30 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-400">No committee members added yet.</p>
          )}
        </div>
      </div>
      
      {/* Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-blue-950/80 border-blue-900/50 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Member name"
                  className="bg-blue-900/20 border-blue-900/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position*</Label>
                <Input
                  id="position"
                  value={memberPosition}
                  onChange={(e) => setMemberPosition(e.target.value)}
                  placeholder="e.g. Chairperson"
                  className="bg-blue-900/20 border-blue-900/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department*</Label>
                <Input
                  id="department"
                  value={memberDepartment}
                  onChange={(e) => setMemberDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="bg-blue-900/20 border-blue-900/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year*</Label>
                <Select 
                  value={memberYear} 
                  onValueChange={setMemberYear}
                >
                  <SelectTrigger className="bg-blue-900/20 border-blue-900/50">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={memberLinkedinUrl}
                  onChange={(e) => setMemberLinkedinUrl(e.target.value)}
                  placeholder="LinkedIn profile URL"
                  className="bg-blue-900/20 border-blue-900/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-blue-900/20 border-blue-900/50"
                />
                {uploadStatus && (
                  <p className="text-xs text-blue-400">{uploadStatus}</p>
                )}
              </div>
            </div>
            
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                className="bg-transparent border-blue-800 hover:bg-blue-900/30"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || isUploading}
              >
                  {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Faculty Dialog */}
      <Dialog open={isFacultyDialogOpen} onOpenChange={setIsFacultyDialogOpen}>
        <DialogContent className="bg-blue-950/80 border-blue-900/50 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>
                {faculty.length > 0 ? "Edit Faculty Advisor" : "Add Faculty Advisor"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitFaculty} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facultyName">Name*</Label>
                <Input
                  id="facultyName"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="Faculty name"
                  className="bg-blue-900/20 border-blue-900/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facultyPosition">Position*</Label>
                <Input
                  id="facultyPosition"
                  value={facultyPosition}
                  onChange={(e) => setFacultyPosition(e.target.value)}
                  placeholder="e.g. HOD, Dept. of Electronics and Communication"
                  className="bg-blue-900/20 border-blue-900/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facultyRole">Role*</Label>
                <Input
                  id="facultyRole"
                  value={facultyRole}
                  onChange={(e) => setFacultyRole(e.target.value)}
                  placeholder="e.g. Faculty Advisor, IEEE PESCE"
                  className="bg-blue-900/20 border-blue-900/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facultyImage">Profile Image</Label>
                <Input
                  id="facultyImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-blue-900/20 border-blue-900/50"
                />
                {uploadStatus && (
                  <p className="text-xs text-blue-400">{uploadStatus}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="facultyDescription">Description</Label>
                <Textarea
                  id="facultyDescription"
                  value={facultyDescription}
                  onChange={(e) => setFacultyDescription(e.target.value)}
                  placeholder="Brief description about the faculty advisor"
                  className="bg-blue-900/20 border-blue-900/50 min-h-24"
                />
              </div>
            </div>
            
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFacultyDialogOpen(false);
                  resetFacultyForm();
                }}
                className="bg-transparent border-blue-800 hover:bg-blue-900/30"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || isUploading}
              >
                  {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-blue-950/80 border-blue-900/50 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <p>Are you sure you want to delete this team member? This action cannot be undone.</p>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-transparent border-blue-800 hover:bg-blue-900/30"
            >
              Cancel
            </Button>
            <Button
                className="bg-red-600 hover:bg-red-700" 
              onClick={handleDeleteMember}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Faculty Delete Confirmation Dialog */}
        <Dialog open={isFacultyDeleteDialogOpen} onOpenChange={setIsFacultyDeleteDialogOpen}>
          <DialogContent className="bg-blue-950/80 border-blue-900/50 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            
            <p>Are you sure you want to delete this faculty member? This action cannot be undone.</p>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsFacultyDeleteDialogOpen(false)}
                className="bg-transparent border-blue-800 hover:bg-blue-900/30"
              >
                Cancel
              </Button>
              <Button 
              className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteFacultyMember}
                disabled={isDeleting}
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
    </AuthCheck>
  );
} 