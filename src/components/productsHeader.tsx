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
  Stack,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

interface ProductsHeaderProps {
  onAdd: () => void;
  onSearch: (query: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onSearch, onAdd }) => {
  const [openLogout, setOpenLogout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <AppBar position="static" color="primary" sx={{ backgroundColor: "#1565c0" }}>
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 1,
            py: { xs: 2, sm: 0 },
          }}
        >
          {/* Left: Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              textAlign: { xs: "center", sm: "left" },
              flexGrow: { xs: 1, sm: 0 },
            }}
          >
            Tenzor-soft
          </Typography>

          {/* Mobile: Search input outside drawer */}
          {isMobile && (
            <Stack direction="row" spacing={1} width="100%" mt={1} px={1}>
              <TextField
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, backgroundColor: "white", borderRadius: 1 }}
              />
              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>
            </Stack>
          )}

          {/* Mobile Hamburger */}
          {isMobile ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 1 }}>
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            // Desktop nav links + search + buttons
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" width="100%" justifyContent="flex-end">
              <Box sx={{ display: "flex", gap: 2 }}>
                {navLinks.map((link) => (
                  <Button key={link.label} component={Link} to={link.path} sx={{ color: "white" }}>
                    {link.label}
                  </Button>
                ))}
              </Box>

              <TextField
                size="small"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  minWidth: 200,
                  ml: 2,
                }}
              />
              <Button
                onClick={handleSearch}
                variant="contained"
                sx={{ bgcolor: "#0d47a1", "&:hover": { bgcolor: "#08306b" } }}
              >
                Search
              </Button>

              <Button component={Link} to="/add-product" variant="contained" color="success" onClick={onAdd}>
                + Add Product
              </Button>

              <IconButton component={Link} to="/cart" sx={{ color: "white" }}>
                <Badge badgeContent={3} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <Button onClick={() => setOpenLogout(true)} variant="outlined" color="inherit">
                Logout
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton component={Link} to={link.path} onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem>
              <Button fullWidth variant="contained" color="success" onClick={onAdd}>
                + Add Product
              </Button>
            </ListItem>
            <ListItem>
              <Button fullWidth onClick={() => navigate("/cart")} startIcon={<ShoppingCartIcon />}>
                Cart
              </Button>
            </ListItem>
            <ListItem>
              <Button fullWidth variant="outlined" color="error" onClick={() => setOpenLogout(true)}>
                Logout
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

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
