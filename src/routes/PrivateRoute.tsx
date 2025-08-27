import React from "react"; 
import { useSelector } from "react-redux"; 
import { Navigate, Outlet } from "react-router-dom"; 
import { type RootState } from "../store"; // adjust path based on your project 
  
 
const PrivateRoute: React.FC = () => { 
  const isLoggedIn = useSelector((state: RootState) => state.auth.authenticated); 
  const isAuthenticated = isLoggedIn || Boolean(localStorage.getItem("token")); 
 
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />; 
}; 
 
export default PrivateRoute;