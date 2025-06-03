import axios from 'axios';

/**
 * Base API service for handling HTTP requests with retry logic and improved error handling
 */
export class ApiService {
  constructor() {
    this.baseURL = '/api/v1';
    this.maxRetries = 3; // Maximum number of retry attempts
    this.retryDelay = 1000; // Delay between retries in milliseconds
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Add timestamp to prevent caching issues
        config.params = { ...config.params, _t: new Date().getTime() };
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
          return Promise.reject(error);
        }
        
        // Log connection errors for debugging
        if (error.code === 'ECONNABORTED' || !error.response) {
          console.error('Connection error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Execute a request with retry logic
   * @private
   */
  async _executeWithRetry(requestFn, retries = 0) {
    try {
      return await requestFn();
    } catch (error) {
      // Only retry on network errors or 5xx server errors
      const shouldRetry = (
        (error.code === 'ECONNABORTED' || !error.response || (error.response && error.response.status >= 500)) && 
        retries < this.maxRetries
      );
      
      if (shouldRetry) {
        console.log(`API request failed, retrying (${retries + 1}/${this.maxRetries})...`);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retries + 1)));
        return this._executeWithRetry(requestFn, retries + 1);
      }
      
      throw error;
    }
  }
  
  /**
   * Make a GET request with retry logic
   */
  async get(url, config) {
    const response = await this._executeWithRetry(() => this.api.get(url, config));
    return response.data;
  }

  /**
   * Make a POST request with retry logic
   */
  async post(url, data, config) {
    const response = await this._executeWithRetry(() => this.api.post(url, data, config));
    return response.data;
  }

  /**
   * Make a PUT request with retry logic
   */
  async put(url, data, config) {
    const response = await this._executeWithRetry(() => this.api.put(url, data, config));
    return response.data;
  }

  /**
   * Make a DELETE request with retry logic
   */
  async delete(url, config) {
    const response = await this._executeWithRetry(() => this.api.delete(url, config));
    return response.data;
  }
}
