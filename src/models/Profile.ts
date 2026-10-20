import mongoose, { Schema, type Document } from "mongoose";

export interface IProfile extends Document {
  name: string;
  tagline: string;
  heroTagline: string;
  bio: string;
  pullQuote: string;
  currentlyBuilding: string[];
  location: string;
  email: string;
  resumeUrl: string;
  avatarUrl: string;
  socials: { label: string; url: string }[];
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    heroTagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    pullQuote: { type: String, default: "" },
    currentlyBuilding: [{ type: String }],
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    socials: [{ label: String, url: String }],
  },
  { timestamps: true }
);

export const Profile =
  mongoose.models.Profile ?? mongoose.model<IProfile>("Profile", ProfileSchema);
