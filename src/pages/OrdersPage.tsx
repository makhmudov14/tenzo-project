// src/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
//import OrderService from "../services/orderService";
import ProductService from "../services/productService";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: number;
  userEmail: string;
  products: { productId: number; name: string; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
}

interface CreateOrderForm {
  products: { productId: number; quantity: number }[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateOrderForm>({ products: [] });

  const userRole = localStorage.getItem("role") || "user"; // admin/user
  const userEmail = localStorage.getItem("email") || "";

 
  const loadProducts = async () => {
    try {
      const { data, error } = await ProductService.getAll(0, 100);
      if (error || !data?.success) throw new Error("Failed to load products");
      setProductsList(data.data.content);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    }
  };

  
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (userRole === "admin") {
        res = await OrderService.getAll();
      } else {
        res = await OrderService.getByEmail(userEmail);
      }
      if (res.error || !res.data?.success) throw new Error("Failed to load orders");
      setOrders(res.data.data || []);
    } catch (err: any) {
      setError(err.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  
  const handleAddProductToOrder = (productId: number) => {
    if (!createForm.products.find((p) => p.productId === productId)) {
      setCreateForm((prev) => ({
        ...prev,
        products: [...prev.products, { productId, quantity: 1 }],
      }));
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setCreateForm((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.productId === productId ? { ...p, quantity } : p
      ),
    }));
  };

  const handleCreateSubmit = async () => {
    try {
      await OrderService.create(createForm);
      setOpenCreate(false);
      setCreateForm({ products: [] });
      loadOrders();
    } catch {
      setError("Failed to create order");
    }
  };

  
  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await OrderService.updateStatus(orderId, status);
      loadOrders();
    } catch {
      setError("Failed to update status");
    }
  };

  if (loading) return <CircularProgress />;

  if (error)
    return (
      <Typography color="error" mt={2}>
        {error}
      </Typography>
    );

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Orders</Typography>
        <Button variant="contained" color="success" onClick={() => setOpenCreate(true)}>
          Create Order
        </Button>
      </Stack>

      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {userRole === "admin" && <TableCell>User Email</TableCell>}
              <TableCell>Products</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                {userRole === "admin" && <TableCell>{order.userEmail}</TableCell>}
                <TableCell>
                  {order.products.map((p) => (
                    <Box key={p.productId}>
                      {p.name} x {p.quantity}
                    </Box>
                  ))}
                </TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>
                  {userRole === "admin" ? (
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  ) : (
                    order.status
                  )}
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Order</DialogTitle>
        <DialogContent>
          <Typography>Select products and quantity:</Typography>
          <Stack spacing={2} mt={2}>
            {productsList.map((p) => (
              <Stack
                key={p.id}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>{p.name} (${p.price})</Typography>
                <TextField
                  type="number"
                  size="small"
                  label="Qty"
                  value={
                    createForm.products.find((pr) => pr.productId === p.id)?.quantity || 0
                  }
                  onChange={(e) =>
                    handleQuantityChange(p.id, Number(e.target.value))
                  }
                  onFocus={() => handleAddProductToOrder(p.id)}
                  inputProps={{ min: 1 }}
                />
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage;
