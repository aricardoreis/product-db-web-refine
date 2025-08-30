import { AuthProvider } from "@refinedev/core";
import { clearAuthData, getAccessToken, persistAuthData } from "../shared/storage";

/**
 * Authentication Provider Configuration
 * 
 * This provider automatically switches between mock and production authentication based on environment:
 * 
 * Development Mode (VITE_DISABLE_AUTH=true):
 * - Uses mock auth provider (always authenticated)
 * - No login required
 * - Perfect for local development
 * 
 * Production Mode (VITE_DISABLE_AUTH=false or undefined):
 * - Uses production auth provider
 * - Full authentication required
 * - Secure for production use
 * 
 * To disable authentication locally, create a .env.local file with:
 * VITE_DISABLE_AUTH=true
 */

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Check if authentication should be disabled via environment variable
const disableAuth = import.meta.env.VITE_DISABLE_AUTH === "true";

// Log which auth provider is being used
if (isDevelopment && disableAuth) {
  console.log("🔓 Development mode: Authentication disabled - using mock auth provider");
} else if (isDevelopment) {
  console.log("🔐 Development mode: Authentication enabled - using production auth provider");
} else {
  console.log("🔐 Production mode: Authentication enabled - using production auth provider");
}

// Mock auth provider for development
const mockAuthProvider: AuthProvider = {
  check: async () => {
    return { authenticated: true };
  },
  login: async () => {
    return { success: true };
  },
  logout: async () => {
    return { success: true };
  },
  onError: async () => {
    return {};
  },
};

// Production auth provider
const productionAuthProvider: AuthProvider = {
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

// Export the appropriate auth provider based on environment
export const authProvider = (isDevelopment && disableAuth) ? mockAuthProvider : productionAuthProvider;
