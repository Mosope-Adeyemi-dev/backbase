import IController from "interfaces/IController";
import { Router, Request, Response, NextFunction } from "express";
import successResponse from "@/utils/success";
import HttpException from "@/exceptions/http.exception";
import authenticatedMiddleware from "@/middlewares/authenticate.middleware";
import BucketService from './service.bucket';
import fs from 'fs';


class BucketController implements IController {
    public path = '/bucket';
    public router = Router();
    private bucketService = new BucketService();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}/:bucketName/:filename`, this.getFile)
    }

    private getFile = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { bucketName, filename } = req.params;

            const filePath = await this.bucketService.getFile(bucketName, filename);

            const fileStream = fs.createReadStream(filePath);

            fileStream.on('open', async () => {
                // Set the appropriate Content-Type header based on file extension
                const contentType = await this.bucketService.getContentType(filename);
                
                res.set('Content-Type', contentType);
                fileStream.pipe(res);
            });

            fileStream.on('error', (err) => {
                return next(new HttpException(500, "Unable to retrieve file"));
            });
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }
}

export default BucketController;