import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { Bubbles } from "../components/Bubbles";

export const WallOfFame = () => {
  const navigate = useNavigate();

  const followers = [
    "@simping.sam",
    "Sexy Albino",
    "@skzd.fx",
    "@serpentkingnick",
    "@jordan2236228837",
    "@cpu_neppu",
    "@tinklewad",
    "@inevitableikari",
    "Rhett McCutcheon",
    "Eric Hernandez",
  ];

  const glowAnimation = keyframes`
    0% { text-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 0 0 12px rgba(255, 215, 0, 0.4); }
    50% { text-shadow: 0 0 12px rgba(255, 215, 0, 1), 0 0 24px rgba(255, 215, 0, 0.8); }
    100% { text-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 0 0 12px rgba(255, 215, 0, 0.4); }
  `;

  return (
    <>
      <Bubbles colour="rgba(225, 218, 167, 1)" />
      <Box
        sx={{
          backgroundColor: "#1a1a1a",
          color: "white",
          py: 4,
          borderRadius: '20px',
          border: '2px solid gray',
          px: 2,
          padding: '35px',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 3,
            textAlign: "center",
            background: "linear-gradient(90deg, #FFD700, #FFA500)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Wall of Fame
        </Typography>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.85,
            mb: 5,
            textAlign: "center",
            mx: "auto",
          }}
        >
          These amazing people have supported me and my work. Your names will forever shine here. Thank you!
        </Typography>

        <Paper
          sx={{
            backgroundColor: "#262626",
            borderRadius: 3,
            p: 4,
            mx: "auto",
          }}
          elevation={6}
        >
          <Grid container spacing={2}>
            {followers.map((name, index) => (
              <Grid
                item
                xs={12}   // Mobile
                sm={6}    // Tablet
                md={4}    // Laptop
                key={index}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#e4d373ff",
                    fontWeight: 600,
                    animation: `${glowAnimation} 2s infinite ease-in-out`,
                    textAlign: "center",
                  }}
                >
                  {name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{
          borderColor: "#E32636",
          color: "#E32636",
          backgroundColor: "#1a1a1a",
          mb: 3,
          top: '50px',
          "&:hover": {
            backgroundColor: "rgba(255, 215, 0, 0.1)",
            borderColor: "#d76770ff",
          },
        }}
      >
        ← Back
      </Button>
    </>
  );
};
