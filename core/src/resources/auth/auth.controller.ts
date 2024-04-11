import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import IController from "interfaces/IController";
import IUser from "../user/user.interface";
import AuthService from './auth.service'
import * as validation from './auth.validation' 
import successResponse from "@/utils/success";
import HttpException from "@/exceptions/http.exception";
import validationMiddleware from '@/middlewares/validation.middleware';
import logger from '@/utils/logger'
import authenticatedMiddleware from '@/middlewares/authenticate.middleware';
import UserService from "../user/user.service";

class AuthController implements IController{
    public path = '/auth'
    public router = Router()
    private authService = new AuthService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/signup`, validationMiddleware(validation.signup), this.signup)
        this.router.post(`${this.path}/login`, validationMiddleware(validation.login), this.login)
        this.router.post(`${this.path}/verify-email`, validationMiddleware(validation.verifyEmail), this.verifyEmail)
        this.router.post(`${this.path}/verification/otp`, validationMiddleware(validation.requestVerificationOtp), this.requestEmailVerificationOtp)
        this.router.post(`${this.path}/forgot-password`, validationMiddleware(validation.requestVerificationOtp), this.requestForgotPasswordOtp)
        this.router.put(`${this.path}/reset-password`, validationMiddleware(validation.resetPassword), this.resetPassword)
    }

    private signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { firstname, lastname, email, password } = req.body

            const response = await this.authService.signup(firstname, password, email, lastname)

            res.header('Authorization', response.accessToken)
            res.cookie('refreshToken', response.refreshToken, { httpOnly: true, sameSite: 'strict' })

            successResponse(201, 'Signup successful', res, response)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
        
            const response = await this.authService.login(email, password)

            res.header('Authorization', response.accessToken)
            res.cookie('refreshToken', response.refreshToken, { httpOnly: true, sameSite: 'strict' })

            successResponse(201, 'Login successful', res, response)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, token } = req.body;
        
            const response = await this.authService.verifyEmail(token, email)

            successResponse(201, 'Email verified successfully.', res)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private requestEmailVerificationOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.body;
        
            await this.authService.requestEmailVerification(email)

            successResponse(200, 'Account verification otp sent if account exists.', res)
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private requestForgotPasswordOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.body;
        
            await this.authService.forgotPassword(email)

            successResponse(200, 'Forgot password otp sent if account exists.', res)
        } catch (error: any) {
            logger(error)
            return next(new HttpException(400, error.message));
        }
    }

    private resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, newPassword, token } = req.body;
        
            await this.authService.resetPassword(email, token, newPassword)

            successResponse(200, 'Password reset successfully.', res)
        } catch (error: any) {
            logger(error)
            return next(new HttpException(400, error.message));
        }
    }
}

export default AuthController