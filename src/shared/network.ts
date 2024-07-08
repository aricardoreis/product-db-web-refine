import axios from "axios";
import { ACCESS_TOKEN_KEY } from "../shared/constants";

console.log(import.meta.env.VITE_API_URL);
if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not set");
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

export default axiosInstance;