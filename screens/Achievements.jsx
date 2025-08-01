import React, { useEffect, useState } from "react";
import { jwtVerify } from "jose";
import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";
import "../styles/achievements.css";

const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);

const decodeJWT = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
};

export const Achievements = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const token = localStorage.getItem("achievements");
      if (!token) return;

      const payload = await decodeJWT(token);
      if (Array.isArray(payload.achievements)) {
        setAchievements(payload.achievements);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className="center">
      <Bubbles colour="rgb(222, 218, 119)" />
      <h1>Achievements</h1>
      {achievements.length === 0 ? (
        <p style={{ color: "white" }}>No achievements unlocked yet.</p>
      ) : (
        <div className="achievements">
          {achievements.map((ach, index) => (
            <div key={index} className="achievement">
              <div className={`trophy ${ach.rarity?.toLowerCase().replace(/\s+/g, '')}`}>🏆</div>
              <div className="achievement-info">
                <h3>{ach.name}</h3>
                <p>{ach.description}</p>
                {ach.source && (
                  <p className="achievement-meta">
                    <strong>Obtained From:</strong> {ach.source}
                  </p>
                )}
                {ach.rarity && (
                  <p className="achievement-meta">
                    <strong>Rarity:</strong>{" "}
                    <span className={`rarity ${ach.rarity?.toLowerCase().replace(/\s+/g, '')}`}>
                      {ach.rarity}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <br />
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636", marginTop: "10px" }}
      >
        Back to Mini Apps
      </button>
    </div>
  );
};
