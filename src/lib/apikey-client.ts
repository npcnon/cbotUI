import apiClient from "./api-client";
import { ApiKey, ApiKeyFormData, ApiKeyResponse } from "./types/types";

const API_ENDPOINT = '/api-keys';

export const fetchApiKeys = async (): Promise<ApiKey[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching API keys:', error);
    throw new Error('Failed to fetch API keys');
  }
};

export const createApiKey = async (keyData: ApiKeyFormData): Promise<ApiKeyResponse> => {
  try {
    const response = await apiClient.post(API_ENDPOINT, keyData);
    return response.data;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw new Error('Failed to create API key');
  }
};

export const deleteApiKey = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${API_ENDPOINT}/${id}`);
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw new Error('Failed to delete API key');
  }
};
