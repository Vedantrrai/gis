import axios, { AxiosError } from 'axios';

// Get base URL from environment or fallback to localhost:8000
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export interface ApiError {
  message: string;
  statusCode?: number;
  isNetworkError: boolean;
  endpoint?: string;
}

export function parseAxiosError(error: unknown, endpoint?: string): ApiError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string; detail?: string }>;
    if (err.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out after 12 seconds. The GIS computing server took too long to respond.',
        isNetworkError: true,
        endpoint,
      };
    }
    if (!err.response) {
      return {
        message: `Backend service is unreachable at ${API_BASE_URL}. Ensure the backend service is running or switch to Demo Mode.`,
        isNetworkError: true,
        endpoint,
      };
    }
    const serverMessage = err.response.data?.detail || err.response.data?.message || err.message;
    return {
      message: serverMessage || `Server returned error (${err.response.status})`,
      statusCode: err.response.status,
      isNetworkError: false,
      endpoint,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred.',
    isNetworkError: false,
    endpoint,
  };
}
