import BackbaseSDK, { SDKConfig, VerifyCredentialsResponse } from "..";
import { describe, test, expect } from "@jest/globals"
import axios from 'axios';

const sdkConfig = {
    apiKey: "1f1ae836-274b-4d87-891a-2f997b83359c",
    projectId: "661104a6d40827818907e26b"
}

// test("Verify SDK Credentials", async () => {
//     expect(new BackbaseSDK(sdkConfig)).not.toThrow("Backbase SDK error")
// })


jest.mock('axios');

describe('BackbaseSDK', () => {
  let sdk: BackbaseSDK;
  const config: SDKConfig = {
    apiKey: "1f1ae836-274b-4d87-891a-2f997b83359c",
    projectId: "661104a6d40827818907e26b"
}

  beforeEach(() => {
    sdk = new BackbaseSDK(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of BackbaseSDK', () => {
    expect(sdk).toBeInstanceOf(BackbaseSDK);
  });



  it('should verify credentials on initialization', async () => {
    const mockResponse = { success: true, message: 'Credentials verified' };
    (axios.create as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const response = await sdk['verifyCredentials'](config);
    expect(response).toEqual(mockResponse);
  }); 
  
  it('should initialize with provided configuration', () => {
    expect(sdk.auth).toBeDefined();
    expect(sdk.users).toBeDefined();
    expect(sdk.collections).toBeDefined();
    expect(sdk.projectBaseUrl).toBe('http://localhost:4002/');
  });

//   it('should handle error when verifying credentials', async () => {
//     const errorMessage = 'Backbase SDK error';
//     (axios.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

//     await expect(sdk['verifyCredentials'](config)).rejects.toThrow(errorMessage);
//   });
});
