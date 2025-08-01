import { useEffect, useState } from "react";
import "../styles/tictactoe.css";
import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";
import { jwtVerify, SignJWT } from "jose";
import { Snackbar, SnackbarContent } from "@mui/material";
import { updateGistWithAchievement } from "../utils/UpdateGist";

export const TicTacToe = () => {
  const initialBoard = Array(9).fill(null);
  const [notification, setNotification] = useState(false);
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState("2p");
  const [stats, setStats] = useState({
    ai: { wins: 0, losses: 0, draws: 0 },
    "ai-hard": { wins: 0, losses: 0, draws: 0 },
  });

  const winner = calculateWinner(board);
  const navigate = useNavigate();
  const isAITurn = (mode === "ai" || mode === "ai-hard") && !xIsNext && !winner;
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
    const loadStats = async () => {
      const token = localStorage.getItem("ttt");
      if (token) {
        const payload = await decodeJWT(token);
        if (payload) {
          setStats(payload);
        }
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const updateAchievements = async () => {
      if (winner === "X" && mode === "ai-hard") {
        const token = localStorage.getItem("achievements");
        let payload = { achievements: [] };
    
        if (token) {
          const decoded = await decodeJWT(token);
          if (decoded && Array.isArray(decoded.achievements)) {
            payload.achievements = decoded.achievements;
          }
        }
    
        const achievement = {
          name: "Tic Tac Toe Champion",
          description: "Win a game against hard AI in Tic Tac Toe.",
          source: "Tic Tac Toe",
          rarity: "Ultra Rare"
        };
    
        const alreadyUnlocked = payload.achievements.some(
          (a) => a.name === achievement.name
        );
    
        if (!alreadyUnlocked) {
          payload.achievements.push(achievement);
          setNotification(true);
          const newToken = await encodeJWT(payload);
          localStorage.setItem("achievements", newToken);
    
          await updateGistWithAchievement({
            title: achievement.name,
            source: "Tic Tac Toe",
          });
        }
      }
    };

    const updateStats = async () => {
      if (mode === "ai" || mode === "ai-hard") {
        const updatedStats = { ...stats };
        const isDraw = !winner;

        if (isDraw) {
          updatedStats[mode].draws += 1;
        } else {
          const playerWon = winner === "X";
          if (playerWon) updatedStats[mode].wins += 1;
          else updatedStats[mode].losses += 1;
        }

        const token = await encodeJWT(updatedStats);
        localStorage.setItem("ttt", token);
        setStats(updatedStats);
      }
    };

    if (winner || board.every((s) => s)) {
      updateStats();
      updateAchievements();
    }
  }, [winner, board]);

  useEffect(() => {
    if (isAITurn) {
      const aiMove = getAIMove(board, mode);
      if (aiMove !== null) {
        setTimeout(() => {
          handleClick(aiMove);
        }, 500);
      }
    }
  }, [board, xIsNext, isAITurn]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setBoard(initialBoard);
    setXIsNext(true);
  };

  const renderStatus = () => {
    if (winner) return `🎉 Winner: ${winner}`;
    if (board.every((square) => square)) return "It's a draw!";
    return `Next turn: ${xIsNext ? "X" : "O"}`;
  };

  return (
    <div className="tictactoe">
      <Bubbles colour="rgba(198, 166, 68, 0.5)" />
      <h1>Tic Tac Toe</h1>
      <div>
        <label htmlFor="mode">Mode: </label>
        <select
          className="mode-select"
          id="mode"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            handleReset();
          }}
        >
          <option value="2p">2 Players</option>
          <option value="ai">Play vs. AI</option>
          <option value="ai-hard">AI (hard)</option>
        </select>
      </div>

      {(mode === "ai" || mode === "ai-hard") && (
        <div style={{ margin: "10px 0", fontSize: "16px" }}>
          Wins: {stats[mode].wins} | Losses: {stats[mode].losses} | Draws:{" "}
          {stats[mode].draws}
        </div>
      )}

      <p>{renderStatus()}</p>
      <div className="board">
        {board.map((value, index) => (
          <div
            key={index}
            className="square"
            onClick={() => {
              if ((mode === "ai" || mode === "ai-hard") && !xIsNext) return;
              handleClick(index);
            }}
          >
            {value}
          </div>
        ))}
      </div>
      <button onClick={handleReset}>Reset</button>
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
              You've unlocked a new achievement: Tic Tac Toe Champion!
            </span>
          }
        />
      </Snackbar>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}

function getAIMove(board, mode) {
  const empty = board
    .map((val, index) => (val === null ? index : null))
    .filter((i) => i !== null);

  for (let i of empty) {
    const copy = [...board];
    copy[i] = "O";
    if (calculateWinner(copy) === "O") return i;
  }

  for (let i of empty) {
    const copy = [...board];
    copy[i] = "X";
    if (calculateWinner(copy) === "X") return i;
  }

  if (empty.includes(4)) return 4;

  if (mode === "ai-hard") {
    for (const i of [0, 2, 6, 8]) {
      if (empty.includes(i)) return i;
    }
  }

  return empty[Math.floor(Math.random() * empty.length)] ?? null;
}
