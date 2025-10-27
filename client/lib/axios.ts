import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "https://api.faskids.shop" : "http://localhost:5000/api");

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default instance;
