import translateError from "@/utils/mongodb.helper";
import userModel from "../user/user.model";
import IUser from "../user/user.interface";
import logger from "@/utils/logger";
import axios from "axios";
import { ObjectId } from "mongodb";

class UserService {
    public async getUserInfo(user: string): Promise<IUser> {
        try {
            const userInfo = await userModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(user),
                    },
                },
                {
                    $project: {
                        password: 0,
                        verifyEmailToken: 0,
                        forgotPasswordToken: 0,
                        __v: 0,
                    },
                },
            ]);

            return userInfo[0];
        } catch (error: any) {
            logger(error);
            throw new Error(translateError(error)[0] || "Unable to retrieve profile");
        }
    }

    public async updateProfile(user: string, data: { [key: string]: any }, photo: any) {
        try {
            const updatedUser = await userModel.findOneAndUpdate({ _id: new ObjectId(user) }, {
                ...data,
                photo: {
                    url: `${process.env.ORIGIN_URL}/${photo.path}`,
                    mimetype: photo.mimetype.toLowerCase(),
                    originalname: photo.originalname
                }
            }, {
                new: true,
                projection: { password: 0, verifyEmailToken: 0, __v: 0 },
            })

            if (!updatedUser) throw new Error("Unable to updated user profile")

            return updatedUser
        } catch (error: any) {
            logger(error);
            throw new Error(
                "Unable to updated user profile"
            );
        }
    }


    public async updateCustomUserData(userId: string, data: { [key: string]: any }) {
        try {
            const existingUser: IUser | null = await userModel.findById(userId);

            if (!existingUser) throw new Error("Data not found.")

            const updatedCustomData = { ...existingUser.customUserData, ...data };

            const updatedUser = await userModel.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        customUserData: updatedCustomData,
                    },
                },
                {
                    new: true,
                    projection: { password: 0, verifyEmailToken: 0 },
                }
            );

            logger(updatedUser);

            return updatedUser;
        } catch (error: any) {
            logger(error);
            throw new Error(
                translateError(error)[0] || "Unable to update user account"
            );
        }
    }
}

export default UserService;
