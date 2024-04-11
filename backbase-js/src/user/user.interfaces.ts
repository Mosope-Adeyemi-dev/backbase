/**
 * Data representing a user.
 */
export interface User {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    _id: string;
    isEmailVerified: boolean;
    photo?: string;
    customUserData?: { [key: string]: any }
  }
  
  export interface CustomUserData {
    customUserData: { [key: string]: any }
  }
  
  export interface UpdateUserProfile {
    firstname?: string;
    lastname?: string;
    email?: string;
    photo?: string;
  }