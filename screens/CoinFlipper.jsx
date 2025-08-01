import { Checkbox, FormControlLabel, FormGroup, Snackbar, SnackbarContent } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/coin-flipper.css";
import { Bubbles } from "../components/Bubbles";
import { jwtVerify, SignJWT } from "jose";
import { updateGistWithAchievement } from "../utils/UpdateGist";

export const CoinFlipper = () => {
  const [numCoins, setNumCoins] = useState(1);
  const [coinFaces, setCoinFaces] = useState(Array(numCoins).fill("none"));
  const [flipping, setFlipping] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationSpecial, setNotificationSpecial] = useState(false);
  const [wasFlipAll, setWasFlipAll] = useState(false);
  const [skin, setSkin] = useState("derp");
  const navigate = useNavigate();
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

  useEffect(() => {
    setCoinFaces(Array(numCoins).fill("none"));
  }, [numCoins]);

  const handleIncrementCoins = (delta) => {
    setNumCoins((prev) => {
      const newValue = Math.min(Math.max(prev + delta, 1), 10);
      return newValue;
    });
  };
  
  useEffect(() => {
    if (
      flipped &&
      wasFlipAll &&
      numCoins === 10 &&
      coinFaces.every((face) => face === "heads" || face === "tails") &&
      (coinFaces.every((face) => face === "heads") ||
       coinFaces.every((face) => face === "tails"))
    ) {
      updateAchievement({
        name: "What the Flip",
        description: "Obtain 10 heads or tails within a flip.",
        source: "Coin Flipper",
        rarity: "Mythical",
      });
    }
  }, [coinFaces, flipped, numCoins, wasFlipAll]);  

  const updateAchievement = async (achievement) => {
    const token = localStorage.getItem("achievements");
    let payload = { achievements: [] };

    if (token) {
      const decoded = await decodeJWT(token);
      if (decoded && Array.isArray(decoded.achievements)) {
        payload.achievements = decoded.achievements;
      }
    }

    if (!payload.achievements.some((a) => a.name === achievement.name)) {
      payload.achievements.push(achievement);
      setNotification(true);
      const newToken = await encodeJWT(payload);
      localStorage.setItem("achievements", newToken);
      await updateGistWithAchievement({title: achievement.name, source: "Coin Flipper"});
    }    
  }

  const flipCoin = (index) => {
    setFlipped(true);
    if (skipAnimation) {
      setCoinFaces((prev) => {
        const newFaces = [...prev];
        newFaces[index] = Math.random() < 0.5 ? "heads" : "tails";
        return newFaces;
      });
      return;
    }

    setFlipping(true);

    const flipTime = Math.random() * 1000 + 1000;
    const interval = setInterval(() => {
      setCoinFaces((prev) =>
        prev.map((face, i) =>
          i === index ? (Math.random() < 0.5 ? "heads" : "tails") : face
        )
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setFlipping(false);
    }, flipTime);
  };

  const flipAllCoins = () => {
    setFlipped(true);
    setWasFlipAll(true);
  
    const checkForSameFaces = (faces) => {
      if (
        numCoins === 10 &&
        (faces.every((f) => f === "heads") || faces.every((f) => f === "tails"))
      ) {
        updateAchievement({
          name: "What the Flip",
          description: "Obtain 10 heads or tails within a flip.",
          source: "Coin Flipper",
          rarity: "Mythical",
        });
        setNotificationSpecial(true);
      }
    };
  
    if (skipAnimation) {
      const newFaces = Array(numCoins)
        .fill(0)
        .map(() => (Math.random() < 0.5 ? "heads" : "tails"));
      setCoinFaces(newFaces);
  
      if (numCoins === 10) {
        updateAchievement({
          name: "Expert Flipper",
          description: "Flip 10 coins at once.",
          source: "Coin Flipper",
          rarity: "Common",
        });
        checkForSameFaces(newFaces);
      }
      return;
    }
  
    setFlipping(true);
  
    const flipTime = Math.random() * 1000 + 1000;
  
    let finalFaces = [];
    const interval = setInterval(() => {
      finalFaces = Array(numCoins)
        .fill(0)
        .map(() => (Math.random() < 0.5 ? "heads" : "tails"));
      setCoinFaces(finalFaces);
    }, 100);
  
    setTimeout(() => {
      clearInterval(interval);
      setFlipping(false);
      if (numCoins === 10) {
        updateAchievement({
          name: "Expert Flipper",
          description: "Flip 10 coins at once.",
          source: "Coin Flipper",
          rarity: "Common",
        });
        checkForSameFaces(finalFaces);
      }
    }, flipTime);
  };

  return (
    <div className="center">
      <Bubbles colour="rgb(117, 117, 117)"></Bubbles>
      <h1>Coin Flipper</h1>

      <div className="skin-container">
        <label htmlFor="sort">Choose coin: &nbsp;</label>
        <select className="coin-select" id="sort" value={skin} onChange={(e) => setSkin(e.target.value)}>
          <option value="derp">Derpy</option>
          <option value="aus">Australian</option>
        </select>
      </div>

      <div className="display-toggle">
        <button
          className="circular-button"
          onClick={() => handleIncrementCoins(-1)}
        >
          –
        </button>

        <button className="display" disabled>
          {numCoins}
        </button>

        <button
          className="circular-button"
          onClick={() => handleIncrementCoins(1)}
        >
          +
        </button>
      </div>

      <br />

      <div className="coin-container">
        {coinFaces.map((face, index) => (
          <div key={index} className="coin-wrapper">
            <div className={`coin ${skin}-${face}`} />
            <button onClick={() => flipCoin(index)} disabled={flipping}>
              Flip
            </button>
          </div>
        ))}
      </div>

      <button onClick={flipAllCoins} disabled={flipping}>
        Flip All
      </button>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={skipAnimation}
              onChange={() => setSkipAnimation(!skipAnimation)}
              sx={{
                color: "white",
                "&.Mui-checked": { color: "rgb(224, 230, 177)" },
              }}
            />
          }
          label="Skip animation"
        />
      </FormGroup>

      {flipping && <h3 className="flipping-message">Flipping...</h3>}

      {!flipping && flipped && (
        <div className="center">
          <hr className="horizontal-line" />
          <h3>Heads: {coinFaces.filter((face) => face === "heads").length}</h3>
          <h3>Tails: {coinFaces.filter((face) => face === "tails").length}</h3>
        </div>
      )}
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
      >
        Back to Mini Apps
      </button>
      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={() => setNotification(false)}
      >
        <SnackbarContent
          style={{ backgroundColor: "#fcc200", opacity: "90%" }}
          message={<span>You've unlocked a new achievement: Expert Flipper!</span>}
        />
      </Snackbar>
      <Snackbar
        open={notificationSpecial}
        autoHideDuration={3000}
        onClose={() => setNotificationSpecial(false)}
      >
        <SnackbarContent
          style={{ backgroundColor: "#f17c44", opacity: "90%" }}
          message={<span>You've unlocked a new achievement: What the Flip!</span>}
        />
      </Snackbar>
    </div>
  );
};
