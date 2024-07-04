import { AuthProvider } from "@refinedev/core";
import { ACCESS_TOKEN_KEY } from "../shared/constants";

export const authProvider: AuthProvider = {
  check: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    return { authenticated: Boolean(token) };
  },
  login: async ({ email, password }) => {
    const apiUrl: string = import.meta.env.VITE_API_URL;

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(`login response data: ${JSON.stringify(data)}`);
    if (data.access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      return { success: true };
    }

    return {
      success: false,
      error: {
        name: "Login Error",
        message: "Invalid credentials",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    return { success: true };
  },
  onError: async (error) => {
    if (error?.status === 401) {
      return {
        logout: true,
        error: { name: "unauthorized", message: "Unauthorized" },
      };
    }

    return {};
  },
};
