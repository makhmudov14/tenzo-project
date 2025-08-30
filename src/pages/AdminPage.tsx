import React, { useState } from "react";
import { Box, Button, Stack, Tab, Tabs } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ProductsPage from "./ProductPage";


const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<0 | 1>(0); // 0 = Products, 1 = Orders

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="admin tabs">
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>

        <Stack direction="row" spacing={2}>
          {tab === 0 && (
            <Button variant="contained" color="success" startIcon={<AddIcon />}>
              Add Product
            </Button>
          )}
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Stack>

      {/* Content */}
      <Box>
        {tab === 0 && <ProductsPage />}
        
      </Box>
    </Box>
  );
};

export default AdminPage;
