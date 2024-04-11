// src/Users.ts
import axios, { AxiosInstance } from 'axios';
import { User } from './user.interfaces';

/**
 * Users resource for interacting with user management endpoints.
 */
export default class Users {
  /**
   * Axios instance for making HTTP requests.
   */
  private apiClient: AxiosInstance;

  /**
   * Constructs a new Users instance.
   * @param {string} apiKey - The API key for authentication.
   */
  constructor(apiClient: AxiosInstance, projectId: string) {
    this.apiClient = apiClient;
  }

  /**
   * Retrieves user information by user ID.
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<void>} A Promise that resolves with the user data.
   */
  async getUser(userId: string): Promise<void> {
    // Implementation
  }

  /**
   * Updates an existing user.
   * @param {string} userId - The ID of the user to update.
   * @param {UserData} userData - Data representing the updated user.
   * @returns {Promise<void>} A Promise that resolves when user update is successful.
   */
  async updateUser(userId: string, userData: User): Promise<void> {
    // Implementation
  }

  /**
   * Deletes a user by user ID.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<void>} A Promise that resolves when user deletion is successful.
   */
  async deleteUser(userId: string): Promise<void> {
    // Implementation
  }
}
