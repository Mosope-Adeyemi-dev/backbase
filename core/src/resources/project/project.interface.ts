import { ObjectId } from "mongoose";

interface IProject {
    project: {
        name: string
    };
    database: {
        name: string,
        collections: {}[]
    };
    owner: ObjectId;
    apiKey: {
        key: string,
        expiresIn: string,
        createdAt: string,
        isValid: boolean
    };
    isLive: Boolean;
}

export default IProject;