import { Box, Typography, Button, Paper, Link } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaPatreon, FaTiktok, FaCoffee } from "react-icons/fa"; // import from react-icons
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
      icon: <FaPatreon size={32} color="#FF424D" />,
      url: "https://patreon.com/echocodez",
    },
    {
      name: "TikTok",
      icon: <FaTiktok size={32} color="#69C9D0" />,
      url: "https://tiktok.com/@echo_codez",
    },
    {
      name: "Buy Me a Coffee",
      icon: <FaCoffee size={32} color="#FFDD00" />,
      url: "https://www.buymeacoffee.com/echocodez",
    },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "linear-gradient(135deg, #2c2c2c, #1e1e1e)",
        color: "#fff",
        maxWidth: 600,
        margin: "auto",
        textAlign: "center",
        userSelect: "none",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Connect With Me
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 480 }}>
          Follow and support me on these platforms for updates, exclusive content, and more!
        </Typography>

        <Box
          mt={2}
          display="flex"
          justifyContent="center"
          gap={4}
          flexWrap="wrap"
          aria-label="Social media links"
        >
          {socials.map(({ name, icon, url }) => (
            <Box key={name} textAlign="center">
              <Link
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
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                {name}
              </Typography>
            </Box>
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
