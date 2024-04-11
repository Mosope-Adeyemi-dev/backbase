import translateError from "@/utils/mongodb.helper";
import mongoose, { Model } from 'mongoose';
import generateCustomModels from "./custom.model";
import IUser from '../user/user.interface';
import logger from "@/utils/logger";
import axios from "axios";
import { ObjectId } from "mongodb";
import * as customModels from './custom.model';
import userModel from "../user/user.model";

class CustomService {
    public async findById(collectionName: string, id: string): Promise<any> {
        try {
            const collectionModel = customModels.default[collectionName.toLowerCase()];

            if (collectionName.toLowerCase() == "users" || collectionName == "auths") throw new Error("Can not access collection via custom endpoint.")

            if (!collectionModel) throw new Error("Collection does not exist. Please declare custom collections in your backbase.yaml config file.")

            const result = await collectionModel.findOne({
                _id: new ObjectId(id)
            }, { projection: { password: 0, verifyEmailToken: 0 } })

            if (!result) throw new Error("Data not found.")

            return result;
        } catch (error: any) {
            logger(error)
            throw new Error(translateError(error)[0] || 'Unable to retrieve data')
        }
    }

    public async findAll(collectionName: string): Promise<any> {
        try {
            const collectionModel = customModels.default[collectionName.toLowerCase()];

            if (collectionName.toLowerCase() == "users" || collectionName == "auths") throw new Error("Can not access collection via custom endpoint.")

            if (!collectionModel) throw new Error("Collection does not exist. Please declare custom collections in your backbase.yaml config file.")
            const result = await collectionModel.find();

            if (!result) throw new Error("Data not found.")

            return result;
        } catch (error: any) {
            logger(error)
            throw new Error(translateError(error)[0] || 'Unable to retrieve data')
        }
    }

    public async add(collectionName: string, data: any, files: any[]): Promise<any> {
        try {
            const collectionModel = customModels.default[collectionName.toLowerCase()];

            if (collectionName.toLowerCase() == "users" || collectionName == "auths") throw new Error("Can not access collection via custom endpoint.")

            if (!collectionModel) throw new Error("Collection does not exist. Please declare custom collections in your backbase.yaml config file.")
            logger(collectionModel)

            const parsedFiles: { url: string; mimetype: string; originalname: string; }[] = [];

            files.forEach(file => {
                parsedFiles.push({
                    url: `${process.env.ORIGIN_URL}/${file.path}`,
                    mimetype: file.mimetype.toLowerCase(),
                    originalname: file.originalname
                })
            })
            const result = await mongoose.connection.db.collection(collectionName.toLowerCase()).insertOne({
                ...data,
                files: parsedFiles
            });

            if (!result) throw new Error("Unable to add data to " + collectionName + " collection")

            const insertedData = await collectionModel.findById(result.insertedId);

            return insertedData;
        } catch (error: any) {
            logger(error)
            throw new Error(translateError(error)[0] || 'Unable to add data')
        }
    }
}

export default CustomService