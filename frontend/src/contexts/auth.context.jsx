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

  //   Load user from local storage
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) setUser(JSON.parse(user));
    setLoading(false);
  }, []);

  // Save user in localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
