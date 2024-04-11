import { Schema, Mongoose, model } from "mongoose";
import bcrypt from 'bcrypt'
import IUser from "./user.interface";
import logger from "@/utils/logger";

logger("user model running")

const UserSchema = new Schema({
  firstname: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: { type: Boolean, default: false },
  verifyEmailToken: {
    token: { type: String, required: true },
    expires: { type: Date },
  },
  forgotPasswordToken: {
    token: { type: String },
    expires: { type: Date },
  },
  photo: {
    url: String,
    mimetype: { type: String, enum: ['application/pdf', 'image/png', 'image/jpeg' ,'image/jpg']},
    originalname: String
  },
  customUserData: {
    type: Object,
    
  }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.password == null) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash;

  next();
});

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  if (!this.password) throw new Error("Complete your account signup")

  return await bcrypt.compare(password, this.password)
};

export default model<IUser>('User', UserSchema)