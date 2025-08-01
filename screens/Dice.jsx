import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dice.css";
import { Bubbles } from "../components/Bubbles";

export const Dice = () => {
  const [numDice, setNumDice] = useState(1);
  const [diceFaces, setDiceFaces] = useState(Array(numDice).fill(1));
  const [rolling, setRolling] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [sum, setSum] = useState(0);
  const [rolled, setRolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setDiceFaces(Array(numDice).fill(1));
  }, [numDice]);

  useEffect(() => {
    setSum(diceFaces.reduce(
      (accumulator, current) => accumulator + current,
      0))
  }, [diceFaces]);

  const handleIncrementDice = (delta) => {
    setNumDice((prev) => {
      const newValue = Math.min(Math.max(prev + delta, 1), 7);
      return newValue;
    });
  };

  const rollDice = (index) => {
    setRolled(true);
    if (skipAnimation) {
      setDiceFaces((prev) => {
        const newFaces = [...prev];
        newFaces[index] = Math.floor(Math.random() * 6) + 1;
        return newFaces;
      });
      return;
    }

    setRolling(true);

    let rollCount = 0;
    const rollTime = Math.random() * 1000 + 1000;
    const interval = setInterval(() => {
      setDiceFaces((prev) =>
        prev.map((face, i) =>
          i === index ? Math.floor(Math.random() * 6) + 1 : face
        )
      );
      rollCount += 100;
      if (rollCount >= rollTime) {
        clearInterval(interval);
        setRolling(false);
        setDiceFaces((prev) =>
          prev.map((face, i) =>
            i === index ? Math.floor(Math.random() * 6) + 1 : face
          )
        );
      }
    }, 100);
  };

  const rollAllDice = () => {
    setRolled(true);
    if (skipAnimation) {
      setDiceFaces(
        Array(numDice)
          .fill(0)
          .map(() => Math.floor(Math.random() * 6) + 1)
      );
      return;
    }

    setRolling(true);

    let rollCount = 0;
    const rollTime = Math.random() * 1000 + 1000;
    const interval = setInterval(() => {
      setDiceFaces(
        Array(numDice)
          .fill(0)
          .map(() => Math.floor(Math.random() * 6) + 1)
      );
      rollCount += 100;
      if (rollCount >= rollTime) {
        clearInterval(interval);
        setRolling(false);
        setDiceFaces(
          Array(numDice)
            .fill(0)
            .map(() => Math.floor(Math.random() * 6) + 1)
        );
      }
    }, 100);
  };

  return (
    <div className="center">
      <Bubbles colour="rgb(255, 255, 255)"></Bubbles>
      <h1 className="text-2xl font-bold">Dice</h1>

      <div className="display-toggle">
        <button
          className="circular-button"
          onClick={() => handleIncrementDice(-1)}
        >
          –
        </button>

        <button className="display" disabled>
          {numDice}
        </button>

        <button
          className="circular-button"
          onClick={() => handleIncrementDice(1)}
        >
          +
        </button>
      </div>

      <br />

      <div className="dice-container">
        {diceFaces.map((face, index) => (
          <div key={index} className="dice-wrapper">
            <div className={`dice dice${face}`} />
            <button onClick={() => rollDice(index)} disabled={rolling}>
              Roll
            </button>
          </div>
        ))}
      </div>

      <button onClick={rollAllDice} disabled={rolling}>
        Roll All
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

      {rolling && <h3 className="rolling-message">Rolling...</h3>}
      
      {
        !rolling && rolled &&
        <div className="center">
          <hr className="horizontal-line" />
          <h3>Sum: {sum}</h3>
          <h3>Average roll: {(sum / numDice).toFixed(2)}</h3>
        </div>
      }         

      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
      >
        Back to Mini Apps
      </button>
    </div>
  );
};
