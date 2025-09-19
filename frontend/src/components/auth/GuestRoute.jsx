import { useAuth } from "@/contexts/auth.context";
import { Navigate } from "react-router-dom";
import Loader from "../Loader";

export const GuestRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) return <Loader />;

  if (user) return <Navigate to="/" replace />;

  return children;
};
