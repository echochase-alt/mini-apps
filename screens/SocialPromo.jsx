import { Box, Typography, Button, Paper, IconButton, Link } from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import PatreonIcon from '@mui/icons-material/AccountBalanceWallet'; // Patreon icon substitute (MUI doesn't have official Patreon icon)
import TikTokIcon from '@mui/icons-material/MusicNote'; // TikTok substitute (no official MUI TikTok icon)
import { useNavigate } from "react-router-dom";

export const SocialPromo = () => {
  const navigate = useNavigate();
  const socials = [
    {
      name: "Instagram",
      icon: <InstagramIcon sx={{ fontSize: 36, color: "#E1306C" }} />,
      url: "https://instagram.com/echocodez",
    },
    {
      name: "Patreon",
      icon: <PatreonIcon sx={{ fontSize: 36, color: "#F96854" }} />,
      url: "https://patreon.com/echocodez",
    },
    {
      name: "TikTok",
      icon: <TikTokIcon sx={{ fontSize: 36, color: "#69C9D0" }} />,
      url: "https://tiktok.com/@echo_codez",
    },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #2c2c2c, #1e1e1e)',
        color: '#fff',
        maxWidth: 500,
        margin: "auto",
        textAlign: "center",
        userSelect: 'none'
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Connect With Me
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 420 }}>
          Follow and support me on these platforms for updates, exclusive content, and more!
        </Typography>

        <Box
          mt={2}
          display="flex"
          justifyContent="center"
          gap={4}
          aria-label="Social media links"
        >
          {socials.map(({ name, icon, url }) => (
            <Link
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              {icon}
            </Link>
          ))}
        </Box>

        <Button
          variant="outlined"
          sx={{ mt: 3, fontWeight: 600, color: "#c82333", border: "0.5px solid #c82333" }}
          onClick={() => navigate("/")}
        >
          Back to Mini Apps
        </Button>
      </Box>
    </Paper>
  );
};
