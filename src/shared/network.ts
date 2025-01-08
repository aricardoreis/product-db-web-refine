import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  isTokenAboutToExpire,
  persistAuthData,
} from "./storage";

console.log(import.meta.env.VITE_API_URL);
if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not set");
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // check if the token is about to expire and refresh it
    const refreshToken = getRefreshToken();
    if (refreshToken && isTokenAboutToExpire()) {
      const apiUrl: string = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      persistAuthData(data);
    }

    config.headers.Authorization = `Bearer ${getAccessToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
