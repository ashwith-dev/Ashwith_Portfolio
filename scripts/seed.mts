/**
 * Seed the database with real Ashwith content.
 * Usage: npx tsx scripts/seed.mts
 */
import { existsSync } from "node:fs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Set MONGODB_URI in .env");

await mongoose.connect(MONGODB_URI);

// --- Models (inline to avoid next/* imports) ---------------------------------
const ProfileSchema = new mongoose.Schema({
  name: String, tagline: String, heroTagline: String, bio: String,
  pullQuote: String, currentlyBuilding: [String], location: String,
  email: String, resumeUrl: String, avatarUrl: String,
  socials: [{ label: String, url: String }],
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, summary: String,
  description: String, role: String, techStack: [String],
  images: [{ url: String, alt: String }], coverImage: String,
  liveUrl: String, githubUrl: String, featured: Boolean,
  published: Boolean, order: Number,
}, { timestamps: true });

const SkillSchema = new mongoose.Schema({
  name: String, category: String, level: String, order: Number,
}, { timestamps: true });

const ExperienceSchema = new mongoose.Schema({
  title: String, organization: String, type: String,
  startDate: String, endDate: String, description: String, order: Number,
}, { timestamps: true });

const Profile  = mongoose.models.Profile  ?? mongoose.model("Profile",  ProfileSchema);
const Project  = mongoose.models.Project  ?? mongoose.model("Project",  ProjectSchema);
const Skill    = mongoose.models.Skill    ?? mongoose.model("Skill",    SkillSchema);
const Experience = mongoose.models.Experience ?? mongoose.model("Experience", ExperienceSchema);

// --- Clear -------------------------------------------------------------------
await Promise.all([
  Profile.deleteMany({}),
  Project.deleteMany({}),
  Skill.deleteMany({}),
  Experience.deleteMany({}),
]);

// --- Profile -----------------------------------------------------------------
await Profile.create({
  name: "Ashwith Thatipally",
  tagline: "Applied AI & Data Science Student · Full-Stack & AI Application Developer",
  heroTagline: "ai / mobile / full-stack",
  bio: "Second-year BS Applied AI & Data Science student at IIT Jodhpur, building full-stack and AI-integrated applications end-to-end. I work across React Native mobile apps, Node.js/Express APIs, and AI-powered platforms using FastAPI and large language model APIs. Comfortable anywhere on the stack — React, MongoDB, PostgreSQL, and prompt-driven AI features.",
  pullQuote: "I build things that think.",
  currentlyBuilding: ["CineMatch — AI movie recommendation system", "This portfolio site"],
  location: "Hyderabad, India",
  email: "ashwiththatipally@gmail.com",
  resumeUrl: "",
  avatarUrl: "",
  socials: [
    { label: "GitHub", url: "https://github.com/ashwiththatipally" },
    { label: "LinkedIn", url: "https://linkedin.com/in/ashwiththatipally" },
  ],
});

// --- Projects ----------------------------------------------------------------
await Project.insertMany([
  {
    title: "PRIX",
    slug: "prix",
    summary: "Full-stack price-alert and wishlist management platform for e-commerce products.",
    description: `## PRIX — Price Alert & Wishlist Management Platform\n\nPRIX lets users save products from any e-commerce site, organise wishlists, and receive automated notifications the moment prices drop.\n\n### What I built\n- Product tracking pipeline that polls e-commerce pages and stores price history in MongoDB\n- Wishlist management with folder-style organisation\n- Real-time price-drop notification workflows\n- Full React Native mobile client with offline support\n\n### Stack\nReact Native · Node.js · Express.js · MongoDB`,
    role: "Solo developer",
    techStack: ["React Native", "Node.js", "Express.js", "MongoDB"],
    images: [],
    coverImage: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    published: true,
    order: 1,
  },
  {
    title: "CineMatch",
    slug: "cinematch",
    summary: "AI-powered movie recommendation system that answers natural-language queries in multiple languages.",
    description: `## CineMatch — AI Movie Recommendation System\n\nType a mood, a vibe, or a sentence — CineMatch understands it and returns personalised film picks in your language.\n\n### What I'm building\n- Natural-language query processing via LLM APIs\n- Multilingual recommendation delivery\n- Full-stack architecture: FastAPI backend, Next.js frontend, PostgreSQL\n- Prompt engineering for consistent, high-quality suggestions\n\n### Stack\nFastAPI · Next.js · PostgreSQL · LLM APIs`,
    role: "Solo developer",
    techStack: ["FastAPI", "Next.js", "PostgreSQL", "LLM APIs"],
    images: [],
    coverImage: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    published: true,
    order: 2,
  },
  {
    title: "Presently",
    slug: "presently",
    summary: "AI gifting assistant that generates personalised gift recommendations from a conversational interface.",
    description: `## Presently — AI Gifting Assistant\n\nPresently turns gift-giving anxiety into a conversation. Tell it who you're shopping for, what they love, and your budget — it handles the rest.\n\n### What I built\n- OpenAI API integration with carefully crafted system prompts\n- Responsive chat UI built in vanilla HTML, CSS, and JavaScript\n- Context-aware multi-turn recommendations\n\n### Stack\nOpenAI API · HTML · CSS · JavaScript`,
    role: "Solo developer",
    techStack: ["OpenAI API", "HTML", "CSS", "JavaScript"],
    images: [],
    coverImage: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    published: true,
    order: 3,
  },
  {
    title: "Blood Bank Management System",
    slug: "blood-bank",
    summary: "Web-based blood bank system for managing inventory and online requests between hospitals and donors.",
    description: `## Blood Bank Management System\n\nA team project built during the first semester: a responsive web platform that connects hospitals with blood donors, handles inventory tracking, and manages online blood requests.\n\n### My contributions\n- Responsive web pages across all device sizes\n- Core management features for inventory and request workflows\n\n### Stack\nHTML · CSS · JavaScript (team project)`,
    role: "Frontend developer (team)",
    techStack: ["HTML", "CSS", "JavaScript"],
    images: [],
    coverImage: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    published: true,
    order: 4,
  },
]);

// --- Skills ------------------------------------------------------------------
await Skill.insertMany([
  // Languages
  { name: "JavaScript", category: "Languages", order: 1 },
  { name: "TypeScript", category: "Languages", order: 2 },
  { name: "Python", category: "Languages", order: 3 },
  { name: "SQL", category: "Languages", order: 4 },
  { name: "HTML", category: "Languages", order: 5 },
  { name: "CSS", category: "Languages", order: 6 },
  // Frontend
  { name: "React", category: "Frontend", order: 10 },
  { name: "React Native", category: "Frontend", order: 11 },
  { name: "Next.js", category: "Frontend", order: 12 },
  { name: "Tailwind CSS", category: "Frontend", order: 13 },
  // Backend
  { name: "Node.js", category: "Backend", order: 20 },
  { name: "Express.js", category: "Backend", order: 21 },
  { name: "FastAPI", category: "Backend", order: 22 },
  // Databases
  { name: "MongoDB", category: "Databases", order: 30 },
  { name: "PostgreSQL", category: "Databases", order: 31 },
  { name: "Firebase", category: "Databases", order: 32 },
  { name: "Supabase", category: "Databases", order: 33 },
  // AI/ML
  { name: "Generative AI", category: "AI & ML", order: 40 },
  { name: "Prompt Engineering", category: "AI & ML", order: 41 },
  { name: "LLM APIs", category: "AI & ML", order: 42 },
  // Tools
  { name: "Git & GitHub", category: "Tools", order: 50 },
  { name: "Postman", category: "Tools", order: 51 },
  { name: "Vercel", category: "Tools", order: 52 },
  { name: "Tableau", category: "Tools", order: 53 },
  { name: "Linux / Ubuntu", category: "Tools", order: 54 },
]);

// --- Experience / Education --------------------------------------------------
await Experience.insertMany([
  {
    title: "BS, Applied AI and Data Science",
    organization: "Indian Institute of Technology Jodhpur",
    type: "education",
    startDate: "2025",
    endDate: "",
    description: "CGPA: 8.41 · Building full-stack and AI applications alongside coursework.",
    order: 1,
  },
  {
    title: "BS, Applied AI and Data Science",
    organization: "Leapstart School of Technology",
    type: "education",
    startDate: "2025",
    endDate: "",
    description: "Concurrent programme alongside IIT Jodhpur.",
    order: 2,
  },
  {
    title: "3rd Place — Kodryx AI Hackathon",
    organization: "Kodryx",
    type: "achievement",
    startDate: "2025",
    endDate: "2025",
    description: "Designed a workforce-management solution for task tracking, work verification, and accountability — improving task visibility and reducing manual follow-ups through transparent workflow management.",
    order: 3,
  },
  {
    title: "Senior Secondary (Class XII)",
    organization: "Alphores Junior College",
    type: "education",
    startDate: "2023",
    endDate: "2025",
    description: "Grade: 92%",
    order: 4,
  },
]);

console.log("✓ Seed complete");
await mongoose.disconnect();
