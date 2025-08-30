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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  styled,
  keyframes
} from "@mui/material";
import Grid from "@mui/material/Grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
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

const AnimatedCard = styled(Card)(({ theme }) => ({
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
}));

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

interface Form {
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const initialForm: Form = { name: "", category: "", price: 0, stock: 0, isActive: true };
  const [form, setForm] = useState<Form>(initialForm);

  // --- Load Products ---
  const loadProducts = async (pageNumber: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await ProductService.getAll(pageNumber - 1, 10);
      if (error || !data?.success) throw new Error("Failed to load products");
      setProducts(data.data.content);
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

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      <ProductsHeader onAdd={() => setOpenAdd(true)} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField label="Name" size="small" value={searchName} onChange={e => setSearchName(e.target.value)} />
        <TextField label="Category" size="small" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} />
        <AnimatedButton disabled={!searchName && !searchCategory} variant="contained">Search</AnimatedButton>
      </Stack>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <AnimatedCard>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Chip
                    label={product.isActive ? "Active" : "Inactive"}
                    color={product.isActive ? "success" : "error"}
                    size="small"
                  />
                </Stack>
                <Typography variant="body2">Category: {product.category}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <Typography variant="body2">Stock: {product.stock}</Typography>
                <Typography variant="caption">Added: {dayjs(product.createdAt).format("MM/DD/YYYY")}</Typography>

                <Stack direction="row" spacing={1} mt={1}>
                  <AnimatedButton size="small"><EditIcon fontSize="small" /> Edit</AnimatedButton>
                  <AnimatedButton size="small" color="error"><DeleteIcon fontSize="small" /> Delete</AnimatedButton>
                  <AnimatedButton size="small"><VisibilityIcon fontSize="small" /> View</AnimatedButton>
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
