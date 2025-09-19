import { useAuth } from "@/contexts/auth.context";
import Loader from "../Loader";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};
