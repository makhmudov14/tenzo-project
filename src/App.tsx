import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// Pages
import NotFoundPage from "./pages/not-found/index";


import LoginPage from "./pages/auth/Login";

import RegisterPage from "./pages/auth/Register";
import ProductsPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AddProduct from "./pages/AddProductPage";

import About from "./pages/About";
import Contact from "./pages/Contact";



const App: React.FC = () => {
  return (
    <Routes>
      
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
      </Route>

      
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/add-product" element={<AddProduct />} />
        
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        
       
         
        
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      
    </Routes>
  );
};

export default App;
