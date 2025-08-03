import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/spinnerwheel.css";
import { Wheel } from "../components/Wheel";
import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";
import { getToken, decodeJWT, updateToken } from "../utils/jwtUtils";
import { Snackbar, SnackbarContent, TextField } from "@mui/material";
import { SignJWT } from "jose";
import { updateGistWithAchievement } from "../utils/UpdateGist";

export const SpinnerWheel = () => {
  const [prizes, setPrizes] = useState([
    "Prize 1",
    "Prize 2",
    "Prize 3",
    "Prize 4",
    "Prize 5",
    "Prize 6",
  ]);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [edit, setEdit] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const [fullError, setFullError] = useState(false);
  const [notification, setNotification] = useState(false);
  const navigate = useNavigate();
  const [spinCount, setSpinCount] = useState(0);
  const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
  
  useEffect(() => {
    checkSpinCount();
  }, []);

  useEffect(() => {
    if (spinCount === 10) {
      setNotification(true);
    }
    checkAchievement();
  }, [spinCount]);
  
  const checkAchievement = async () => {
    try {
      if (spinCount === 10) {
  
        let token = getToken("achievements");
  
        if (!token) {
          const newAchievementToken = await new SignJWT({ achievements: [] })
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret);
  
          localStorage.setItem("achievements", newAchievementToken);
          token = newAchievementToken;
        }
  
        const payload = await decodeJWT(token);
        if (!payload) return;
  
        const achievements = payload.achievements || [];
        const alreadyHasIt = achievements.some(
          (a) => a.name === "Super Spinner"
        );
        
        if (!alreadyHasIt) {
          console.log("Unlocking achievement...");
          const newAchievement = {
            name: "Super Spinner",
            description: "Spin the spinner wheel 10 times.",
            source: "Spinner Wheel",
            rarity: "Rare",
          };
          setNotification(true);
          updateGistWithAchievement({ title: "Super Spinner", source: "Spinner Wheel" });
          await updateToken("achievements", {
            achievements: [...achievements, newAchievement],
          });

        }
      }
    } catch (error) {
      console.error("Error in checkAchievement:", error);
    }
  };

  const checkSpinCount = async () => {
    try {
      let token = getToken("spinCount");

      if (!token) {
        // If no token exists, create a new one with spinCount
        const newSpinCountToken = await new SignJWT({ spinCount: 0 }) // Set initial spin count to 0
          .setProtectedHeader({ alg: 'HS256' })
          .sign(secret);

        localStorage.setItem("spinCount", newSpinCountToken); // Store the token
        token = newSpinCountToken;
      }

      const payload = await decodeJWT(token);
      if (payload && payload.spinCount !== undefined) {
        setSpinCount(payload.spinCount); // Set the spin count from JWT payload
      }
    } catch (error) {
      console.error("Error in checkSpinCount:", error);
    }
  };
  
  const updateSpinCount = async (newSpinCount) => {
    try {
      let token = getToken("spinCount");
      const payload = await decodeJWT(token);

      const updatedToken = await new SignJWT({ spinCount: newSpinCount }) // Update the spin count
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);

      localStorage.setItem("spinCount", updatedToken); // Store the updated token
      setSpinCount(newSpinCount); // Update state
    } catch (error) {
      console.error("Error updating spin count:", error);
    }
  };

  const addPrize = () => {
    setEmptyError(false);
    if (prizes.length >= 10) {
      setFullError(true);
      return;
    }
    setPrizes([...prizes, `Prize ${prizes.length + 1}`]);
  };

  const handleDelete = (index) => {
    setFullError(false);
    if (prizes.length < 3) {
      setEmptyError(true);
      return;
    }
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const finishEdit = () => {
    setEdit(false);
    setEmptyError(false);
    setFullError(false);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomSpin = 1800 + Math.random() * 1800;
    setRotation((prev) => prev + randomSpin);

    setTimeout(() => {
      setIsSpinning(false);
      const nextSpinCount = spinCount + 1;
      updateSpinCount(nextSpinCount); // Update the spin count in JWT
    }, 4000);
  };

  const editChange = (newPrize, index) => {
    const updatedPrizes = [...prizes];
    updatedPrizes[index] = newPrize;
    setPrizes(updatedPrizes);
  };

  return (
    <div className="wheel-container">
      <Bubbles colour="rgb(202,193,209)" />
      <h1>Spinner Wheel</h1>
      <Wheel {...{ rotation, prizes }} />
      {edit && (
        <div className="prize-edit-container">
          {prizes.map((p, index) => (
            <div key={index} className="prize-edit-row">
              <TextField
                label={`Prize ${index + 1}`}
                value={p}
                onChange={(e) => editChange(e.target.value, index)}
                size="small"
                variant="outlined"
                sx={{
                  flex: 1,
                  minWidth: 120,
                  maxWidth: 250,
                  marginRight: 1,
                  input: {
                    color: "white",
                  },
                  label: {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                    backgroundColor: "transparent",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "white",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "white",
                    opacity: 1,
                  },
                }}
              />
              <DeleteIcon
                className="delete"
                onClick={() => handleDelete(index)}
                sx={{ cursor: "pointer", color: "#da4b57ff" }}
              />
            </div>
          ))}
        </div>
      )}
      {fullError && (
        <div style={{ color: "#E32636" }}>
          Can't have more than 10 prizes!
        </div>
      )}
      {emptyError && (
        <div style={{ color: "#E32636" }}>
          Can't have less than 2 prizes!
        </div>
      )}
      <div className="controls">
        {edit ? (
          <div>
            <button onClick={addPrize} className="add-button">
              Add Prize
            </button>
            <button onClick={finishEdit}>Done</button>
          </div>
        ) : (
          <button onClick={() => setEdit(true)} disabled={isSpinning}>
            Edit Wheel
          </button>
        )}

        {!edit && (
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="spin-button"
          >
            {isSpinning ? "Spinning..." : "Spin the Wheel"}
          </button>
        )}
      </div>
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
          message={
            <span>
              You've unlocked a new achievement: Super Spinner!
            </span>
          }
        />
      </Snackbar>
    </div>
  );
};
