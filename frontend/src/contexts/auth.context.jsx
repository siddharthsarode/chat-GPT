import { apiRequest } from "@/lib/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Backend returns the user object directly (or 401 on failure).
        // e.g. { username, email, role, status }
        const response = await apiRequest("/api/auth/me", "GET");
        // console.log("/api/auth/me ->", response);
        // If response contains an email or username assume authenticated
        if (response && (response.email || response.username)) {
          setUser(response);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/auth/login", "POST", data);
      setUser(response.user);
      return response.user;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/auth/register", "POST", data);
      setUser(response.user);
      return response.user;
    } catch (err) {
      console.log("register error", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = { login, user, loading, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
