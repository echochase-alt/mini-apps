import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "./InputText";

export const EnterPlayers = ({
  setStep,
  setPlayers,
  name,
  setName,
  randomise,
  setRandomise,
  setPresetWinners,
}) => {
  const [playerArray, setPlayerArray] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState("");
  const [importError, setImportError] = useState(false);

  const navigate = useNavigate();

  const addNewItem = (e) => {
    e.preventDefault();
    if (!newPlayer.trim()) return;
  
    const newItems = newPlayer
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  
    if (newItems.some((item) => item.length > 11)) {
      setError("long");
      return;
    }
  
    if (playerArray.length + newItems.length > 100) {
      return;
    }
  
    setPlayerArray((prev) => [...prev, ...newItems]);
    setNewPlayer("");
  };  

  const deleteItem = (index) => {
    setPlayerArray((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (newPlayer) => {
    setError("");
    setNewPlayer(newPlayer);
  };

  const handleImport = (e) => {
    e.preventDefault();
    try {
      const decoded = atob(imported);
      const tournamentData = JSON.parse(decoded); 
      if (!Array.isArray(tournamentData.players)) {
        throw new Error("Invalid tournament data");
      }
      setName(tournamentData.name);
      setPlayers(tournamentData.players);
      setImporting(false);
      setImportError(false);
      setPresetWinners(tournamentData.winners);
      setStep(2);
    } catch (error) {
      setImportError(true);
    }
  };
  

  const handleNextStep = () => {
    const playerCount = playerArray.length;

    if (playerCount > 32) {
      setError("full");
      return;
    } else if (playerCount < 4) {
      setError("empty");
      return;
    }

    setStep(2);
    setPlayers(playerArray);
  };

  return (
    <>
      <h1>Matchups</h1>
      <h2>Enter 4-32 players and pit them against each other!</h2>
      <h3>Matchups will place them into brackets within organised rounds.</h3>
      <h3>Click on registered players to remove them from play.</h3>
      <div className="horizontal-box">
        {playerArray.length ? (
          playerArray.map((num, index) => (
            <p
              className="contestant-frame"
              key={index}
              onClick={() => deleteItem(index)}
            >
              {num}
            </p>
          ))
        ) : (
          <div className="contestant-frame">
            [Your players will show up here.]
          </div>
        )}
      </div>
      <TextField
        placeholder="Tournament Name"
        variant="standard"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{
          input: { color: "white" },
          "& .MuiInputBase-input::placeholder": {
            color: "lightgray",
            opacity: 1,
            fontSize: "17px",
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: "lightgray",
          },
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: "white",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "gray",
          },
          width: "370px",
          padding: "5px",
        }}
      />
      <form onSubmit={addNewItem}>
        <TextField
          placeholder="Add item or comma-separated list (press enter)"
          variant="standard"
          value={newPlayer}
          onChange={(e) => handleEdit(e.target.value)}
          fullWidth
          sx={{
            input: { color: "white" },
            "& .MuiInputBase-input::placeholder": {
              color: "lightgray",
              opacity: 1,
              fontSize: "17px",
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "lightgray",
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "white",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "gray",
            },
            width: "370px",
            padding: "5px",
          }}
        />
      </form>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={randomise}
              onChange={(e) => setRandomise(e.target.checked)}
              sx={{
                color: "white",
                "&.Mui-checked": { color: "rgb(224, 230, 177)" },
              }}
            />
          }
          label="Randomise contestant matchups"
        />
      </FormGroup>
      <br />
      {error === "full" && (
        <div style={{ color: "#E32636" }}>Can't have more than 32 players!</div>
      )}
      {error === "empty" && (
        <div style={{ color: "#E32636" }}>Can't have less than 4 players!</div>
      )}
      {error === "long" && (
          <b style={{ color: "red" }}>Username must be 11 characters at most!</b>
      )}

      <div className="buttons">
        <button
          onClick={() => navigate("/")}
          style={{ backgroundColor: "#E32636" }}
        >
          Back to Mini Apps
        </button>
        <button onClick={handleNextStep}>Start Tournament</button>

        <button onClick={() => setImporting(true)} style={{ backgroundColor: "#318CE7" }}>
          Import Tournament
        </button>
      </div>

      <Modal open={importing} onClose={() => setImporting(false)}>
        <div className="modal center">
          <h2>Import an Existing Tournament</h2>
          <p>Please enter an existing tournament string here:</p>
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
          <button onClick={(e) => handleImport(e)}>Done</button>
        </div>
      </Modal>
    </>
  );
};
