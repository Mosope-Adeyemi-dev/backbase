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
                    },
                },
            ]);

            return userInfo[0];
        } catch (error: any) {
            throw new Error(translateError(error)[0] || "Unable to retrieve profile");
        }
    }

    public async uploadAvatar(user: string, photo: any): Promise<IUser> {
        try {
            const updatedUser = await userModel.findOneAndUpdate({_id: new ObjectId(user)}, {
                avatar: {
                    url: `${process.env.ORIGIN_URL}/${photo.path}`,
                    mimetype: photo.mimetype.toLowerCase(),
                    originalname: photo.originalname
                }
            }, { new: true })

            logger(updatedUser)

            if(!updatedUser) throw new Error("Unable to upload photo, please try again.")

            return updatedUser;
        } catch (error: any) {
            throw new Error(translateError(error)[0] || "Unable to retrieve profile");
        }
    }
 }

export default UserService;
