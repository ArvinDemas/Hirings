const TOKEN_KEY = "hirings_access_token";

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
