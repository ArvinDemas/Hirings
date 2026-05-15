import { api } from "../../lib/api.js";

function getErrorMessage(error) {
  const validationMessage = error.response?.data?.errors?.[0]?.message;

  if (validationMessage) {
    return validationMessage;
  }

  const message = error.response?.data?.message;

  if (message) {
    return message;
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (!error.response) {
    return "Cannot reach the server. Please check your connection.";
  }

  return "Something went wrong. Please try again.";
}

async function register(payload) {
  try {
    const response = await api.post("/auth/register", payload);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

async function login(payload) {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

async function fetchMe() {
  try {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export const authService = {
  register,
  login,
  fetchMe,
};
