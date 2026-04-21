const assetBase = import.meta.env.BASE_URL;

export const personalInfo = {
  name: "Abhay Raj Dwivedi",
  role: "Creative Developer and Photographer",
  heroIntro: "Welcome folks,",
  heroLead: "This is",
  statement:
    "He builds elegant digital experiences with code, explores AI-led problem solving, and captures emotion through the lens.",
  education:
    "B.Tech Computer Science | Maharana Pratap Engineering College, Kanpur",
  aboutDescription:
    "A passionate computer science student blending technical depth with visual storytelling. He enjoys turning ambitious ideas into polished experiences across software, machine learning, and creative media.",
  location: "Kanpur, India",
  email: "dwivediabhayraj77@gmail.com",
  github: "https://github.com/abhaycodess",
  linkedin: "https://linkedin.com/in/abhay-raj-dwivedi",
  phone: "+91 6386583143",
  profileImage: `${assetBase}profile-photo.jpg`,
  resumes: [
    { label: "Resume", href: `${assetBase}assets/resume.pdf` }
  ]
};

export const statHighlights = [
  { value: "4+", label: "Core software and ML projects" },
  { value: "21", label: "Photography frames in the gallery" },
  { value: "3", label: "Creative and technical focus areas" }
];

export const techGroups = [
  {
    title: "Languages",
    items: ["Java", "Python", "C/C++", "JavaScript"]
  },
  {
    title: "Data Science",
    items: ["Machine Learning", "Analytics", "Modeling"]
  },
  {
    title: "Creative",
    items: ["Photography", "Filmmaking", "Visual Design"]
  }
];

export const goals = [
  "Master full-stack development",
  "Build innovative AI solutions",
  "Lead impactful projects",
  "Blend tech with creative storytelling",
  "Make a positive digital impact"
];

export const strengths = [
  {
    title: "Problem Solving",
    description: "Analytical thinking with a calm, structured approach to complex challenges."
  },
  {
    title: "Team Collaboration",
    description: "Comfortable working across teams and keeping communication clear and useful."
  },
  {
    title: "Continuous Learning",
    description: "Actively explores modern tools, frameworks, and AI workflows."
  },
  {
    title: "Creative Vision",
    description: "Combines engineering rigor with artistic sensibility to make work memorable."
  }
];

export const featuredProject = {
  title: "Unlazy - Learning OS",
  eyebrow: "Featured Project",
  subtitle: "A modern, open-source OS for learning, productivity, and digital wellness.",
  description:
    "Unlazy - Learning OS is a full-stack, open-source platform designed to help students and self-learners organize, track, and optimize their learning journey. It features a modular dashboard, spaced repetition, habit tracking, and a distraction-free interface. Built for the web, it blends productivity, digital wellness, and community-driven features to help you learn smarter, not harder.",
  stack: ["React", "Node.js", "MongoDB", "Express", "Vite", "TailwindCSS"],
  details: [
    {
      label: "Key Features",
      value: "Modular dashboard, spaced repetition, habit tracking, distraction-free mode, open-source, community-driven, and digital wellness tools."
    },
    {
      label: "Technologies",
      value: "React, Node.js, Express, MongoDB, Vite, TailwindCSS, and more."
    },
    {
      label: "View Live",
      value: "https://unlazy-rho.vercel.app/"
    }
  ],
  link: "https://github.com/abhaycodess/Learning-OS#learning-os---current-state-and-app-flow"
};

export const projects = [
  {
    title: "Unlazy - Learning OS",
    description:
      "A modern, open-source OS for learning, productivity, and digital wellness. Features a modular dashboard, spaced repetition, habit tracking, and a distraction-free interface for smarter learning.",
    tech: ["React", "Node.js", "MongoDB", "Express", "Vite", "TailwindCSS"],
    link: "https://github.com/abhaycodess/Learning-OS#learning-os---current-state-and-app-flow",
    live: "https://unlazy-rho.vercel.app/",
    category: "Full Stack"
  },
  {
    title: "Naagrik",
    description:
      "A civic issue reporting platform enabling citizens to raise and track local problems with transparency, verification-aware publishing, and public dashboard visibility.",
    tech: ["React", "Vite", "TailwindCSS", "Firebase Auth", "Firestore", "Firebase Storage"],
    link: "https://github.com/abhaycodess/-Major-Project",
    category: "Full Stack"
  },
  {
    title: "Movie Recommendation System",
    description:
      "Built as part of a four-member team to analyze ratings and viewing data, then generate movie suggestions tailored to individual user preferences.",
    tech: ["Python", "Machine Learning", "Data Analysis", "Team Project"],
    link: "https://github.com/abhaycodess/Movie-Recommendation-System",
    category: "Machine Learning"
  },
  {
    title: "Speech Emotion Recognition",
    description:
      "A Python-based machine learning model that analyzes vocal features from audio signals to classify emotions such as happiness, sadness, and anger.",
    tech: ["Python", "Machine Learning", "Audio Processing", "Emotion Detection"],
    link: "https://github.com/abhaycodess/Speech-Emotion-Recognition-App",
    category: "AI Audio"
  },
  {
    title: "Library Management System",
    description:
      "A console-based application in C that manages inventory, member records, and issue or return workflows with file-based persistence.",
    tech: ["C", "File Handling", "Data Structures", "Console Application"],
    link: "https://github.com/abhaycodess/Library-Management-System",
    category: "Systems"
  }
];

const photoFiles = [
  "IMG_20250115_154800.jpg",
  "IMG_20250128_163725.jpg",
  "IMG_20250128_164325.jpg",
  "IMG_20250128_164350.jpg",
  "IMG_20250128_164730.jpg",
  "IMG_20250128_164952.jpg",
  "IMG_20250128_165118.jpg",
  "IMG_20250128_165653.jpg",
  "IMG_20250128_165916.jpg",
  "IMG_20250128_170715.jpg",
  "IMG_20250128_170751.jpg",
  "IMG_20250128_170855.jpg",
  "IMG_20250128_170941.jpg",
  "IMG_20250128_171018.jpg",
  "IMG_20250128_171132.jpg",
  "IMG_20250128_171258.jpg",
  "IMG_20250128_171350.jpg",
  "IMG_20250128_171431.jpg",
  "IMG_20250630_152908.jpg",
  "IMG_20250630_153140.jpg",
  "IMG_20250630_153238.jpg"
];

const photoTitles = [
  "Nature's Beauty",
  "Urban Landscape",
  "Artistic Vision",
  "Moment Captured",
  "Visual Story",
  "Creative Frame",
  "Light and Shadow",
  "Emotion Frame",
  "Perspectives",
  "Golden Hour",
  "Serene Moment",
  "Abstract Beauty",
  "Life Reflected",
  "Timeless View",
  "Silent Story",
  "Depth and Focus",
  "Essence Captured",
  "Vibrant Colors",
  "Nature's Canvas",
  "Open Horizon",
  "Perfect Moment"
];

export const photos = photoFiles.map((file, index) => ({
  src: `${assetBase}Photos-1-001/${file}`,
  optimizedSrc: `${assetBase}Photos-1-001/optimized/${file.replace(/\.[^.]+$/, ".webp")}`,
  mobileSrc: `${assetBase}Photos-1-001/optimized/mobile/${file.replace(/\.[^.]+$/, ".webp")}`,
  title: photoTitles[index]
}));

export const photographyDescription =
  "Photography allows him to combine technical precision with artistic vision, much like programming. Each frame tells a story, capturing moments, mood, and perspective that continue to shape his creative journey.";
