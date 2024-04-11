import { Schema, Mongoose, model } from "mongoose";
import bcrypt from 'bcrypt'
import IProject from "./project.interface";
import logger from "@/utils/logger";
import { ObjectId } from "mongodb";

logger("user model running")

const ProjectSchema = new Schema({
  project: {
    name: { type: String, required: true }
  },
  database: {
    name: { type: String, required: true },
    collections: []
  },
  owner: {
    type: ObjectId, ref: 'User', required: true
  },
  apiKey: {
    key: String,
    expiresIn: String,
    createdAt: String,
    isValid: Boolean,
  },
  isLive: {
    type: Boolean, default: false
  }
}, { timestamps: true });

export default model<IProject>('Project', ProjectSchema)