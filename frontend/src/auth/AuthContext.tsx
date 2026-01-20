import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, clearToken } from "../auth/token";
import client from "../api/client";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
        const token = getToken();

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // backend validates token via AuthMiddleware
            const res = await client.get<User>("/me");
            console.log("token res >>>", res)
            setUser(res.data);
        } catch (err) {
            // handle invalid / expired token
            clearToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    bootstrapAuth();
  }, []);

  const signIn = (token: string, user: User) => {
    setToken(token);
    setUser(user);
  };

  const signOut = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

