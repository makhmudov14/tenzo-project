import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { type RootState } from "../store"; // adjust path based on your project
 
const PublicRoute: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.authenticated);
  const isAuthenticated = isLoggedIn || Boolean(localStorage.getItem("token"));

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;