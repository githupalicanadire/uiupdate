import axios from "axios";

// API Gateway base URL - will be proxied through nginx in production
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:6004";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      // Server responded with error status
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else happened
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
