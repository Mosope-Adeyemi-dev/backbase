import IController from "interfaces/IController";
import { Router, Request, Response, NextFunction } from "express";
import * as validation from './project.validation'
import successResponse from "@/utils/success";
import HttpException from "@/exceptions/http.exception";
import authenticatedMiddleware from "@/middlewares/authenticate.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import ProjectService from "./project.service";
import multer from "multer";

class ProjectController implements IController {
    public path = '/project'
    public router = Router()
    private service = new ProjectService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/create/manual`, validationMiddleware(validation.createProjectManually), authenticatedMiddleware, this.createProjectManually)
        this.router.post(`${this.path}/create/upload`, authenticatedMiddleware, multer().single("backbase"), this.createProjectUpload)
        this.router.post(`${this.path}/validate`, validationMiddleware(validation.validateProject), this.validateProjectApiCredentials)
    }

    private createProjectManually = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.service.createProjectManually(req.user, req.body)

            successResponse(200, 'Project created successfully', res, result)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private createProjectUpload = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            if(!req.file) throw new Error("Backbase.yaml is required")
            const result = await this.service.createProjectUpload(req.user, req.file)

            successResponse(200, 'Project created successfully', res, result)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private validateProjectApiCredentials = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            if(!req.headers['backbase-api-key']) throw new Error("API key not found. Include API Key in request header.")
            await this.service.validateProject(req.headers['backbase-api-key'], req.body.projectId)
            successResponse(200, "API credentials validated successfully", res);
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }
}

export default ProjectController