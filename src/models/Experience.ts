import mongoose, { Schema, type Document } from "mongoose";

export interface IExperience extends Document {
  title: string;
  organization: string;
  type: "work" | "education" | "internship" | "achievement" | "other";
  startDate: string;
  endDate: string;
  description: string;
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    type: {
      type: String,
      enum: ["work", "education", "internship", "achievement", "other"],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ExperienceSchema.index({ order: 1 });

export const Experience =
  mongoose.models.Experience ??
  mongoose.model<IExperience>("Experience", ExperienceSchema);
