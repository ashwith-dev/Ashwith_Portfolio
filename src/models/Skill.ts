import mongoose, { Schema, type Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: string;
  level: string;
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SkillSchema.index({ order: 1 });

export const Skill =
  mongoose.models.Skill ?? mongoose.model<ISkill>("Skill", SkillSchema);
