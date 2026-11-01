import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import authService, { type AdminUser } from "../services/authService";

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("firstshift_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const user = await authService.getMe();
        setAdmin(user);
      } catch (err) {
        localStorage.removeItem("firstshift_token");
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setAdmin(res.admin);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
