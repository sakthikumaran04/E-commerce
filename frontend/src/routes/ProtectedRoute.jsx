// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isLogged } = useAuth();

  if (isLogged === null) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return isLogged ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
