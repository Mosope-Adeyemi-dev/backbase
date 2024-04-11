
import IController from "interfaces/IController";
import { Router, Request, Response, NextFunction } from "express";
import successResponse from "@/utils/success";
import HttpException from "@/exceptions/http.exception";
import authenticatedMiddleware from "@/middlewares/authenticate.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import CustomService from "./custom.service";
import logger from "@/utils/logger";
import diskUpload from "@/configs/multer.config";

class CustomController implements IController {
    public path = '/'
    public router = Router()
    private customService = new CustomService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get(`/get/:collection/:id`, authenticatedMiddleware, this.getById)
        this.router.get(`/get/:collection`, authenticatedMiddleware, this.getAll)
        this.router.post(`/add/:collection`, authenticatedMiddleware, diskUpload.any(), this.addData)
    }

    private getById = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger(req.params)
            const { collection, id} = req.params;

            const data = await this.customService.findById(collection, id)

            successResponse(200, 'Data retrieved successfully', res, data)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private getAll = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { collection } = req.params;

            const data = await this.customService.findAll(collection)

            successResponse(200, 'Data retrieved successfully', res, data)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private addData = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger(req.params)
            const { collection } = req.params;

            if(!req.body) throw new Error("Data can not be null")

            const data = await this.customService.add(collection, req.body, req.files)

            successResponse(200, 'Data added successfully', res, data)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

}

export default CustomController