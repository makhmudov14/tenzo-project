// src/pages/About.tsx
import React from "react";
import { Box, Typography, Stack, Paper, styled, useTheme, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease",
  ":hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

const About: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box px={2} py={6} sx={{ background: theme.palette.background.default, minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        About Us
      </Typography>

      <Stack spacing={3} maxWidth={900} mx="auto" mb={4}>
        <InfoCard>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Our Mission
          </Typography>
          <Typography color="text.secondary">
            We aim to provide the best e-commerce experience for our customers by offering high-quality products, excellent service, and a seamless online shopping journey.
          </Typography>
        </InfoCard>

        <InfoCard>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Our Story
          </Typography>
          <Typography color="text.secondary">
            Founded in 2023, our e-commerce platform has grown rapidly to serve thousands of satisfied customers. Our team is passionate about technology and customer satisfaction.
          </Typography>
        </InfoCard>

        <InfoCard>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Our Values
          </Typography>
          <Typography color="text.secondary">
            Integrity, innovation, and customer focus are at the core of everything we do. We strive to create a trustworthy and enjoyable shopping environment for all.
          </Typography>
        </InfoCard>
      </Stack>

      {/* Back to Home Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ borderRadius: 12, px: 4, py: 1.5 }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default About;
