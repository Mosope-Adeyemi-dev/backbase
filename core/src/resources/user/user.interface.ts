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
    photo?: string;
    customUserData: { [key: string]: any}
    avatar: { [key: string]: any};
    verifyEmailToken: {
        token: string;
        expires: Date,
    };
    forgotPasswordToken: {
        token: string;
        expires: Date,
    }
    
    isValidPassword(password: string): Promise<Error | boolean>; 
}

export default IUser