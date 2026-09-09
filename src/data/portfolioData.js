export const personalInfo = {
  name: "Aditya Sharma",
  title: "Full-Stack Developer",
  email: "sharma.adi1217@gmail.com",
  phone: "8448327765",
  location: "Rajpura, Punjab",
  linkedin: "https://www.linkedin.com/in/aditya-sharma097",
  github: "https://github.com/fearsomecity",
  summary:
    "Computer Science student at Chitkara University proficient in Java, React.js, and Node.js. Experienced in building full-stack MERN applications, cloud-deployed systems, and AI-integrated products. Passionate about algorithms, system design, and building intelligent, data-driven solutions at scale.",
};

export const education = {
  degree: "BE in Computer Science and Engineering",
  university: "Chitkara University",
  location: "Rajpura, Punjab",
  duration: "07/2023 – 07/2027",
  gpa: "8.43",
};

export const skills = {
  Languages: ["Java", "JavaScript", "C++", "SQL"],
  Frontend: ["React.js", "Tailwind CSS"],
  Backend: ["Node.js", "Express.js", "REST APIs", "JWT/Auth0"],
  Database: ["MongoDB", "MySQL"],
  "Tools / Platforms": ["Docker", "Git", "AWS (EC2/S3)"],
  "Core CS": [
    "Data Structures & Algorithms",
    "OOP",
    "Operating Systems",
    "Computer Networks",
    "System Design",
  ],
};

export const projects = [
  {
    title: "DonorLink – Smart Blood Bank",
    tech: ["React.js", "Node.js", "MongoDB", "JWT"],
    year: "2025",
    description:
      "Engineered a full-stack web platform using React.js and Node.js to connect blood donors, recipients, and nearby blood banks in real-time.",
    bullets: [
      "Developed a dynamic front-end featuring real-time blood availability, donor registration, and donation camp management modules.",
      "Implemented a backend with MongoDB and JWT, featuring a critical search functionality for users to locate specific blood types urgently.",
    ],
    color: "#FF6B6B",
    icon: "🩸",
    link: "https://donornetfrontend.vercel.app/",
  },
  {
    title: "Euphoria – AI-Powered Mental Wellness App",
    tech: ["React.js", "Node.js", "MongoDB", "Gemini API"],
    year: "2025",
    description:
      "Architected a comprehensive wellness suite providing personality insights (MBTI), well-being metrics (PERMA), and cognitive assessments (IQ).",
    bullets: [
      "Built an AI-driven mental health assistant using Google Gemini API to provide real-time emotional support and personalized wellness recommendations.",
      "Spearheaded the development of a secure administrative dashboard for monitoring platform analytics, user activity logs, and system health metrics.",
    ],
    color: "#C084FC",
    icon: "🧠",
    link: "https://delightful-bay-07530dc00.4.azurestaticapps.net/",
  },
  {
    title: "Threadline – System Architecture Visualizer",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    year: "2026",
    description:
      "Built an interactive drag-and-drop platform to design, validate, and simulate distributed system architectures in real time.",
    bullets: [
      "Implemented deterministic validation to audit designs for single points of failure, unshielded edges, and unbuffered queues.",
      "Developed a packet simulation engine with latency tracing that visualizes request traversal across directed graph edges.",
    ],
    color: "#38bdf8",
    icon: "🔗",
    link: "https://thread-line-frontend.vercel.app/",
  },
];

export const certifications = [
  {
    title: "Cloud Computing Fundamentals",
    issuer: "Duke University (Coursera)",
    icon: "cloud",
  },
  {
    title: "Cloud Virtualization, Containers and APIs",
    issuer: "Duke University (Coursera)",
    icon: "box",
  },
];

export const leetcodeStats = {
  username: "Stoic_97",
  profileUrl: "https://leetcode.com/u/Stoic_97/",
  solved: 130,
  totalQuestions: 4042,
  easySolved: 69,
  easyTotal: 962,
  mediumSolved: 57,
  mediumTotal: 2109,
  hardSolved: 5,
  hardTotal: 971,
  ranking: "1,315,880",
  streak: 15,
  activeDays: 120,
  totalSubmissions: 430,
};

export const initialHeatmapMonths = [
  {"name":"Sep","cols":[[-1,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,-1,-1,-1,-1]]},
  {"name":"Oct","cols":[[-1,-1,-1,0,0,0,0],[0,0,0,10,4,2,1],[1,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,2,3,2,0,-1]]},
  {"name":"Nov","cols":[[-1,-1,-1,-1,-1,-1,0],[0,0,4,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,-1,-1,-1,-1,-1,-1]]},
  {"name":"Dec","cols":[[-1,0,0,0,0,0,0],[0,0,0,0,2,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,6,0,0,-1,-1,-1]]},
  {"name":"Jan","cols":[[-1,-1,-1,-1,0,2,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,0,1,0,0],[0,5,9,1,2,1,1]]},
  {"name":"Feb","cols":[[0,3,1,0,1,1,2],[1,5,6,6,1,7,0],[2,0,4,4,4,1,0],[0,0,0,1,0,0,0]]},
  {"name":"Mar","cols":[[0,0,0,0,0,0,0],[0,1,1,0,0,0,0],[0,1,1,8,0,3,0],[0,1,0,0,0,0,0],[0,0,0,-1,-1,-1,-1]]},
  {"name":"Apr","cols":[[-1,-1,-1,0,0,7,0],[0,3,2,1,1,1,4],[2,7,0,13,3,6,2],[6,1,0,10,15,1,1],[4,2,1,11,3,-1,-1]]},
  {"name":"May","cols":[[-1,-1,-1,-1,-1,2,7],[2,3,3,2,0,2,1],[1,6,2,1,3,2,0],[1,2,18,1,4,8,6],[0,2,7,4,4,3,1],[1,-1,-1,-1,-1,-1,-1]]},
  {"name":"Jun","cols":[[-1,7,6,3,0,1,0],[17,3,8,1,0,0,0],[0,0,0,0,0,0,0],[0,2,0,4,0,0,2],[8,0,6,-1,-1,-1,-1]]},
  {"name":"Jul","cols":[[-1,-1,-1,3,2,0,0],[0,0,0,6,0,0,0],[0,0,1,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,-1]]},
  {"name":"Aug","cols":[[-1,-1,-1,-1,-1,-1,0],[1,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,2,-1,-1,-1,-1,-1]]}
];
