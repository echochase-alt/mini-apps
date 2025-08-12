import "../styles/homepage.css";
import "../styles/common.css";
import "../styles/bubbles.css";
import { Bubbles } from "../components/Bubbles";
import { useEffect, useState } from "react";
import { Box, Snackbar, SnackbarContent, Typography, useMediaQuery } from "@mui/material";
import { jwtVerify, SignJWT } from "jose";
import { SortTiles } from "../components/SortTiles";
import { Navbar } from "../components/Navbar";
import { updateGistWithAchievement } from "../utils/UpdateGist";
import { SocialLinksBar } from "../components/SocialLinksBar";
import { VisitorCounter } from "../components/VisitorCounter";

export const HomePage = () => {
  const [sortOption, setSortOption] = useState("default");
  const [notification, setNotification] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");
  const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);

  const encodeJWT = async (payload) => {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
  };

  const decodeJWT = async (token) => {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (err) {
      console.error("JWT verification failed:", err);
      return null;
    }
  };

  const updateAchievements = async (achievement) => {
    const token = localStorage.getItem("achievements");
    let achievements = [];

    if (token) {
      const payload = await decodeJWT(token);
      if (Array.isArray(payload.achievements)) {
        achievements = payload.achievements;
      }
    }

    const alreadyUnlocked = achievements.some((a) => a.name === achievement.name);

    if (!alreadyUnlocked) {
      achievements.push(achievement);
      const newToken = await encodeJWT({ achievements });
      localStorage.setItem("achievements", newToken);

      setNotification(true);

      await updateGistWithAchievement({
        title: "Visitor",
        source: "First Visit",
      });
    }
  };

  useEffect(() => {
    const logVisitAndCheckFirstTime = async () => {
      try {
        await fetch("https://analytics-six-chi.vercel.app/", {
          method: "GET",
        });
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      }

      const visitorToken = localStorage.getItem("visitorInfo");
      if (!visitorToken) {
        updateAchievements({
          name: "Visitor",
          description: "Visit the website for the first time.",
          source: "Visiting the website",
          rarity: "Common",
        });
      }
    };

    logVisitAndCheckFirstTime();
  }, []);

  useEffect(() => {
    const readSortPreference = async () => {
      const sortToken = localStorage.getItem("sortPreference");
      if (sortToken) {
        const payload = await decodeJWT(sortToken);
        if (payload?.sortOption) {
          setSortOption(payload.sortOption);
        }
      }
    };
    readSortPreference();
  }, []);

  const handleSortChange = async (e) => {
    const selectedSortOption = e.target.value;
    setSortOption(selectedSortOption);

    const payload = { sortOption: selectedSortOption };
    const token = await encodeJWT(payload);
    localStorage.setItem("sortPreference", token);
  };

  return (
    <div className="center">
      <a
        style={
          isMobile
            ? {
                backgroundColor: "gray",
                padding: "10px",
                borderRadius: "20px",
                border: "2px solid black",
              }
            : undefined
        }
        className="feedback"
        href="/feedback"
      >
        Leave a message?
      </a>

      <Bubbles colour="rgba(173, 216, 230, 0.6)" />
      <Navbar />

      <div className="sort-container">
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="default">Default</option>
          <option value="category">Category</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      <div className="start">
        <h2>For the best possible experience, visit this site on desktop!</h2>
        <p>
          If you're not near a computer, no worries! This site is also optimised
          for mobile.
        </p>
        <SortTiles sortOption={sortOption}></SortTiles>
      </div>

      <Box
        sx={{
          mt: 6,
          mb: 4,
          maxWidth: 700,
          mx: "auto",
          px: 3,
          py: 3,
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "#ddd",
          fontSize: "0.9rem",
          lineHeight: 1.5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "#eee" }}>
          About This Site
        </Typography>
        <Typography paragraph>
          This site hosts a collection of interactive mini apps and games designed for both desktop and mobile users.  
          Each app is crafted with performance and usability in mind, aiming to deliver quick, enjoyable experiences.  
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700, color: "#eee" }}>
          Quick Tips
        </Typography>
        <ul style={{ marginTop: 0, paddingLeft: "1.2rem", color: "#ccc" }}>
          • Use the sorting options above to customize how tiles are arranged.
          <br />
          • Try visiting on desktop for the best experience with animations and layout.
          <br />
          • Keep an eye out for new features and achievements!
        </ul>
      </Box>
      <SocialLinksBar />

      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={() => setNotification(false)}
      >
        <SnackbarContent
          style={{ backgroundColor: "#fcc200", opacity: "90%" }}
          message={
            <span>You've unlocked a new achievement: Visitor!</span>
          }
        />
      </Snackbar>

      <br />
      <VisitorCounter />
    </div>
  );
};
