// src/pages/CartPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  styled,
  keyframes,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// Animatsiyalar
const hoverUp = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-6px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const buttonHover = keyframes`
  0% { transform: translateY(0) scale(1); box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
  100% { transform: translateY(-2px) scale(1.05); box-shadow: 0 6px 12px rgba(0,0,0,0.25); }
`;

// Glass Card
const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  overflow: "hidden",
  backdropFilter: "blur(12px)",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(145deg, rgba(40,40,40,0.85), rgba(25,25,25,0.9))"
      : "linear-gradient(145deg, rgba(245,245,245,0.85), rgba(255,255,255,0.95))",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 12px 30px rgba(0,0,0,0.6)"
      : "0 12px 30px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
  ":hover": {
    animation: `${hoverUp} 0.3s forwards`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 18px 40px rgba(0,0,0,0.7)"
        : "0 18px 40px rgba(0,0,0,0.25)",
  },
}));

const GradientButton = styled(Button)(() => ({
  borderRadius: 14,
  fontWeight: 700,
  textTransform: "none",
  padding: "12px 28px",
  background: "linear-gradient(135deg, #4caf50, #81c784)",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
  ":hover": {
    animation: `${buttonHover} 0.3s forwards`,
    background: "linear-gradient(135deg, #388e3c, #66bb6a)",
  },
}));

const CartPage: React.FC = () => {
  const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const [cart, setCart] = useState<any[]>(storedCart);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRemove = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleQuantity = (id: number, delta: number) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleLike = (id: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, liked: !item.liked } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleRating = (id: number, value: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, rating: value } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    alert(`Paid $${totalPrice} successfully! ✅`);
    setCart([]);
    localStorage.setItem("cart", "[]");
    navigate("/");
  };

  return (
    <Box
      p={isMobile ? 2 : 3}
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #212121, #1b1b1b)"
            : "linear-gradient(135deg, #E3F2FD, #FFFFFF)",
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight={700} textAlign="center">
        🛒 Your Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography mt={4} variant="h6" textAlign="center">
          Your cart is empty.
        </Typography>
      ) : (
        <Stack
          spacing={3}
          width="100%"
          direction={isMobile ? "column" : "row"}
          flexWrap="wrap"
          justifyContent="center"
          alignItems="flex-start"
        >
          {cart.map((item) => (
            <GlassCard
              key={item.id}
              sx={{
                width: isMobile ? "100%" : "300px",
                m: isMobile ? 0 : 1.5,
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={item.image || "https://i.ibb.co/album-placeholder.png"}
                alt={item.name}
                sx={{
                  transition: "transform 0.3s ease",
                  ":hover": { transform: "scale(1.05)" },
                }}
              />
              <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <IconButton onClick={() => handleLike(item.id)}>
                    {item.liked ? (
                      <FavoriteIcon color="error" sx={{ animation: `${pulse} 0.3s` }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Stack>

                <Typography color="text.secondary" mt={1}>
                  {item.price} USD
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuantity(item.id, -1)}
                    sx={{ minWidth: 36 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Typography>{item.quantity || 1}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuantity(item.id, 1)}
                    sx={{ minWidth: 36 }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </Stack>

                <Stack direction="row" spacing={0.5} mt={1}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconButton
                      key={i}
                      onClick={() => handleRating(item.id, i)}
                      sx={{ padding: 0.5 }}
                    >
                      {i <= (item.rating || 0) ? (
                        <StarIcon color="warning" fontSize="small" />
                      ) : (
                        <StarBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  ))}
                </Stack>

                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ mt: 2, borderRadius: 14, textTransform: "none" }}
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </Button>
              </CardContent>
            </GlassCard>
          ))}

          {/* Checkout Summary */}
          <Stack
            spacing={2}
            width={isMobile ? "100%" : "300px"}
            flexShrink={0}
            mt={isMobile ? 3 : 0}
          >
            <Typography variant="h6" fontWeight={700}>
              Total: {totalPrice} USD
            </Typography>

            <GradientButton fullWidth onClick={handleCheckout}>
              Checkout
            </GradientButton>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/")}
              sx={{ borderRadius: 14, textTransform: "none" }}
            >
              Continue Shopping
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default CartPage;
