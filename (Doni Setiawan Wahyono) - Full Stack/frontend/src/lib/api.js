import axios from "axios";

import { env } from "../config/env.js";
import { getStoredToken, removeStoredToken } from "../features/auth/tokenStorage.js";

export const api = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeStoredToken();
    }

    return Promise.reject(error);
  }
);
