import { User } from '../user/user.interfaces';
/**
 * User signup config.
 */
export interface SignUpConfig {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

/**
 * User login config.
 */
export interface LoginConfig {
    email: string;
    password: string;
}

/**
 * User login response
 */
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User
}

/**
 * Verify user's email config.
 */
export interface VerifyEmailConfig {
    email: string;
    verificationCode: string;
}

/**
 * Request user's email verificationCode
 */
export interface RequestVerificationCodeConfig {
    email: string
}

/**
 * Forgot password config.
 */
export interface ForgotPasswordConfig {
    email: string
}

/**
 * Reset password config.
 */
export interface ResetPasswordConfig {
    email: string;
    verificationCode: string;
    newPassword: string
}