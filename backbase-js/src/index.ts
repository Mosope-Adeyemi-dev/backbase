// src/index.ts
import Auth from './auth/auth';
import Users from './user/user';
import Collections from './collection/collection';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export interface SDKConfig {
  projectId: string;
  apiKey: string;
}

// export interface BadRequest {
//   status: boolean;
//   message: string;
//   data: null;
// }

export interface VerifyCredentialsResponse {
  success: boolean;
  message: string;
}

export default class BackbaseSDK {
  readonly auth: Auth | undefined;
  readonly users: Users | undefined;
  readonly collections: Collections | undefined;
  readonly projectBaseUrl: string | undefined;
  private readonly apiClient: AxiosInstance;

  constructor(config: SDKConfig) {
    const { apiKey, projectId } = config;

    this.apiClient = axios.create({
      baseURL: 'https://api.example.com',
      headers: {
        'backbase-api-key': config.apiKey,
      },
    });

    // this.apiClient.interceptors.response.use(
    //   (response) => (response.data = JSON.parse(response.data)),
    // );

    // this.verifyCredentials(config);

    this.projectBaseUrl = "http://localhost:4002/"
    this.auth = new Auth(this.apiClient, this.projectBaseUrl);
    this.users = new Users(this.apiClient, this.projectBaseUrl);
    this.collections = new Collections(this.apiClient, this.projectBaseUrl);

    async () => {
      await this.verifyCredentials(config).catch(error => {
        console.error('Error verifying credentials:', error);
      });
    };
  }

  private async verifyCredentials(config: SDKConfig): Promise<VerifyCredentialsResponse | void> {
    const { apiKey, projectId } = config;
    try {
      const response = await this.apiClient({
        method: 'POST',
        url: "/project/validate",
        headers: {
          'backbase-api-key': config.apiKey
        },
        data: {
          projectId: config.projectId
        }
      })

      console.log(response);
      return response.data;
    } catch (error: any) {
      console.error(error);

      throw new Error("Backbase SDK error");
      // console.log(error)
      // if (axios.isAxiosError(error)) {
      //   const axiosError = error as AxiosError;
      //   if (axiosError.response) {
      //     console.error('Request failed with status:', axiosError.response.status);
      //     console.error('Response data:', axiosError.response.data);
      //     console.error('Response headers:', axiosError.response.headers);
      //   }
      // } else {
      //   // Non-Axios error
      //   console.error('Error:', error);

      //   }
    }
  }

}
