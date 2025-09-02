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
  Avatar,
  keyframes,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AuthService from "../../services/auth";

// --- Validation schema ---
const schema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

type FormInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// --- Keyframe Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleButton = keyframes`
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const hoverAvatar = keyframes`
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    try {
      const res = await AuthService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        setRegisterError(true);
        toast.error(res.error.message || "Registration failed");
      } else {
        setRegisterError(false);
        localStorage.setItem("token", res.data.data.token);
        if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch({ type: "LOGIN", payload: res.data.user });
        toast.success("Registration successful!");
        navigate("/");
      }
    } catch (err: any) {
      setRegisterError(true);
      toast.error(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: "#f0f4f8", px: 2, animation: `${fadeInUp} 0.8s ease-out` }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 3,
          borderRadius: 4,
          boxShadow: 5,
          background: "linear-gradient(145deg, #ffffff, #e6f0ff)",
          textAlign: "center",
          "@media(max-width:600px)": {
            p: 2,
            mx: 1,
            maxHeight: "90vh",        // MOBILE MAX HEIGHT
            overflowY: "auto",        // SCROLL ENABLE
          },
        }}
      >
        <Avatar
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Register Avatar"
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            border: "4px solid #1a73e8",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            animation: `${hoverAvatar} 2s ease-in-out infinite`,
          }}
        />

        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1a73e8", mb: 3 }}>
          Register
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register("username")}
            error={!!errors.username || registerError}
            helperText={errors.username?.message || (registerError ? "Registration error" : "")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, "& .MuiInputBase-root": { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register("email")}
            error={!!errors.email || registerError}
            helperText={errors.email?.message || (registerError ? "Registration error" : "")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, "& .MuiInputBase-root": { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            {...register("password")}
            error={!!errors.password || registerError}
            helperText={errors.password?.message || (registerError ? "Registration error" : "")}
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
            sx={{ mb: 2, "& .MuiInputBase-root": { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            margin="normal"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword || registerError}
            helperText={errors.confirmPassword?.message || (registerError ? "Registration error" : "")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3, "& .MuiInputBase-root": { borderRadius: 2 } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 3,
              background: "linear-gradient(90deg, #1a73e8, #4285f4)",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              animation: `${scaleButton} 1.2s ease-in-out infinite`,
              "&:hover": { background: "linear-gradient(90deg, #4285f4, #1a73e8)" },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" mt={3} sx={{ color: "#555" }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: "bold" }}>
            Login
          </Link>
        </Typography>

        <Toaster position="top-right" />
      </Card>
    </Box>
  );
};

export default Register;
