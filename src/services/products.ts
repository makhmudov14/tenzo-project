// src/services/products.ts
import axios from "axios";

const API_URL = "https://api-e-commerce.tenzorsoft.uz";


export const getProducts = async (page: number = 1, size: number = 10) => {
  const response = await axios.get(`${API_URL}/products`, {
    params: { page, size },
  });
  return response.data;
};


export const getProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};


export const searchProducts = async (name?: string, category?: string) => {
  const response = await axios.get(`${API_URL}/products/search`, {
    params: { name, category },
  });
  return response.data;
};


export const createProduct = async (productData: any) => {
  const response = await axios.post(`${API_URL}/products`, productData);
  return response.data;
};


export const updateProduct = async (id: string, productData: any) => {
  const response = await axios.put(`${API_URL}/products/${id}`, productData);
  return response.data;
};


export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
};
