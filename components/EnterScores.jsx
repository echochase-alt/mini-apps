import { useState } from "react";
import Modal from '@mui/material/Modal';

export const EnterScores = ({
  game,
  players,
  setPlayers,
  rounds,
  setRounds,
  roundScores,
  setRoundScores,
  setStep,
}) => {
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [exported, setExported] = useState(false);

  const handleEditChange = (roundIndex, playerName, playerIndex, newScore) => {
    setPlayers(
      players.map((player, i) =>
        playerIndex === i
          ? {
              ...player,
              wins:
                player.wins +
                  Number(newScore) -
                  rounds[roundIndex][playerName] || 0,
            }
          : player
      )
    );
    setRounds((prevRounds) =>
      prevRounds.map((r, i) =>
        i === roundIndex ? { ...r, [playerName]: newScore } : r
      )
    );
  };

  const handleBack = () => {
    setPlayers(players.map((player) => ({ ...player, wins: 0 })));
    setRounds([]);
    setRoundScores({});
    setStep(1);
  };

  const handleEdit = () => {
    setEdit(!edit);
    addRound();
  };

  const addRound = () => {
    if (Object.keys(roundScores).length === 0) return;
    for (const player of players) {
      if (typeof roundScores[player.name] === "undefined") {
        setError(true);
        setRoundScores({});
        return;
       }
    }
    setEdit(false);
    setRounds([...rounds, roundScores]);
    setPlayers(
      players.map((player) => ({
        ...player,
        wins: player.wins + Number(roundScores[player.name]) || 0,
      }))
    );
    setRoundScores({});
  };

  const handleExport = () => {
    let exportString = game + "\\n" + players.map(p => p.name).join(",");
  
    rounds.forEach((round) => {
      let row = [];
      exportString += "\\n";
      for (const player of players) {
        row.push(round[player.name] ?? 0);
      }
      exportString += row.join(",");
    });
    navigator.clipboard.writeText(exportString);
    setExported(true);
  };

  return (
    <div className="center">
      <h1>Scoreboard for {game}:</h1>
      <table>
        <thead>
          <tr>
            <th>Player:</th>
            {players.map((p) => (
              <th key={p.name}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rounds.map((r, index) => (
            <tr key={index}>
              <th>Round {index + 1}:</th>
              {players.map((p, i) =>
                edit ? (
                  <td key={i}>
                    <input
                      type="number"
                      value={r[p.name] || ""}
                      onChange={(e) =>
                        handleEditChange(index, p.name, i, e.target.value)
                      }
                    />
                  </td>
                ) : (
                  <td key={i}>{r[p.name]}</td>
                )
              )}
            </tr>
          ))}
          <tr>
            {edit && <th>Current Round:</th>}
            {players.map(
              (p, index) =>
                edit && (
                  <td key={index}>
                    <input
                      key={index}
                      type="number"
                      value={roundScores[p.name] || ""}
                      onChange={(e) =>
                        setRoundScores({
                          ...roundScores,
                          [p.name]: e.target.value,
                        })
                      }
                    />
                  </td>
                )
            )}
          </tr>
          <tr>
            <th>Final score:</th>
            {players.map((p, index) => (
              <td key={index}>{p.wins}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <br />
      <div className="horizontal-box">
        {!edit && <button style={{ backgroundColor: "#018749" }} onClick={handleExport}>Export</button>}
        <button onClick={handleEdit}>{edit ? "Done" : "Edit"}</button>
        {!edit && (
          <button style={{ backgroundColor: "#E32636" }} onClick={() => setOpen(true)}>
            Back
          </button>
        )}
      </div>
      <br />
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="modal center">
          <h2>Are you sure you want to go back?</h2>
          <p>All progress will be lost.</p>
          <div className="horizontal-box">
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button onClick={handleBack}>Confirm</button>
          </div>
        </div>
      </Modal>
      <Modal open={error} onClose={() => setError(false)}>
        <div className="modal center">
          <h2>Please enter all the scores!</h2>
          <p>If a player didn't score any points, please enter zero.</p>
          <div className="horizontal-box">
            <button onClick={() => setError(false)}>Done</button>
          </div>
        </div>
      </Modal>
      <Modal open={exported} onClose={() => setExported(false)}>
        <div className="modal center">
          <h2>Export Successful</h2>
          <p>Scoreboard information copied to clipboard!</p>
          <div className="horizontal-box">
            <button onClick={() => setExported(false)}>Done</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
