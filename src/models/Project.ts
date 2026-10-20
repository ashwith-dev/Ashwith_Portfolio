import mongoose, { Schema, type Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  role: string;
  techStack: string[];
  images: { url: string; alt: string }[];
  coverImage: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    role: { type: String, default: "" },
    techStack: [{ type: String }],
    images: [{ url: String, alt: { type: String, default: "" } }],
    coverImage: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ order: 1 });
ProjectSchema.index({ published: 1 });

export const Project =
  mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema);
