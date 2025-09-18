import { useAuth } from "@/contexts/auth.context";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};
