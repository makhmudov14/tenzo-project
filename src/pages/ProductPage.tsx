import React, { useEffect, useState } from "react";
import {
  Box, Grid, Card, CardContent, Typography, CircularProgress,
  TextField, Button, Chip, Pagination, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, Switch, FormControlLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import ProductService from "../services/ProductService";
import ProductsHeader from "../components/productsHeader";

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

  // ---- Search ----
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await ProductService.search(
        searchName.trim(),
        searchCategory.trim()
      );
      if (error || !data?.success) throw new Error("Search failed");
      setProducts(data.data.content);
      setTotalPages(data.data.totalPages);
      setPage(data.data.number + 1);
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // ---- Pagination ----
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (searchName || searchCategory) {
      handleSearch();
    } else {
      loadProducts(value);
    }
  };

  // ---- Add/Edit/Delete ----
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSubmit = async () => {
    setLoading(true);
    try {
      await ProductService.create(form);
      setOpenAdd(false);
      setForm(initialForm);
      loadProducts(1);
    } catch {
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      await ProductService.update(selectedProduct.id.toString(), form);
      setOpenEdit(false);
      setSelectedProduct(null);
      setForm(initialForm);
      loadProducts(page);
    } catch {
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      await ProductService.remove(selectedProduct.id.toString());
      setOpenDelete(false);
      setSelectedProduct(null);
      loadProducts(page);
    } catch {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // ---- View Details ----
  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setOpenView(true);
  };

  useEffect(() => {
    loadProducts(1);
  }, []);


  return (
    <Box p={3}>
      <ProductsHeader onAdd={() => setOpenAdd(true)} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField label="Name" size="small" value={searchName} onChange={e => setSearchName(e.target.value)} />
        <TextField label="Category" size="small" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} />
        <Button disabled={!searchName && !searchCategory} variant="contained" onClick={handleSearch}>Search</Button>
      </Stack>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Chip label={product.isActive ? "Active" : "Inactive"} color={product.isActive ? "success" : "error"} size="small" />
                </Stack>
                <Typography variant="body2">Category: {product.category}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <Typography variant="body2">Stock: {product.stock}</Typography>
                <Typography variant="caption">Added: {dayjs(product.createdAt).format("MM/DD/YYYY")}</Typography>

                <Stack direction="row" spacing={1} mt={1}>
                  <Button size="small" onClick={() => {
                    setSelectedProduct(product);
                    setForm({
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      stock: product.stock,
                      isActive: product.isActive
                    });
                    setOpenEdit(true);
                  }}><EditIcon fontSize="small" /> Edit</Button>

                  <Button size="small" color="error" onClick={() => {
                    setSelectedProduct(product);
                    setOpenDelete(true);
                  }}><DeleteIcon fontSize="small" /> Delete</Button>

                  <Button size="small" onClick={() => handleView(product)}><VisibilityIcon fontSize="small" /> View</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      )}

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField name="name" label="Name" value={form.name} onChange={handleFormChange} fullWidth />
            <TextField name="category" label="Category" value={form.category} onChange={handleFormChange} fullWidth />
            <TextField name="price" type="number" label="Price" value={form.price} onChange={handleFormChange} fullWidth />
            <TextField name="stock" type="number" label="Stock" value={form.stock} onChange={handleFormChange} fullWidth />
            <FormControlLabel control={<Switch checked={form.isActive} onChange={handleFormChange} name="isActive" />} label="Active" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSubmit}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField name="name" label="Name" value={form.name} onChange={handleFormChange} fullWidth />
            <TextField name="category" label="Category" value={form.category} onChange={handleFormChange} fullWidth />
            <TextField name="price" type="number" label="Price" value={form.price} onChange={handleFormChange} fullWidth />
            <TextField name="stock" type="number" label="Stock" value={form.stock} onChange={handleFormChange} fullWidth />
            <FormControlLabel control={<Switch checked={form.isActive} onChange={handleFormChange} name="isActive" />} label="Active" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{selectedProduct?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Stack spacing={1}>
              <Typography><strong>Name:</strong> {selectedProduct.name}</Typography>
              <Typography><strong>Category:</strong> {selectedProduct.category}</Typography>
              <Typography><strong>Price:</strong> ${selectedProduct.price}</Typography>
              <Typography><strong>Stock:</strong> {selectedProduct.stock}</Typography>
              <Typography><strong>Status:</strong> {selectedProduct.isActive ? "Active" : "Inactive"}</Typography>
              <Typography><strong>Added:</strong> {dayjs(selectedProduct.createdAt).format("MM/DD/YYYY")}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;
