import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "https://api.faskids.shop" : "http://localhost:8080");

console.log("🔧 Axios baseURL:", baseURL);
console.log("🔧 PROD mode:", import.meta.env.PROD);
console.log("🔧 VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    console.log("📤 Request:", config.method?.toUpperCase(), config.baseURL + config.url);
    console.log("📤 Request data:", config.data);
    
    // Get token from localStorage (Zustand persist)
    const authStore = localStorage.getItem("auth-storage");
    if (authStore) {
      try {
        const { state } = JSON.parse(authStore);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    
    // Handle 401 Unauthorized - could redirect to login
    if (error.response?.status === 401) {
      // Clear auth state if token is invalid
      localStorage.removeItem("auth-storage");
      // Optionally redirect to login
      // window.location.href = "/login";
    }
    
    return Promise.reject(error);
  },
);

export default instance;
