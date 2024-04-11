import { model, Schema } from "mongoose";
import mongoose from "mongoose";
import * as yaml from 'js-yaml';
import fs from 'fs';
import logger from "@/utils/logger";

console.log("Loading project custom model")

const exportModels: any = {}

// export default async function generateCustomModels() {
try {
    if (fs.existsSync('./backly.yaml')) {
        const parsedSchema: any = yaml.load(fs.readFileSync('./backly.yaml', 'utf8'))

        if (parsedSchema.database) {
            logger(parsedSchema.database)
            for (const collectionSchema of parsedSchema?.database?.collections) {

                const collectionName = Object.keys(collectionSchema)[0].toLowerCase();

                exportModels[collectionName] = model(collectionName, new Schema(
                    {
                        ...collectionSchema,
                        files: [
                            {
                                url: String,
                                 mimetype: { type: String, enum: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'] },
                                originalname: String
                            }
                        ]
                    },
                    {
                        timestamps: true,
                    }
                ));
            }
        } else {
            logger("No database configuration found in project configuration")
        }

    }

} catch (error: any) {
    logger(error)
    throw new Error(error || "Error: Unable to load project database schema.")
}

logger(exportModels)

export default exportModels;

