import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Pagination,
  Modal,
} from "@mui/material";
import ProductService from "../services/productService";
import ProductForm from "../components/products/ProductForm";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await ProductService.getAll(page, 6);
    if (res.data) {
      setProducts(res.data.items || res.data); 
      setTotalPages(res.data.totalPages || 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearch = async () => {
    setLoading(true);
    const res = await ProductService.search(search, category);
    if (res.data) setProducts(res.data.items || res.data);
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        Mahsulotlar
      </Typography>

      {/* 🔎 Qidiruv */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Nomi bo‘yicha qidirish"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          label="Kategoriya"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Qidirish
        </Button>
        <Button variant="contained" color="success" onClick={() => setOpen(true)}>
          + Mahsulot qo‘shish
        </Button>
      </Box>

      
      <Grid container spacing={3}>
        {loading ? (
          <Typography>Yuklanmoqda...</Typography>
        ) : products.length ? (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                {product.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="text.secondary">{product.category}</Typography>
                  <Typography fontWeight="bold">${product.price}</Typography>
                  <Typography variant="body2">{product.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>Mahsulot topilmadi</Typography>
        )}
      </Grid>

      
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <ProductForm onClose={() => setOpen(false)} onSuccess={fetchProducts} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Products;
