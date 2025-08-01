import "../styles/homepage.css";
import "../styles/common.css";
import "../styles/bubbles.css";
import { Bubbles } from "../components/Bubbles";
import { useEffect, useState } from "react";
import { Snackbar, SnackbarContent, useMediaQuery } from "@mui/material";
import { jwtVerify, SignJWT } from "jose";
import { SortTiles } from "../components/SortTiles";
import { Navbar } from "../components/Navbar";
import { updateGistWithAchievement } from "../utils/UpdateGist";
import { SocialLinksBar } from "../components/SocialLinksBar";

export const HomePage = () => {
  const [sortOption, setSortOption] = useState("default");
  const [showIframe, setShowIframe] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
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
    const checkIframeDismissed = async () => {
      const visitorToken = localStorage.getItem("visitorInfo");
      if (visitorToken) {
        const payload = await decodeJWT(visitorToken);
        if (payload?.iframeDismissed) {
          setShowIframe(false);
        }
      } else {
        updateAchievements({
          name: "Visitor",
          description: "Visit the website for the first time.",
          source: "Visiting the website",
          rarity: "Common",
        });
        
      }
    };
    checkIframeDismissed();
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

  useEffect(() => {
    const handleMessage = async (e) => {
      if (e.data.closeIframe || e.data.name) {
        const payload = {
          iframeDismissed: true,
          ...(e.data.name && { visitorName: e.data.name }),
        };
  
        const token = await encodeJWT(payload);
        localStorage.setItem("visitorInfo", token);
        setShowIframe(false);
  
        if (e.data.name) {
          setNotificationOpen(true);
        }
      }
    };
  
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  

  return (
    <div className="center">
      <a
        style={isMobile ? {
            backgroundColor: "gray",
            padding: "10px",
            borderRadius: "20px",
            border: "2px solid black",
          } : undefined
        }
        className="feedback"
        href="/feedback"
      >
        Leave a message?
      </a>
      {showIframe && (
        <iframe
          src="https://analytics-six-chi.vercel.app/"
          className="name-form-iframe"
          title="Name Form"
        ></iframe>
      )}
      <Bubbles colour="rgba(173, 216, 230, 0.6)" />
      <Navbar />

      <div className="sort-container">
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={handleSortChange} // Update sort option and store preference
        >
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
      <SocialLinksBar />
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={() => setNotificationOpen(false)}
      >
        <SnackbarContent
          style={{ backgroundColor: "#4CAF50", opacity: "90%" }}
          message={<span>Thank you!</span>}
        />
      </Snackbar>
      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={() => setNotification(false)}
      >
        <SnackbarContent
          style={{ backgroundColor: "#fcc200", opacity: "90%" }}
          message={
            <span>
              You've unlocked a new achievement: Visitor!
            </span>
          }
        />
      </Snackbar>
    </div>
  );
};
