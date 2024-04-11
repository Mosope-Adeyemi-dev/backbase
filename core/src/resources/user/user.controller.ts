import IController from "interfaces/IController";
import { Router, Request, Response, NextFunction } from "express";
import * as validation from './user.validation'
import successResponse from "@/utils/success";
import HttpException from "@/exceptions/http.exception";
import authenticatedMiddleware from "@/middlewares/authenticate.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import UserService from "./user.service";
import s3Upload from "@/configs/s3.config";
import diskUpload from "@/configs/multer.config";
import logger from "@/utils/logger";

class UserController implements IController {
    public path = '/user'
    public router = Router()
    private userService = new UserService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}/profile`, authenticatedMiddleware, this.getUserInfo)
        this.router.put(`${this.path}/avatar`, authenticatedMiddleware, diskUpload.single('avatar'), this.uploadPhoto )
    }

    private getUserInfo = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.getUserInfo(req.user)

            successResponse(200, 'Profile retrieved successfully', res, user)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private uploadPhoto = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger(req.file)

            if(!req.file) throw new Error("Photo not found.")

            const user = await this.userService.uploadAvatar(req.user, req.file) 
            
            successResponse(200, 'Profile photo uploaded successfully', res)
        } catch (error: any) {
            logger(error)
            return next(new HttpException(400, "Unable to upload photo. Please try again."));
        }
    }
}

export default UserController