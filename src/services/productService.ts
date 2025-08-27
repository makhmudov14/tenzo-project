import axios from "axios";

const API_URL = "https://api-e-commerce.tenzorsoft.uz/products";

// ---- Get all with pagination ----
const getAll = (page: number, size: number) =>
  axios
    .get(`${API_URL}?page=${page}&size=${size}`)
    .then((res) => ({ data: res.data }))
    .catch((err) => ({ error: err.message }));

// ---- Search by name & category ----
const search = async (name: string, category: string) => {
  const params: any = {};
  if (name) params.name = name;
  if (category) params.category = category;

  try {
    const res = await axios.get(`${API_URL}/search`, { params });
    return { data: res.data };
  } catch (err: any) {
    return { error: err.message };
  }
};

// ---- Create product ----
const create = async (product: any) => {
  try {
    const res = await axios.post(API_URL, product);
    return { data: res.data };
  } catch (err: any) {
    return { error: err.message };
  }
};

// ---- Update product ----
const update = async (id: string, product: any) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, product);
    return { data: res.data };
  } catch (err: any) {
    return { error: err.message };
  }
};

// ---- Delete product ----
const remove = async (id: string) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return { data: res.data };
  } catch (err: any) {
    return { error: err.message };
  }
};

const ProductService = { getAll, search, create, update, remove };

export default ProductService;
