import { useState } from "react";
import { Brackets } from "../components/Brackets";
import { useNavigate } from "react-router-dom";
import "../styles/matchups.css";
import { EnterPlayers } from "../components/EnterPlayers";
import { Bubbles } from "../components/Bubbles";

export const Matchups = () => {
  const [step, setStep] = useState(1);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [randomise, setRandomise] = useState(false);
  const [presetWinners, setPresetWinners] = useState(null);

  const navigate = useNavigate();
  return (
    <div className="center">
      <Bubbles colour="rgb(234, 221, 148)"></Bubbles>
      {step === 1 && (
        <EnterPlayers
          {...{
            setStep,
            players,
            setPlayers,
            name,
            setName,
            randomise,
            setRandomise,
            setPresetWinners,
          }}
        />
      )}
      {step === 2 && (
        <>
          <Brackets {...{ players, name, randomise, presetWinners }} />
          <div className="buttons">
            <button
              onClick={() => navigate("/")}
              style={{ backgroundColor: "#E32636" }}
            >
              Back to Mini Apps
            </button>
            <button
              onClick={() => {
                setPresetWinners(null);
                setStep(1);
              }}
            >
              Back to Matchups
            </button>
          </div>
        </>
      )}
    </div>
  );
};
