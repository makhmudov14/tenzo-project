import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token
    localStorage.removeItem("token");
    // Dispatch logout
    dispatch({ type: "LOGOUT" });
    // Navigate to login
    navigate("/login");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: "#f9f9f9", px: 2 }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Welcome Home 🎉
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: "1rem" }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default HomePage;