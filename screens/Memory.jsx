import { useEffect, useState } from "react";
import "../styles/memory.css";
import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";
import { Modal } from "@mui/material";
import { jwtVerify, SignJWT } from "jose";

export const Memory = () => {
  const [gridSize, setGridSize] = useState(16);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const navigate = useNavigate();
  const [winOpen, setWinOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [highScore, setHighScore] = useState({ easy: null, hard: null });

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
    const loadHighScore = async () => {
      const token = localStorage.getItem("memoryHighScore");
      if (token) {
        const payload = await decodeJWT(token);
        if (payload?.easy !== undefined && payload?.hard !== undefined) {
          setHighScore({ easy: payload.easy, hard: payload.hard });
        }
      }
    };
    loadHighScore();
  }, []);

  const generateShuffledCards = (size) => {
    const iconsList = ["🐶", "🐱", "🦊", "🐸", "🐵", "🦄", "🫎", "🫏", "⭐", "🔥", "😀", "❤️‍🔥", "🤚", "✌️", "🦍", "🐈", "⚙️", "🍄"];
    const pairs = [...iconsList.slice(0, size / 2), ...iconsList.slice(0, size / 2)].map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isDestroyed: false,
    }));
    return pairs.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(generateShuffledCards(16));
  const allMatched = cards.every((card) => card.isDestroyed);

  useEffect(() => {
    setCards(generateShuffledCards(gridSize));
    setFlipped([]);
    setMoves(0);
  }, [gridSize]);

  useEffect(() => {
    if (allMatched) {
      const difficulty = gridSize === 16 ? "easy" : "hard";

      setHighScore((prev) => {
        const prevScore = prev[difficulty];

        if (prevScore === null || moves < prevScore) {
          const updated = { ...prev, [difficulty]: moves };
          encodeJWT(updated).then((token) => {
            localStorage.setItem("memoryHighScore", token);
          });
          return updated;
        }

        return prev;
      });

      setWinOpen(true);
    }
  }, [allMatched]);

  useEffect(() => {
    if (flipped.length === 2) {
      setFlipping(true);
      const [a, b] = flipped;
      const cardA = cards[a];
      const cardB = cards[b];

      if (cardA.icon === cardB.icon) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === a || i === b ? { ...card, isDestroyed: true } : card
            )
          );
          setFlipped([]);
          setFlipping(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === a || i === b ? { ...card, isFlipped: false } : card
            )
          );
          setFlipped([]);
          setFlipping(false);
        }, 1000);
      }
    }
  }, [flipped, cards]);

  const handleClick = (index) => {
    if (flipping) return;

    const card = cards[index];
    if (card.isFlipped || card.isDestroyed) return;

    setCards((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, isFlipped: true } : c
      )
    );

    setFlipped((prev) => {
      const newFlipped = [...prev, index];

      if (newFlipped.length > 2) {
        const [first, ...rest] = newFlipped;
        setCards((prevCards) =>
          prevCards.map((c, i) =>
            i === first && !c.isDestroyed ? { ...c, isFlipped: false } : c
          )
        );
        return rest;
      }

      return newFlipped;
    });

    setMoves((prev) => prev + 1);
  };

  const handleReset = () => {
    setResetting(true);
    setFlipped([]);
    setMoves(0);
    setCards(generateShuffledCards(gridSize));
    setWinOpen(false);
    setResetting(false);
  };

  return (
    <div className="memory-game">
      <Bubbles colour="rgba(233, 169, 217, 0.5)"></Bubbles>
      <h1>Memory</h1>
      <h3>Flip the tiles to reveal pairs of cards! You win when all cards are revealed.</h3>
      <h3>
        Best Game: {gridSize === 16
          ? highScore.easy !== null ? `${highScore.easy} flips` : "--"
          : highScore.hard !== null ? `${highScore.hard} flips` : "--"}
      </h3>
      <div>
        <label htmlFor="grid-size">Choose Grid Size: </label>
        <select
          id="grid-size"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
        >
          <option value={16}>16 Cards (4x4)</option>
          <option value={36}>36 Cards (6x6)</option>
        </select>
        <h3>Flips: {moves}</h3>
      </div>
      {!resetting && <div className="card-grid" style={{ gridTemplateColumns: `repeat(${Math.sqrt(gridSize)}, 1fr)` }}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${card.isFlipped || card.isDestroyed ? "flipped" : ""} ${gridSize === 36 ? "small" : ""} ${card.isDestroyed ? "destroyed" : ""}`}
            onClick={() => handleClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">Memory</div>
              <div className="card-back">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>}
      {allMatched && (
        <p>
          🎉 You won!
        </p>
      )}
      <br />
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
      >
        Back to Mini Apps
      </button>
      <button onClick={handleReset}>Reset</button>
      <Modal open={winOpen} onClose={() => setWinOpen(false)}>
        <div className="modal center">
          <h2>You win!</h2>
          <p>You matched all the tiles!</p>
          <div className="horizontal-box">
            <button onClick={() => setWinOpen(false)}>Done</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
