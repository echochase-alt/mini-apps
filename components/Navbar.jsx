import { useState } from "react";
import { useMediaQuery, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";

export const Navbar = () => {
  const condenseOptions = useMediaQuery("(max-width: 1100px)");
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (route) => {
    setAnchorEl(null);
    if (route) navigate(route);
  };

  return (
    <div className="navbar">
      <h1 className="title" onClick={() => navigate("/")}>Echo's Mini Apps</h1>
      {condenseOptions ? (
        <>
          <ListIcon
            sx={{
              height: "35px",
              width: "35px",
              position: "relative",
              right: "25px",
              cursor: "pointer",
              color: "white"
            }}
            onClick={handleMenuOpen}
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleMenuClose()}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "black",
                  color: "white",
                },
              },
            }}
          >
            <MenuItem onClick={() => handleMenuClose("/socials")} sx={menuItemStyle}>Socials</MenuItem>
            <MenuItem onClick={() => handleMenuClose("/achievements")} sx={menuItemStyle}>Achievements</MenuItem>
            <MenuItem onClick={() => handleMenuClose("/wall-of-fame")} sx={menuItemStyle}>Wall of Fame</MenuItem>
            <MenuItem onClick={() => handleMenuClose("/feedback")} sx={menuItemStyle}>Feedback</MenuItem>
            <MenuItem
              onClick={() => window.open("https://www.buymeacoffee.com/echocodez", "_blank")}
              sx={menuItemStyle}
            >
              Buy Me a Coffee
            </MenuItem>
          </Menu>
        </>
      ) : (
        <div className="tile-titles">
          <h2 className="tile-title" onClick={() => navigate("/achievements")}>Achievements</h2>
          <h2 className="tile-title" onClick={() => navigate("/feedback")}>Feedback</h2>
          <h2 className="tile-title" onClick={() => navigate("/wall-of-fame")}>Wall of Fame</h2>
          <h2 className="tile-title glow" onClick={() => navigate("/socials")}>Socials</h2>
          <a
            href="https://www.buymeacoffee.com/echocodez"
            target="_blank"
            rel="noopener noreferrer"
            className="buy-coffee-button glow"
          >
            ☕ Buy Me a Coffee
          </a>
        </div>
      )}
    </div>
  );
};

const menuItemStyle = {
  "&:hover": {
    opacity: 0.7,
    transform: "scale(0.95)",
  },
  transition: "all 0.2s ease",
};
