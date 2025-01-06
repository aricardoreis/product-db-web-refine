import { ACCESS_TOKEN_KEY, EXPIRES_AT, REFRESH_TOKEN } from "./constants";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN);
}

function getExpiresAt() {
  return localStorage.getItem(EXPIRES_AT);
}

export function isTokenAboutToExpire() {
  const expiresAt = Number(getExpiresAt()) * 1000;
  return Date.now() + 60 * 1000 > Number(expiresAt);
}

export function persistAuthData(data: any) {
  if (!data.access_token) return;
  localStorage.setItem("my_access_token", data.access_token);
  localStorage.setItem("my_refresh_token", data.refresh_token);
  localStorage.setItem("expires_at", String(data.expires_at));
}

export function clearAuthData() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(EXPIRES_AT);
}
