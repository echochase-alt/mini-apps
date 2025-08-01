import React, { useState, useEffect } from "react";
import { Modal, Snackbar, SnackbarContent, useMediaQuery } from "@mui/material";
import "../styles/operations.css";
import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";
import { jwtVerify, SignJWT } from "jose";
import { updateGistWithAchievement } from "../utils/UpdateGist";

export const Operations = () => {
  const [step, setStep] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const [target, setTarget] = useState(0);
  const [expression, setExpression] = useState("");
  const [usedCounts, setUsedCounts] = useState({});
  const [resultMessage, setResultMessage] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isSkipModalOpen, setSkipModalOpen] = useState(false);
  const [isBackModalOpen, setBackModalOpen] = useState(false);
  const [isWinModalOpen, setWinModalOpen] = useState(false);
  const [duplicatorCount, setDuplicatorCount] = useState(0);
  const [shufflerCount, setShufflerCount] = useState(0);
  const [shuffleNotificationOpen, setShuffleNotificationOpen] = useState(false);
  const [duplicatedIndex, setDuplicatedIndex] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [powerUpUsedThisRound, setPowerUpUsedThisRound] = useState(false);
  const [notification, setNotification] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState(null);

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

  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const allAchievements = [
    {
      name: "Number Cruncher",
      description: "Attain a score of 10 in a single game of Operations.",
      source: "Operations",
      rarity: "Rare",
    },
    {
      name: "Number Meister",
      description: "Attain a score of 50 in a single game of Operations.",
      source: "Operations",
      rarity: "Legendary",
    },
    {
      name: "Numb to Numbers",
      description: "Attain a score of 100 in a single game of Operations.",
      source: "Operations",
      rarity: "Mythical",
    },
  ];

  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadAchievements = async () => {
      const token = localStorage.getItem("achievements");
      if (token) {
        const data = await decodeJWT(token);
        setAchievements(data.achievements || []);
      }
    };
    loadAchievements();
  }, []);

  const updateAchievements = async (currentScore) => {
    const earned = allAchievements.filter(
      (a) =>
        (a.name === "Number Cruncher" && currentScore >= 10) ||
        (a.name === "Number Meister" && currentScore >= 50) ||
        (a.name === "Numb to Numbers" && currentScore >= 100)
    );
  
    const newAchievements = earned.filter(
      (ach) => !achievements.some((a) => a.name === ach.name)
    );
  
    if (newAchievements.length > 0) {
      const updated = [...achievements, ...newAchievements];
      setAchievements(updated);
      const token = await encodeJWT({ achievements: updated });
      localStorage.setItem("achievements", token);
  
      setLatestAchievement(newAchievements[0]);
      setNotification(true);
  
      for (const ach of newAchievements) {
        await updateGistWithAchievement({
          title: ach.name,
          source: "Operations Game",
        });
      }
    }
  };

  useEffect(() => {
    updateAchievements(score);
  }, [score]);

  useEffect(() => {
    const loadHighScore = async () => {
      const token = localStorage.getItem("operationsHighScore");
      if (token) {
        const payload = await decodeJWT(token);
        setHighScore(payload.score);
      } else {
        setHighScore(0);
      }
    };
    generatePuzzle(true);
    loadHighScore();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (step !== 2) return; // Only handle keys when the game is active

      switch (event.key) {
        case "1":
          handleOperatorClick("+");
          break;
        case "2":
          handleOperatorClick("-");
          break;
        case "3":
          handleOperatorClick("*");
          break;
        case "4":
          handleOperatorClick("/");
          break;
        case "5":
          handleParenthesisClick("(");
          break;
        case "6":
          handleParenthesisClick(")");
          break;
        case "s":
          setSkipModalOpen(true);
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [step]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      encodeJWT({ score }).then((token) =>
        localStorage.setItem("operationsHighScore", token)
      );
    }
  }, [score]);

  const generateNumbers = () => {
    const nums = [];
    const count = {};

    while (nums.length < 4) {
      const num = Math.floor(Math.random() * 12) + 1;
      count[num] = (count[num] || 0) + 1;

      if (count[num] <= 2) {
        nums.push(num);
      } else {
        count[num]--;
      }
    }

    const values = Object.values(count);
    if (values.length === 2 && values.every((c) => c === 2)) {
      let replacement;
      do {
        replacement = Math.floor(Math.random() * 12) + 1;
      } while ((count[replacement] || 0) >= 2);

      const last = nums.pop();
      count[last]--;
      if (count[last] === 0) delete count[last];

      nums.push(replacement);
      count[replacement] = (count[replacement] || 0) + 1;
    }

    return nums;
  };

  const generateTarget = () => {
    const validTargets = [];
    const isAllowedPrimeFactorization = (n) => {
      const allowedPrimes = [2, 3, 5, 7];
      const factors = [];
      for (const prime of allowedPrimes) {
        while (n % prime === 0) {
          factors.push(prime);
          n = n / prime;
        }
      }
      return (
        n === 1 &&
        (factors.length >= 3 || factors.reduce((a, b) => a * b, 1) < 10)
      );
    };
    for (let i = 1; i <= 100; i++) {
      if (isAllowedPrimeFactorization(i)) {
        validTargets.push(i);
      }
    }
    return validTargets[Math.floor(Math.random() * validTargets.length)];
  };

  const generatePuzzle = (first = false) => {
    const nums = generateNumbers();
    setNumbers(nums);
    setTarget(generateTarget());
    setPowerUpUsedThisRound(false);
    setExpression("");
    setUsedCounts({});
    setResultMessage("");
    setDuplicatedIndex(null);

    if (!first && Math.random() < 0.1) {
      setDuplicatorCount((prev) => Math.min(prev + 1, 99));
      setNotificationOpen(true);
    }

    if (!first && Math.random() < 0.1) {
      setShufflerCount((prev) => Math.min(prev + 1, 99));
      setShuffleNotificationOpen(true);
    }
  };

  const handleNumberClick = (num, index) => {
    setUsedCounts((prev) => {
      const count = prev[index] || 0;
      const maxCount = duplicatedIndex === index ? 2 : 1;

      if (count < maxCount) {
        return { ...prev, [index]: count + 1 };
      } else {
        // Unselect if already selected max times
        const updated = { ...prev };
        updated[index] = count - 1;
        if (updated[index] <= 0) delete updated[index];
        return updated;
      }
    });

    const numStr = num.toString();
    setExpression((prev) => {
      const parts = prev.trim().split(/\s+/);
      const countInExpr = parts.filter((x) => x === numStr).length;
      const count = usedCounts[index] || 0;
      const maxCount = duplicatedIndex === index ? 2 : 1;

      if (count < maxCount) {
        return (prev + " " + numStr).trim();
      } else {
        const idx = parts.lastIndexOf(numStr);
        if (idx !== -1) {
          parts.splice(idx, 1);
          return parts.join(" ");
        }
        return prev;
      }
    });
  };

  const handleOperatorClick = (op) => {
    setExpression((prev) => (prev + " " + op).trim());
  };

  const handleParenthesisClick = (paren) => {
    setExpression((prev) => (prev + " " + paren).trim());
  };

  const handleBackspace = () => {
    const tokens = expression.trim().split(/\s+/);
    const last = tokens.pop();
    if (!isNaN(Number(last))) {
      const value = Number(last);
      const match = Object.entries(usedCounts)
        .reverse()
        .find(([i, c]) => numbers[i] === value && c > 0);

      if (match) {
        const [matchIndex, count] = match;
        setUsedCounts((prev) => {
          const updated = { ...prev };
          updated[matchIndex] = count - 1;
          if (updated[matchIndex] <= 0) delete updated[matchIndex];
          return updated;
        });
      }
    }
    setExpression(tokens.join(" "));
  };

  function preprocessExpression(expr) {
    // Remove trailing operators
    expr = expr.replace(/[\+\-\*\/]+$/, "");

    // Remove all whitespace
    expr = expr.replace(/\s+/g, "");

    let result = "";
    for (let i = 0; i < expr.length; i++) {
      const curr = expr[i];
      const next = expr[i + 1];

      result += curr;

      if (
        (/\d/.test(curr) && next === "(") ||
        (curr === ")" && next === "(") ||
        (curr === ")" && /\d/.test(next))
      ) {
        result += "*";
      }
    }

    // Balance unmatched opening brackets
    const openBrackets = (result.match(/\(/g) || []).length;
    const closeBrackets = (result.match(/\)/g) || []).length;
    if (openBrackets > closeBrackets) {
      result += ")".repeat(openBrackets - closeBrackets);
    }

    return result;
  }

  const handleConfirm = () => {
    // Validating that each number is used once and checking expression
    const allUsed = numbers.every((_, index) => (usedCounts[index] || 0) >= 1);
    const allValid = numbers.every((_, index) => {
      const count = usedCounts[index] || 0;
      const maxAllowed = duplicatedIndex === index ? 2 : 1;
      return count <= maxAllowed;
    });
    const totalUsed = Object.values(usedCounts).reduce((a, b) => a + b, 0);
    const validTotalUsed =
      totalUsed === 4 || (duplicatedIndex !== null && totalUsed === 5);

    if (!allUsed || !allValid || !validTotalUsed) {
      setResultMessage(
        "⚠️ Use each number at least once. Duplicated number can be used up to twice."
      );
      return;
    }

    try {
      const processed = preprocessExpression(expression);
      const result = eval(processed);

      if (Math.abs(result - target) < 0.0001) {
        setResultMessage("✅ Correct! You matched the target!");
        const newScore = score + 1;
        setScore(newScore);
        if (newScore === 100) {
          setWinModalOpen(true);
        }
        setTimeout(() => generatePuzzle(), 1000);
      } else {
        setResultMessage(`❌ Incorrect. Your result: ${result}`);
      }
    } catch (e) {
      setResultMessage("⚠️ Invalid expression");
    }
  };

  const skipPuzzle = () => {
    generatePuzzle(false);
    setSkipModalOpen(false);
  };

  const confirmBack = () => {
    navigate("/");
  };

  const useDuplicator = () => {
    if (duplicatorCount > 0 && !powerUpUsedThisRound) {
      const indices = numbers.map((_, i) => i);
      const idx = indices[Math.floor(Math.random() * indices.length)];
      setDuplicatedIndex(idx);
      setDuplicatorCount((prev) => prev - 1);
      setPowerUpUsedThisRound(true);
    }
  };

  const useShuffler = () => {
    if (shufflerCount > 0 && !powerUpUsedThisRound) {
      setShufflerCount((prev) => prev - 1);
      setPowerUpUsedThisRound(true);
      setNumbers(generateNumbers());
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Bubbles colour="rgba(157, 202, 226, 0.82)" />
      {step === 1 ? (
        <>
          <h1>Operations</h1>
          <p style={{ fontSize: "20px" }}>
            Use the 4 numbers given to you <b>exactly once</b> to make the
            target number.
          </p>
          <p style={{ fontSize: "20px" }}>
            Use the operations available to you as much or as little as you
            like.
          </p>
          <p style={{ fontSize: "20px" }}>
            Even though the algorithm tries its best to generate a solvable
            puzzle, some puzzles are impossible to solve.
          </p>
          <p style={{ fontSize: "20px" }}>
            A skip button is provided. Clicking it will generate a new puzzle
            without resetting your progress.
          </p>
          <p style={{ fontSize: "20px" }}>
            If you're lucky, you might receive some cool power-ups!
          </p>
          <h3 style={{ fontSize: "20px" }}>Have fun!</h3>
          <div className="center">
            <button
              className="menu-button"
              style={{ backgroundColor: "#008000" }}
              onClick={() => setStep(2)}
            >
              Start Game
            </button>
            <button
              onClick={() => setBackModalOpen(true)}
              style={{ backgroundColor: "#E32636" }}
              className="menu-button"
            >
              Back to Mini Apps
            </button>
          </div>
        </>
      ) : (
        <>
          <h1>Operations</h1>
          <h2>
            🎯 Target Number: <strong>{target}</strong>
          </h2>
          <h3>🏆 Score: {score}</h3>
          <h4>📈 High Score: {highScore}</h4>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              margin: "20px 0",
            }}
          >
            {numbers.map((num, index) => {
              const count = usedCounts[index] || 0;
              const maxCount = duplicatedIndex === index ? 2 : 1;
              const isDuplicated = duplicatedIndex === index;

              return (
                <div className="number-button-wrapper" key={index}>
                  {isDuplicated && count === 0 && (
                    <div className="duplicated-badge">x2</div>
                  )}
                  <button
                    onClick={() => handleNumberClick(num, index)}
                    className="number-button"
                    style={{
                      backgroundColor: count === maxCount ? "#ccc" : "#6e9dad",
                    }}
                  >
                    {num}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="center">
            <div style={{ margin: "10px 0" }}>
              {["+", "-", "*", "/"].map((op) => (
                <button
                  key={op}
                  onClick={() => handleOperatorClick(op)}
                  className="operation-button"
                >
                  {op}
                </button>
              ))}
              {isMobile && <br />}
              {["(", ")"].map((paren) => (
                <button
                  key={paren}
                  onClick={() => handleParenthesisClick(paren)}
                  className="operation-button"
                >
                  {paren}
                </button>
              ))}
              <button onClick={handleBackspace} className="backspace-button">
                ⬅ Backspace
              </button>
            </div>
            <div className="horizontal-box">
              {duplicatorCount > 0 && (
                <div
                  className={`duplicator-frame ${
                    powerUpUsedThisRound ? "disabled" : ""
                  }`}
                  onClick={!powerUpUsedThisRound ? useDuplicator : undefined}
                  style={{
                    cursor: powerUpUsedThisRound ? "not-allowed" : "pointer",
                    opacity: powerUpUsedThisRound ? 0.5 : 1,
                  }}
                >
                  🧪
                  <div className="duplicator-count">
                    <p>{duplicatorCount}</p>
                  </div>
                </div>
              )}
              {shufflerCount > 0 && (
                <div
                  className={`duplicator-frame ${
                    powerUpUsedThisRound ? "disabled" : ""
                  }`}
                  onClick={!powerUpUsedThisRound ? useShuffler : undefined}
                  style={{
                    cursor: powerUpUsedThisRound ? "not-allowed" : "pointer",
                    opacity: powerUpUsedThisRound ? 0.5 : 1,
                  }}
                >
                  🔄️
                  <div className="duplicator-count">
                    <p>{shufflerCount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontFamily: "monospace",
              marginTop: "10px",
            }}
          >
            Your Expression: <strong>{expression}</strong>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => setStep(1)} className="game-buttons">
              ⬅️ Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                numbers.some((_, i) => (usedCounts[i] || 0) < 1) ||
                Object.values(usedCounts).reduce((a, b) => a + b, 0) < 4
              }
              className="game-buttons"
            >
              ✅ Confirm
            </button>
            <button
              onClick={() => setSkipModalOpen(true)}
              className="game-buttons"
            >
              ⏭ Skip Puzzle
            </button>
          </div>

          {resultMessage && (
            <div
              style={{
                marginTop: "20px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {resultMessage}
            </div>
          )}

          <button
            onClick={() => setBackModalOpen(true)}
            style={{ backgroundColor: "#E32636" }}
          >
            Back to Mini Apps
          </button>
        </>
      )}

      <Modal open={isSkipModalOpen} onClose={() => setSkipModalOpen(false)}>
        <div className="modal center">
          <h2>Skip Puzzle</h2>
          <p style={{ textAlign: "center" }}>
            Are you sure you want to skip this puzzle?
          </p>
          <p>Your score will be saved.</p>
          <div className="horizontal-box">
            <button onClick={() => setSkipModalOpen(false)}>Cancel</button>
            <button onClick={skipPuzzle}>Confirm</button>
          </div>
        </div>
      </Modal>

      <Modal open={isBackModalOpen} onClose={() => setBackModalOpen(false)}>
        <div className="modal center">
          <h2>Return to Mini Apps?</h2>
          <p>Are you sure? Your score will not be preserved.</p>
          <div className="horizontal-box">
            <button onClick={() => setBackModalOpen(false)}>Cancel</button>
            <button onClick={confirmBack}>Confirm</button>
          </div>
        </div>
      </Modal>

      <Modal open={isWinModalOpen} onClose={() => setWinModalOpen(false)}>
        <div className="modal center">
          <h2>You Win!</h2>
          <p>You reached 100 points!</p>
          <div className="center">
            <button onClick={() => setWinModalOpen(false)}>Confirm</button>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={() => setNotificationOpen(false)}
      >
        <SnackbarContent
          style={{ backgroundColor: "#E32636", opacity: "90%" }}
          message={<span>🧪 You got a number duplicator!</span>}
        />
      </Snackbar>
      <Snackbar
        open={shuffleNotificationOpen}
        autoHideDuration={3000}
        onClose={() => setShuffleNotificationOpen(false)}
      >
        <SnackbarContent
          style={{ backgroundColor: "#E32636", opacity: "90%" }}
          message={<span>🧪 You got a number shuffler!</span>}
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
            latestAchievement ? (
              <span>
                🎉 You've unlocked a new achievement: {latestAchievement.name}!
              </span>
            ) : null
          }
        />
      </Snackbar>
    </div>
  );
};
