import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AuthService from "../../services/auth";


const schema = yup.object({
  username: yup.string().required("username is required"),
  password: yup.string().min(5, "At least 5 characters").required("Password is required"),
});

type FormInputs = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data:FormInputs) => {
    setLoading(true);

    
    const res = await AuthService.login({
        username: data.username, // ✅ changed from name
       
        password: data.password,
      });
    

    if (res.data) {
      

     
      localStorage.setItem("token", res.data.data.token);
      
      console.log("token", res.data.data.token);

      
      dispatch({ type: "LOGIN", payload: {
        "username": res.data.data.username,
        "email": res.data.data.email,
        "role": res.data.data.role} });

      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Invalid email or password!");
    }

    setLoading(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: "#f9f9f9", px: 2 }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", p: 2, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Login
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <TextField
              fullWidth
              label="username"
              type="username"
              margin="normal"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, borderRadius: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>

          
          <Typography variant="body2" textAlign="center" mt={2}>
            Don&apos;t have an account?{" "}
            <Link component={RouterLink} to="/register" underline="hover">
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>

      
      <Toaster position="top-right" />
    </Box>
  );
};

export default Login;
