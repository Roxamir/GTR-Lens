import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Protected = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
