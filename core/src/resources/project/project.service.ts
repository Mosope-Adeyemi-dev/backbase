import translateError from "@/utils/mongodb.helper";
import projectModel from "./project.model";
import IUser from "../user/user.interface";
import logger from "@/utils/logger";
import axios from "axios";
import { ObjectId, UUID } from "mongodb";
import yaml from 'js-yaml';
import fs from "fs";
import IProject from "./project.interface";
import { Multer } from "multer";
import app from "../../server";
import * as pulumi from "@pulumi/pulumi";
import * as mongodbatlas from "@pulumi/mongodbatlas";
import * as random from "@pulumi/random";
import urllib from 'urllib';
import AxiosDigestAuth from '@mhoc/axios-digest-auth';
import * as crypto from 'crypto';
import * as request from 'request';
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import bcrypt from 'bcrypt';

class ProjectService {
    public async createProjectManually(userId: string, projectData: IProject): Promise<{apikey: string, projectId: string}> {
        try {
            const key = uuidv4();

            const result = await projectModel.create({
                project: projectData.project,
                database: projectData.database,
                owner: userId,
                apiKey: {
                    key: `${await bcrypt.hash(JSON.stringify(key), 10)}`,
                    expiresIn: moment(new Date()).add(12, "M").toDate(), // expires in 12 months
                    createdAt: moment(new Date()).toDate(),
                    isValid: true
                },
                isLive: false,
            })

            if (!result) throw new Error("Unable to create project. Please try again.")

            return {
                apikey: key,
                projectId: result.id,
            };
        } catch (error: any) {
            throw new Error(translateError(error)[0] || "Unable to create project. Please try again.");
        }
    }

    public async createProjectUpload(userId: string, backbaseYamlFile: Express.Multer.File): Promise<void> {
        try {
            const yamlData = backbaseYamlFile.buffer.toString('utf8')
            const parsedData: any = yaml.load(yamlData);

            const allowedTypes = ['string', 'number', 'date', 'objectid', 'object', 'array'];
            const validationErrors: string[] = [];

            if (typeof parsedData.project?.name !== 'string') {
                validationErrors.push('Project name is missing or invalid.');
            }

            if (typeof parsedData.database?.name !== 'string') {
                validationErrors.push('Database name is missing or invalid.');
            }

            // Validate collections
            if (!Array.isArray(parsedData.database?.collections)) {
                validationErrors.push('Collections array is missing or invalid.');
            } else {
                parsedData.database.collections.forEach((collection: any, index: number) => {
                    if (typeof collection !== 'object') {
                        validationErrors.push(`Collection at index ${index} is invalid.`);
                    } else {
                        const collectionName = Object.keys(collection)[0];
                        const fields = collection[collectionName];

                        if (typeof fields !== 'object') {
                            validationErrors.push(`Fields for collection '${collectionName}' are missing or invalid.`);
                        } else {
                            for (const fieldName in fields) {
                                const field = fields[fieldName];

                                if (field == null || (field.type == null && Object.keys(field)?.length <= 0)) {
                                    validationErrors.push(`Field '${fieldName}' in collection '${collectionName}' is missing or invalid type.`);
                                } else if (field.type && !allowedTypes.includes(field.type.toLowerCase())) {
                                    validationErrors.push(`Field ${fieldName} has an invalid type ${field}.`)
                                }

                                // TODO: refactor to validate project config file recursively.
                            }
                        }
                    }
                });
            }

            logger(validationErrors)

            if (validationErrors.length > 0) throw new Error(JSON.stringify(validationErrors));

            const result = await projectModel.create({
                project: parsedData.project,
                database: parsedData.database,
                owner: userId
            })

            if (!result) throw new Error("Unable to create project. Please try again.")

            logger(result);

        } catch (error: any) {
            throw new Error(translateError(error)[0] || "Unable to create project. Please try again.");
        }
    }

    public async validateProject(key: string, projectId: string): Promise<IProject> {
        try {
            const project = await projectModel.findById(projectId);
            if(!project) throw new Error("Project not found.");
            const { isLive, apiKey } = project;

            if(!await bcrypt.compare(key, apiKey.key) || !apiKey.isValid) throw new Error("Unauthorized: Invalid project credentials.")
            
            return project;
        } catch (error: any) {
            throw new Error(translateError(error)[0] || "Unable to verify API key.");
        }
    }
}

export default ProjectService;
