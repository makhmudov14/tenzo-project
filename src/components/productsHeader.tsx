// src/components/Navbar.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
interface ProductsHeaderProps {
  onAdd: () => void;
  onSearch: (query: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onSearch,onAdd }) => {
  const [openLogout, setOpenLogout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
    setOpenLogout(false);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" sx={{ backgroundColor: "#1565c0" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
            }}
          >
            E-Commerce
          </Typography>

          {/* Center links */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Button component={Link} to="/" sx={{ color: "white" }}>
              Home
            </Button>
            
            <Button component={Link} to="/about" sx={{ color: "white" }}>
              About
            </Button>
            <Button component={Link} to="/contact" sx={{ color: "white" }}>
              Contact
            </Button>
          </Box>

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                minWidth: 200,
              }}
            />
            <Button
              onClick={handleSearch}
              variant="contained"
              sx={{ bgcolor: "#0d47a1", "&:hover": { bgcolor: "#08306b" } }}
            >
              Search
            </Button>

            {/* Add Product */}
            <Button
              component={Link}
              to="/add-product"
              variant="contained"
              color="success"
              onClick={onAdd}
            >
              + Add Product
            </Button>

            {/* Cart */}
            <IconButton component={Link} to="/cart" sx={{ color: "white" }}>
              <Badge badgeContent={3} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Logout */}
            <Button
              onClick={() => setOpenLogout(true)}
              variant="outlined"
              color="inherit"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout confirm */}
      <Dialog open={openLogout} onClose={() => setOpenLogout(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogout(false)}>Cancel</Button>
          <Button onClick={handleLogout} variant="contained" color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductsHeader;
