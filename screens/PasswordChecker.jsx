import React, { useState } from "react";
import zxcvbn from "zxcvbn";
import {
  LinearProgress,
  Snackbar,
  SnackbarContent,
  TextField,
  Typography,
} from "@mui/material";
import { Bubbles } from "../components/Bubbles";
import { useNavigate } from "react-router-dom";
import { SignJWT, jwtVerify } from "jose";
import { updateGistWithAchievement } from "../utils/UpdateGist";

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

const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["#e53935", "#fb8c00", "#fdd835", "#43a047", "darkgreen"];

export const PasswordChecker = () => {
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [notification, setNotification] = useState(false);
  const navigate = useNavigate();

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
        title: achievement.name,
        source: "Password Checker",
      });
    }
  };  

  const handleChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);

    const result = zxcvbn(pwd);
    const adjustedScore = customAdjustScore(pwd, result.score);

    setScore(adjustedScore);
    setFeedback(
      result.feedback.warning || result.feedback.suggestions[0] || ""
    );

    if (adjustedScore === 4) {
      updateAchievements({
        name: "Hack Me If You Can",
        description: "Create a strong password.",
        source: "Password Checker",
        rarity: "Common",
      });
    }
  };

  const customAdjustScore = (password, baseScore) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const longEnough = password.length > 7;

    const criteriaTotal =
      Number(hasUpper) + Number(hasLower) + Number(hasSymbol) + Number(longEnough);

    if (baseScore === 4 && criteriaTotal === 3) {
      return 3.5;
    } else if (baseScore === 4 && criteriaTotal === 2) {
      return 3;
    }

    return baseScore;
  };

  return (
    <div className="center">
      <Bubbles colour={"rgba(133, 165, 230, 0.5)"} />
      <h1>Password Strength Checker</h1>
      <h2>Check your password strength here!</h2>
      <h3>A good password contains:</h3>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: 0,
        }}
      >
        <li>At least 8 characters</li>
        <li>At least 1 lower case letter [a-z]</li>
        <li>At least 1 upper case letter [A-Z]</li>
        <li>At least 1 number [0-9]</li>
        <li>At least 1 symbol (-, =, +, ...)</li>
      </ul>
      <TextField
        fullWidth
        type="password"
        label="Enter Password"
        value={password}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        sx={{
          margin: 1,
          "& .MuiInputBase-input": {
            borderColor: "white",
            color: "white",
            "&::placeholder": { color: "white", opacity: 0.5 },
          },
          "& .MuiInputLabel-root": { color: "white" },
          "& .MuiInputLabel-root.Mui-focused": { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "gray" },
            "&.Mui-focused fieldset": { borderColor: "white" },
          },
        }}
      />
      <br />
      {password && (
        <>
          <LinearProgress
            variant="determinate"
            value={((score + 1) / 5) * 100}
            sx={{
              height: 10,
              width: "300px",
              borderRadius: 5,
              border: "2px solid black",
              backgroundColor: "#eee",
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  score % 1 !== 0 ? "#008000" : strengthColors[score],
              },
            }}
          />
          <b
            style={{
              marginTop: 8,
              color: score % 1 !== 0 ? "#008000" : strengthColors[score],
              textShadow:
                "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          >
            {score % 1 === 0 ? strengthLabels[score] : "Very Good"}
          </b>
          {feedback && (
            <Typography variant="body2" color="white" style={{ marginTop: 4 }}>
              {feedback}
            </Typography>
          )}
        </>
      )}
      <h3>
        Powered by{" "}
        <a href="https://github.com/dropbox/zxcvbn">zxcvbn</a> (check it out on
        GitHub) with some tweaks.
      </h3>
      <p>
        This tool is purely for advisory purposes. A strong password does not
        guarantee absolute security of your account.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#E32636",
        }}
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
              You've unlocked a new achievement: Hack Me If You Can!
            </span>
          }
        />
      </Snackbar>
    </div>
  );
};
