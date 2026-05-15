import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { authService } from "./authService.js";
import { getStoredToken, removeStoredToken, setStoredToken } from "./tokenStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      const token = getStoredToken();

      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await authService.fetchMe();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (_error) {
        removeStoredToken();
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function register(payload) {
    const result = await authService.register(payload);
    setStoredToken(result.token);
    setUser(result.user);
    return result.user;
  }

  async function login(payload) {
    const result = await authService.login(payload);
    setStoredToken(result.token);
    setUser(result.user);
    return result.user;
  }

  function logout() {
    removeStoredToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      register,
      login,
      logout,
    }),
    [user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
