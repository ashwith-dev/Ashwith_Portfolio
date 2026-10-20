import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1).max(100),
  tagline: z.string().max(200).optional().default(""),
  heroTagline: z.string().max(200).optional().default(""),
  bio: z.string().max(2000).optional().default(""),
  pullQuote: z.string().max(300).optional().default(""),
  currentlyBuilding: z.array(z.string().max(100)).optional().default([]),
  location: z.string().max(100).optional().default(""),
  email: z.string().email().max(200).optional().default(""),
  resumeUrl: z.string().url().optional().or(z.literal("")).default(""),
  avatarUrl: z.string().url().optional().or(z.literal("")).default(""),
  socials: z
    .array(z.object({ label: z.string().max(50), url: z.string().url().max(300) }))
    .optional()
    .default([]),
});

export const ProjectSchema = z.object({
  title: z.string().min(1).max(150),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  summary: z.string().max(500).optional().default(""),
  description: z.string().max(10000).optional().default(""),
  role: z.string().max(100).optional().default(""),
  techStack: z.array(z.string().max(50)).optional().default([]),
  images: z
    .array(z.object({ url: z.string().url(), alt: z.string().max(200).default("") }))
    .optional()
    .default([]),
  coverImage: z.string().url().optional().or(z.literal("")).default(""),
  liveUrl: z.string().url().optional().or(z.literal("")).default(""),
  githubUrl: z.string().url().optional().or(z.literal("")).default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

export const SkillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  level: z.string().max(50).optional().default(""),
  order: z.number().int().optional().default(0),
});

export const ExperienceSchema = z.object({
  title: z.string().min(1).max(200),
  organization: z.string().min(1).max(200),
  type: z.enum(["work", "education", "internship", "achievement", "other"]),
  startDate: z.string().min(4).max(20),
  endDate: z.string().max(20).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  order: z.number().int().optional().default(0),
});

export const MessageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(1).max(2000),
  _hp: z.string().max(0).optional(), // honeypot — must be empty
});

export const LoginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});
