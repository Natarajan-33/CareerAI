import axios from 'axios';

/**
 * Base API service for handling HTTP requests
 */
export class ApiService {
  constructor() {
    this.baseURL = '/api/v1';
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle token expiration
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a GET request
   */
  async get(url, config) {
    const response = await this.api.get(url, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post(url, data, config) {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put(url, data, config) {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete(url, config) {
    const response = await this.api.delete(url, config);
    return response.data;
  }
}
