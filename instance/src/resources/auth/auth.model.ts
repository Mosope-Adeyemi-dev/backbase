import { model, Schema, SchemaType } from "mongoose";
import IAuth from "./auth.interface";
import * as yaml from 'js-yaml';
import fs from 'fs';
import logger from "@/utils/logger";

console.log("running the auth model")

const AuthModel = new Schema(
    {
        userId: {
            type: Schema.ObjectId,
            required: true,
            ref: 'User'
        },
        token: {
            type: String,
            required: true
        },
        expireAt: { type: Date, default: Date.now() + 30 * 24 * 60 * 60 * 1000, index: { expires: '30d' } } // document is deleted after 30 days
    },
    {
        timestamps: true,
    }
);
const exportModel = model<IAuth>('Auth', AuthModel)

export default exportModel