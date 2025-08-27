import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// Pages
import NotFoundPage from "./pages/not-found/index";
import LoginPage from "./pages/auth/login";
//import HomePage from "./pages/home";
import RegisterPage from "./pages/auth/register";
import ProductsPage from "./pages/ProductPage";
import OrdersPage from "./pages/OrdersPage";

const App: React.FC = () => {
  return (
    <Routes>
      
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
      </Route>

      
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
         
        
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      
    </Routes>
  );
};

export default App;
