import { AuthProvider } from "@refinedev/core";
import { clearAuthData, getAccessToken, persistAuthData } from "../shared/storage";

export const authProvider: AuthProvider = {
  check: async () => {
    const token = getAccessToken();

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
      persistAuthData(data);
      console.log(`EXPIRES_AT: ${new Date(Number(data.expires_at) * 1000)}`);
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
    clearAuthData();

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
