import IController from "interfaces/IController";
import { Router, Request, Response, NextFunction } from "express";
import * as validation from './user.validation'
import successResponse from "@/utils/success";
import HttpException from "@/exceptions/http.exception";
import authenticatedMiddleware from "@/middlewares/authenticate.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import userModel from "./user.model";
import UserService from "./user.service";
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
        this.router.post(`${this.path}/profile`, authenticatedMiddleware, diskUpload.single("photo"), validationMiddleware(validation.updatedProfile), this.updateProfile)
        this.router.post(`${this.path}/custom-data`, authenticatedMiddleware, this.updateCustomUserData)
    }

    private getUserInfo = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.getUserInfo(req.user)

            successResponse(200, 'Profile retrieved successfully', res, user)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private updateProfile = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => { 
        try {
            const { firstname, lastname, email } = req.body;
            const user = await this.userService.updateProfile(req.user, { firstname, lastname, email }, req.file)

            successResponse(200, 'Profile updated successfully', res, user)
        } catch (error: any) {
            logger(error)
            return next(new HttpException(400, error.message));
        }
    }

    private updateCustomUserData = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.updateCustomUserData(req.user, req.body);

            successResponse(200, 'Profile updated successfully', res, user)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

}

export default UserController