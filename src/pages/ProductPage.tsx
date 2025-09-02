// src/pages/ProductsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Chip,
  Pagination,
  Stack,
  styled,
  keyframes,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/productService";
import ProductsHeader from "../components/productsHeader";

// --- Animations ---
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px);}
  100% { opacity: 1; transform: translateY(0);}
`;

const hoverGlow = keyframes`
  0% { box-shadow: 0 3px 6px rgba(0,0,0,0.1);}
  50% { box-shadow: 0 12px 25px rgba(0,0,0,0.25);}
  100% { box-shadow: 0 3px 6px rgba(0,0,0,0.1);}
`;

const AnimatedCard = styled(Card)({
  height: "100%",
  borderRadius: 12,
  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  animation: `${fadeInUp} 0.6s ease`,
  "&:hover": {
    transform: "scale(1.04)",
    animation: `${hoverGlow} 0.6s ease-in-out`,
    background: "linear-gradient(145deg, #f5f5f5, #e0f7fa)",
  },
});

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: theme.palette.primary.light,
  },
  "& svg": {
    transition: "transform 0.3s ease",
  },
  "&:hover svg": {
    transform: "scale(1.2)",
  },
}));

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm")); // mobil dialog full screen

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...cart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    navigate("/cart");
  };

  const loadProducts = async (pageNumber: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await ProductService.getAll(pageNumber - 1, 10);
      if (error || !data?.success) throw new Error("Failed to load products");
      setProducts(data.data.content);
      setAllProducts(data.data.content);
      setTotalPages(data.data.totalPages);
      setPage(data.data.number + 1);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
  }, []);

  const handleSaveProduct = async () => {
    try {
      await ProductService.create({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      });
      setOpenAdd(false);
      setNewProduct({ name: "", category: "", price: "", stock: "" });
      loadProducts(page);
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setProducts(allProducts);
      return;
    }
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
  };

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      <ProductsHeader onAdd={() => setOpenAdd(true)} onSearch={handleSearch} />

      {/* Add Product Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullScreen={fullScreen} fullWidth maxWidth="sm">
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <TextField
              label="Category"
              fullWidth
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <TextField
              label="Stock"
              type="number"
              fullWidth
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1, px: 3, py: 2 }}>
          <Button fullWidth={fullScreen} onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button fullWidth={fullScreen} onClick={handleSaveProduct} variant="contained" color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullScreen={fullScreen} fullWidth maxWidth="sm">
        <DialogTitle>View Product</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Stack spacing={2} mt={1}>
              <Typography><b>Name:</b> {selectedProduct.name}</Typography>
              <Typography><b>Category:</b> {selectedProduct.category}</Typography>
              <Typography><b>Price:</b> ${selectedProduct.price}</Typography>
              <Typography><b>Stock:</b> {selectedProduct.stock}</Typography>
              <Typography><b>Status:</b> {selectedProduct.isActive ? "Active" : "Inactive"}</Typography>
              <Typography><b>Created:</b> {dayjs(selectedProduct.createdAt).format("MM/DD/YYYY")}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1, px: 3, py: 2 }}>
          <Button fullWidth={fullScreen} onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullScreen={fullScreen}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1, px: 3, py: 2 }}>
          <Button fullWidth={fullScreen} onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            fullWidth={fullScreen}
            onClick={async () => {
              if (!selectedProduct) return;
              try {
                await ProductService.remove(selectedProduct.id.toString());
                setOpenDelete(false);
                loadProducts(page);
              } catch (err) {
                console.error("Failed to delete product", err);
              }
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product List */}
      {loading && <Box textAlign="center" mt={4}><CircularProgress /></Box>}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <AnimatedCard sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  mb={1}
                  spacing={1}
                >
                  <Typography variant="h6" noWrap>{product.name}</Typography>
                  <Chip label={product.isActive ? "Active" : "Inactive"} color={product.isActive ? "success" : "error"} size="small" />
                </Stack>

                <Typography variant="body2" noWrap>Category: {product.category}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <Typography variant="body2">Stock: {product.stock}</Typography>
                <Typography variant="caption">Added: {dayjs(product.createdAt).format("MM/DD/YYYY")}</Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
                  <AnimatedButton size="small" color="primary" fullWidth={fullScreen} onClick={() => handleAddToCart(product)}>
                    <ShoppingCartIcon fontSize="small" /> Add to Cart
                  </AnimatedButton>

                  <AnimatedButton size="small" color="error" fullWidth={fullScreen} onClick={() => { setSelectedProduct(product); setOpenDelete(true); }}>
                    <DeleteIcon fontSize="small" /> Delete
                  </AnimatedButton>

                  <AnimatedButton size="small" fullWidth={fullScreen} onClick={() => { setSelectedProduct(product); setOpenView(true); }}>
                    <VisibilityIcon fontSize="small" /> View
                  </AnimatedButton>
                </Stack>
              </CardContent>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination count={totalPages} page={page} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default ProductsPage;
