import { useAuth } from "@/contexts/auth.context";
import { Navigate } from "react-router-dom";

export const GuestRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) return <Navigate to="/" replace />;

  return children;
};
