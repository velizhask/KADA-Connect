export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  techRoles: string[];
  website: string;
  logo?: string;
}

export interface Trainee {
  id: string;
  name: string;
  preferredIndustry: string;
  techStack: string[];
  introduction: string;
  cvUrl: string;
  status: "Current Trainee" | "Alumni";
  profileImage?: string;
}

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "TechVision Korea",
    description: "Leading AI and machine learning solutions provider specializing in enterprise automation and intelligent systems.",
    industry: "Artificial Intelligence",
    techRoles: ["Machine Learning Engineer", "Data Scientist", "AI Researcher"],
    website: "https://example.com",
  },
  {
    id: "2",
    name: "CloudScale ASEAN",
    description: "Cloud infrastructure and DevOps solutions helping businesses scale efficiently across Southeast Asia.",
    industry: "Cloud Computing",
    techRoles: ["DevOps Engineer", "Cloud Architect", "Backend Developer"],
    website: "https://example.com",
  },
  {
    id: "3",
    name: "FinTech Innovations",
    description: "Revolutionizing digital payments and financial services through blockchain and modern web technologies.",
    industry: "Financial Technology",
    techRoles: ["Full Stack Developer", "Blockchain Developer", "Security Engineer"],
    website: "https://example.com",
  },
  {
    id: "4",
    name: "HealthTech Solutions",
    description: "Digital health platform providing telemedicine and patient management systems.",
    industry: "Healthcare Technology",
    techRoles: ["Frontend Developer", "Mobile Developer", "UX Designer"],
    website: "https://example.com",
  },
  {
    id: "5",
    name: "EduConnect Asia",
    description: "Online learning platform connecting students and educators across Asia.",
    industry: "Education Technology",
    techRoles: ["Full Stack Developer", "Product Manager", "UX Researcher"],
    website: "https://example.com",
  },
  {
    id: "6",
    name: "DataFlow Analytics",
    description: "Big data analytics and business intelligence solutions for enterprise clients.",
    industry: "Data Analytics",
    techRoles: ["Data Engineer", "Data Analyst", "Business Intelligence Developer"],
    website: "https://example.com",
  },
];

export const mockTrainees: Trainee[] = [
  {
    id: "1",
    name: "Kim Minji",
    preferredIndustry: "Artificial Intelligence",
    techStack: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
    introduction: "Passionate AI engineer with focus on computer vision and NLP. Experienced in building scalable ML pipelines.",
    cvUrl: "#",
    status: "Current Trainee",
  },
  {
    id: "2",
    name: "Nguyen Thanh",
    preferredIndustry: "Cloud Computing",
    techStack: ["AWS", "Docker", "Kubernetes", "Node.js"],
    introduction: "DevOps enthusiast specializing in cloud infrastructure and CI/CD automation. AWS Certified Solutions Architect.",
    cvUrl: "#",
    status: "Current Trainee",
  },
  {
    id: "3",
    name: "Sarah Lee",
    preferredIndustry: "Financial Technology",
    techStack: ["React", "TypeScript", "Solidity", "Web3"],
    introduction: "Full-stack developer with blockchain expertise. Built DeFi applications and smart contracts.",
    cvUrl: "#",
    status: "Alumni",
  },
  {
    id: "4",
    name: "Ahmad Rizki",
    preferredIndustry: "Healthcare Technology",
    techStack: ["React Native", "Flutter", "Firebase", "MongoDB"],
    introduction: "Mobile developer passionate about creating accessible healthcare solutions for underserved communities.",
    cvUrl: "#",
    status: "Current Trainee",
  },
  {
    id: "5",
    name: "Park Jisoo",
    preferredIndustry: "Education Technology",
    techStack: ["Vue.js", "Django", "PostgreSQL", "Redis"],
    introduction: "Full-stack developer focused on creating engaging and interactive learning experiences.",
    cvUrl: "#",
    status: "Current Trainee",
  },
  {
    id: "6",
    name: "Maria Santos",
    preferredIndustry: "Data Analytics",
    techStack: ["Python", "SQL", "Tableau", "Apache Spark"],
    introduction: "Data analyst with expertise in transforming complex datasets into actionable business insights.",
    cvUrl: "#",
    status: "Alumni",
  },
  {
    id: "7",
    name: "Chen Wei",
    preferredIndustry: "Artificial Intelligence",
    techStack: ["Python", "Scikit-learn", "OpenCV", "Deep Learning"],
    introduction: "ML engineer specializing in computer vision applications for industrial automation.",
    cvUrl: "#",
    status: "Current Trainee",
  },
  {
    id: "8",
    name: "Siti Nurhaliza",
    preferredIndustry: "Financial Technology",
    techStack: ["Java", "Spring Boot", "MySQL", "Microservices"],
    introduction: "Backend developer with strong foundation in building secure and scalable financial systems.",
    cvUrl: "#",
    status: "Current Trainee",
  },
];

export const industries = [
  "Artificial Intelligence",
  "Cloud Computing",
  "Financial Technology",
  "Healthcare Technology",
  "Education Technology",
  "Data Analytics",
];

export const techRoles = [
  "Machine Learning Engineer",
  "Data Scientist",
  "AI Researcher",
  "DevOps Engineer",
  "Cloud Architect",
  "Backend Developer",
  "Full Stack Developer",
  "Blockchain Developer",
  "Security Engineer",
  "Frontend Developer",
  "Mobile Developer",
  "UX Designer",
  "Product Manager",
  "Data Engineer",
  "Data Analyst",
  "Business Intelligence Developer",
];

export const techStacks = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Node.js",
  "Django",
  "Spring Boot",
  "TensorFlow",
  "PyTorch",
  "AWS",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Solidity",
  "Web3",
  "React Native",
  "Flutter",
];