import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LoginConfig, LoginResponse, SignUpConfig, VerifyEmailConfig } from './auth.interfaces.';
// import { User } from '../user';

/**
 * Authentication resource for interacting with user authentication endpoints.
 */
export default class Auth {
  /**
   * Axios instance for making HTTP requests.
   */
  private apiClient: AxiosInstance;

  /**
   * Constructs a new Auth instance.
   * @param {string} apiKey - The API key for authentication.
   */
  constructor(apiClient: AxiosInstance, projectId: string) {
    this.apiClient = apiClient;
  }

  /**
   * Signs up a new user.
   * @param {SignUpData} userData - Data required for user signup.
   * @returns {Promise<void>} A Promise that resolves when signup is successful.
   */
  async signUp(userData: SignUpConfig): Promise<void> {
    // Implementation
  }

  /**
   * Logs in a user.
   * @param {LoginData} loginData - Data required for user login.
   * @returns {Promise<string>} A Promise that resolves with the access token upon successful login.
   */
  async login(loginData: LoginConfig): Promise<void> {
    // Implementation
    const response: AxiosResponse<LoginResponse> = await this.apiClient({
      method: 'POST',
      data: loginData
    })

    console.log(response)

    // return response;
  }

  /**
   * Verifies a user's email.
   * @param {VerifyEmailData} verifyEmailData - Data required for verifying user email.
   * @returns {Promise<void>} A Promise that resolves when email verification is successful.
   */
  async verifyEmail(verifyEmailData: VerifyEmailConfig): Promise<void> {
    // Implementation
  }
}
