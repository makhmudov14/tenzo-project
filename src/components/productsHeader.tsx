// src/components/ProductsHeader.tsx
import React, { useState } from "react";
import { Box, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

interface ProductsHeaderProps {
  onAdd: () => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onAdd }) => {
  const [openLogout, setOpenLogout] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
   
    localStorage.removeItem("token");

    dispatch({ type: "LOGOUT",  });
    

    
    navigate("/login"); 
    setOpenLogout(false);
  };

  return (
    <Box mb={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="flex-end"
        alignItems="center"
      >
       
        <Button color="secondary" variant="outlined" onClick={() => setOpenLogout(true)}>
          Logout
        </Button>

      
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={onAdd}>
          Add Product
        </Button>
      </Stack>

      
      <Dialog open={openLogout} onClose={() => setOpenLogout(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogout(false)}>Cancel</Button>
          <Button onClick={handleLogout} variant="contained" color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsHeader;
