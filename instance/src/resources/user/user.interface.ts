import { ObjectId } from "mongoose";

interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    id: string;
    isEmailVerified: boolean;
    verifyEmailToken: {
        token: string;
        expires: Date,
    };
    forgotPasswordToken: {
        token: string;
        expires: Date,
    }
    photo?: string;
    customUserData: { [key: string]: any}
    
    isValidPassword(password: string): Promise<Error | boolean>; 
}

export default IUser