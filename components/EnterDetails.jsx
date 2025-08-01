import { InputText } from "../components/InputText";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Errors } from "./Errors";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";

export const EnterDetails = ({
  game,
  setGame,
  name,
  setName,
  players,
  setPlayers,
  setStep,
  setRounds,
}) => {
  const [edit, setEdit] = useState(false);
  const [gameError, setGameError] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [importing, setImporting] = useState(false);
  const [fullError, setFullError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [imported, setImported] = useState("");
  const [importError, setImportError] = useState(false);

  const navigate = useNavigate();

  const handleEdit = () => {
    if (!edit && players.length === 0) {
      setPlayError(true);
      return;
    }
    setEdit(!edit);
    setFullError(false);
  };

  const submitName = (e) => {
    e.preventDefault();
    setPlayError(false);
    if (name.length > 50) {
      setLengthError(true);
      return;
    }
    for (const player of players) {
      if (player.name === name) {
        setDuplicateError(true);
        return;
      }
    }
    if (players.length >= 10) {
      setFullError(true);
    }
    if (name.trim() !== "" && players.length < 10) {
      setPlayers([...players, { name, wins: 0 }]);
      setName("");
      setFullError(false);
    }
  };

  const handleAddPlayer = (e) => {
    setDuplicateError(false);
    setLengthError(false);
    setName(e.target.value);
  };

  const startScoring = () => {
    if (game === "") {
      setGameError(true);
      return;
    }
    setGameError(false);
    if (game.length > 50) {
      setLengthError(true);
      return;
    }
    setLengthError(false);
    if (players.length === 0) {
      setPlayError(true);
      return;
    }
    setPlayError(false);
    setFullError(false);
    setDuplicateError(false);
    setStep(2);
  };

  const handleNameChange = (index, newName) => {
    setPlayers(
      players.map((player, i) =>
        i === index ? { ...player, name: newName } : player
      )
    );
  };

  const handleDelete = (index) => {
    let newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleImport = (e) => {
    e.preventDefault();
    if (imported.trim() === "") return;
    const lines = imported.split("\\n").map((line) => line.trim());
    if (lines.length < 2) {
      setImportError(true);
      return;
    } 

    setGame(lines[0]);

    const playerNames = lines[1].split(",").map((name) => name.trim());
    for (const p of playerNames) {
      if (p.trim() === "") {
        setImportError(true);
        return;
      }
    }

    if (playerNames.length !== new Set(playerNames).size) {
      setDuplicateError(true);
      return;
    }

    const expectedLength = playerNames.length;

    const newPlayers = playerNames.map((name) => ({ name, wins: 0 }));

    const importedRounds = [];

    for (let i = 2; i < lines.length; i++) {
      const lineArr = lines[i].split(",");
      for (const l in lineArr) {
        if (l.trim() === "") {
          setImportError(true);
          return;
        }
      } 
      const scores = lineArr.map((score) => score.trim());
      if (scores.length !== expectedLength) {
        setImportError(true);
        return;
      }

      const parsedScores = scores.map((score) => parseInt(score, 10));
      if (parsedScores.some(isNaN)) {
        setImportError(true);
        return;
      }

      parsedScores.forEach((score, index) => {
        newPlayers[index].wins += score;
      });

      const roundData = playerNames.reduce((round, name, index) => {
        round[name] = parsedScores[index] || 0;
        return round;
      }, {});
      importedRounds.push(roundData);
    }

    setPlayers(() => newPlayers);
    setRounds(() => importedRounds);
    setStep(2);
  };

  return (
    <>
      <h1>Scoreboard</h1>
      <InputText
        text="Game name"
        field={game}
        setField={(e) => setGame(e.target.value)}
      />
      <br />
      <form onSubmit={submitName}>
        <InputText
          text="Add player (press enter)"
          field={name}
          setField={(e) => handleAddPlayer(e)}
        />
      </form>

      <br />
      {players.length > 0 && <h3>Players:</h3>}
      <div className="center">
        <div className="horizontal-box">
          {edit
            ? players.map((player, index) => (
                <div className="horizontal-box">
                  <div style={{ width: "30px" }}>
                    {String(index + 1) + "."}&nbsp;&nbsp;
                  </div>
                  <InputText
                    text="name"
                    field={player.name}
                    setField={(e) => handleNameChange(index, e.target.value)}
                  ></InputText>
                  <DeleteIcon
                    className="delete"
                    onClick={() => handleDelete(index)}
                  />
                </div>
              ))
            : players.map((player, index) => (
                <div className="player-name" key={index}>
                  {player.name !== ""
                    ? player.name
                    : "Player " + String(index + 1)}
                </div>
              ))}
        </div>
      </div>
      <Errors
        {...{ playError, gameError, duplicateError, fullError, lengthError }}
      />
      <div className="player-name">
        <button
          style={{ width: "150px", backgroundColor: "#318CE7" }}
          onClick={() => setImporting(true)}
        >
          Import
        </button>
        <button style={{ width: "150px" }} onClick={handleEdit}>
          {edit ? "Done" : "Edit Players"}
        </button>
        {!edit && (
          <button
            style={{ width: "150px", backgroundColor: "#008000" }}
            onClick={startScoring}
          >
            Start
          </button>
        )}
      </div>
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
      >
        Back to Mini Apps
      </button>
      <Modal open={importing} onClose={() => setImporting(false)}>
        <div className="modal center">
          <h2>Import an Existing Scoreboard</h2>
          <p>Please enter an existing exported string here:</p>
          <form onSubmit={(e) => handleImport(e)}>
            <InputText
              text="Enter String"
              field={imported}
              setField={(e) => setImported(e.target.value)}
            />
          </form>
          {importError && (
              <b style={{ color: "red" }}>Invalid import format!</b>
          )}
          {duplicateError && (
            <b style={{ color: "red" }}>
              Duplicate names are not allowed.
            </b>
          )}
          <button onClick={(e) => handleImport(e)}>Done</button>
        </div>
      </Modal>
    </>
  );
};
