// src/pages/Contact.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  TextField,
  Button,
  IconButton,
  Link,
  useTheme,
  styled,
  keyframes,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

// Animatsiyalar
const hoverUp = keyframes`
  0% { transform: translateY(0) scale(1); box-shadow: 0 2px 6px rgba(0,0,0,0.2);}
  100% { transform: translateY(-4px) scale(1.05); box-shadow: 0 6px 12px rgba(0,0,0,0.3);}
`;

const GradientButton = styled(Button)(() => ({
  borderRadius: 12,
  padding: "12px 32px",
  fontWeight: 700,
  background: "linear-gradient(45deg, #2196F3, #21CBF3)",
  color: "#fff",
  textTransform: "none",
  transition: "all 0.3s ease",
  ":hover": {
    animation: `${hoverUp} 0.3s forwards`,
    background: "linear-gradient(45deg, #21CBF3, #2196F3)",
  },
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease",
  ":hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

const Contact: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://formspree.io/f/myformid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setModalMessage("✅ Your message has been sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setModalMessage("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setModalMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setOpenModal(true);
    }
  };

  return (
    <Box px={2} py={6} sx={{ background: theme.palette.background.default, minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        Contact Us
      </Typography>

      <Stack
        spacing={4}
        maxWidth={900}
        mx="auto"
        direction={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="flex-start"
      >
        {/* Info + Social Card */}
        <ContactCard sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailOutlinedIcon color="primary" />
              <Typography>mkahmudov.dev@gmail.com</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneOutlinedIcon color="primary" />
              <Typography>+998 90 123 4567</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnOutlinedIcon color="primary" />
              <Typography>Tashkent, Uzbekistan</Typography>
            </Stack>

            <Stack direction="row" spacing={2} mt={2}>
              <IconButton color="primary" component={Link} href="https://t.me/yourtelegram" target="_blank">
                <TelegramIcon />
              </IconButton>
              <IconButton color="success" component={Link} href="https://wa.me/998901234567" target="_blank">
                <WhatsAppIcon />
              </IconButton>
              <IconButton color="primary" component={Link} href="https://www.facebook.com/yourpage" target="_blank">
                <FacebookIcon />
              </IconButton>
              <IconButton color="secondary" component={Link} href="https://www.instagram.com/yourprofile" target="_blank">
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Stack>
        </ContactCard>

        {/* Get in Touch Form */}
        <ContactCard sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Get in Touch
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Your Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
              <TextField label="Your Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Message" fullWidth required multiline minRows={4} value={message} onChange={(e) => setMessage(e.target.value)} />

              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </Stack>
          </form>
        </ContactCard>
      </Stack>

      {/* Back to Home Gradient Button */}
      <Box textAlign="center" mt={6}>
        <GradientButton onClick={() => navigate("/")}>Back to Home</GradientButton>
      </Box>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "green", mb: 2 }} />
            <Typography variant="h6">{modalMessage}</Typography>
            <GradientButton sx={{ mt: 3 }} onClick={() => setOpenModal(false)}>
              Close
            </GradientButton>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Contact;
