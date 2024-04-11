import { Request, Response, NextFunction } from "express"
import HttpException from '../exceptions/http.exception'

function ErrorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const statusCode = error.status || 400
    let message;

    try {
        message = JSON.parse(error.message)
    } catch (e: any) {
        message = error.message || "Something went wrong. Please try again."
    }

    res.status(statusCode).send({
        success: false,
        statusCode,
        message: message,
    })
}
export default ErrorMiddleware