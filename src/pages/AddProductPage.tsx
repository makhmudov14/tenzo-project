// src/pages/AddProduct.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
  Stack,
  styled,
  keyframes,
  useTheme,
} from "@mui/material";

// Icons
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api-e-commerce.tenzorsoft.uz/products";

// Animations
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(14px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(33,150,243,0.25); }
  70% { box-shadow: 0 0 0 12px rgba(33,150,243,0); }
  100% { box-shadow: 0 0 0 0 rgba(33,150,243,0); }
`;

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: 520,
  borderRadius: 20,
  backdropFilter: "blur(8px)",
  background: theme.palette.mode === "dark"
    ? "linear-gradient(135deg, rgba(48,48,48,0.85), rgba(30,30,30,0.9))"
    : "linear-gradient(135deg, rgba(227,242,253,0.85), rgba(255,255,255,0.9))",
  border: theme.palette.mode === "dark"
    ? "1px solid rgba(255,255,255,0.1)"
    : "1px solid rgba(255,255,255,0.6)",
  boxShadow: theme.palette.mode === "dark"
    ? "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
    : "0 10px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)",
  animation: `${fadeInUp} .5s ease`,
}));

const FancyButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 700,
  textTransform: "none",
  height: 48,
  transition: "all .2s ease",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 16px rgba(33,150,243,0.45)"
      : "0 8px 16px rgba(33,150,243,0.25)",
  ":hover": {
    transform: "translateY(-1px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 22px rgba(33,150,243,0.6)"
        : "0 12px 22px rgba(33,150,243,0.35)",
  },
}));

const AdornedField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: 12,
    background: theme.palette.mode === "dark" ? "rgba(60,60,60,0.85)" : "rgba(255,255,255,0.9)",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    transition: "box-shadow .2s ease, transform .08s ease",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "& .MuiInputBase-root.Mui-focused": {
    boxShadow: "0 0 0 4px rgba(33,150,243,0.12)",
    animation: `${pulse} 1.6s ease`,
  },
  "& .MuiInputBase-input": {
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
  },
}));

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [stock, setStock] = useState<number | string>("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackError, setSnackError] = useState("");

  const handleClose = () => {
    setSnackOpen(false);
    setSnackError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !price || !stock) {
      setSnackError("Please fill all fields.");
      setSnackOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        API_URL,
        {
          name,
          price: Number(price),
          stock: Number(stock),
          category,
          isActive,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (res.data?.success) {
        setSnackError(""); // success
        setSnackOpen(true);
        setTimeout(() => navigate("/"), 1200);
      } else {
        setSnackError(res.data?.message || "Failed to add product!");
        setSnackOpen(true);
      }
    } catch (err: any) {
      console.error("Add product failed:", err?.response || err);
      setSnackError(err?.response?.data?.message || "Server error: Failed to add product!");
      setSnackOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        px: 2,
        background: theme.palette.mode === "dark"
          ? "linear-gradient(120deg, #212121 0%, #1b1b1b 50%, #263238 100%)"
          : "linear-gradient(120deg, #E3F2FD 0%, #FFFFFF 50%, #E8F5E9 100%)",
      }}
    >
      <GlassCard elevation={0}>
        <Stack spacing={2} alignItems="center" mb={2}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "20px",
              background: "linear-gradient(145deg, #2196F3, #64B5F6)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              boxShadow:
                "0 12px 24px rgba(33,150,243,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              animation: `${fadeInUp} .6s ease`,
            }}
          >
            <CheckCircleOutlineIcon fontSize="large" />
          </Box>

          <Typography
            variant="h5"
            fontWeight={800}
            color="primary"
            textAlign="center"
            sx={{ letterSpacing: 0.3 }}
          >
            Add New Product
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Fill in the details below to create a new product.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <AdornedField
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory2OutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <AdornedField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <AdornedField
              label="Price ($)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <AdornedField
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 0, step: "1" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ProductionQuantityLimitsOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Active product"
              sx={{ mt: 1 }}
            />

            <FancyButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={submitting}
            >
              {submitting ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={22} />
                  <span>Saving...</span>
                </Stack>
              ) : (
                "Add Product 🚀"
              )}
            </FancyButton>

            <Button
              variant="text"
              onClick={() => navigate(-1)}
              sx={{ mt: 0.5, textTransform: "none", color: theme.palette.text.secondary }}
            >
              ← Back
            </Button>
          </Stack>
        </Box>
      </GlassCard>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {snackError ? (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {snackError}
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
            ✅ Product added successfully!
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default AddProduct;
