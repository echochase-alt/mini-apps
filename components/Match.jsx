import { Modal } from "@mui/material";
import { useState, useEffect } from "react";

export const Match = ({ p1, p2, setWinners, index, finalRound }) => {
  const [winner, setWinner] = useState(p2 === "-" ? p1 : "");
  const [end, setEnd] = useState(false);
  const [champion, setChampion] = useState("");

  useEffect(() => {
    setWinner(p2 === "-" ? p1 : ""); // Auto-assign if only one player exists
    setEnd(false); // Close modal on reshuffle
  }, [p1, p2]);

  useEffect(() => {
    if (p2 === "-") {
      setWinners((prevWinners) => {
        const updatedWinners = [...prevWinners];
        updatedWinners[index] = p1;
        return updatedWinners;
      });
    }
  }, [p1, p2, index, setWinners]);

  const handleWinner = (player) => {
    if (!player || player === "-") return;
    setWinner(player);
    setWinners((prevWinners) => {
      const updatedWinners = [...prevWinners];
      updatedWinners[index] = player;
      return updatedWinners;
    });
    if (finalRound) {
      setEnd(true);
      setChampion(player);
    }
  };

  return (
    <div className="horizontal-box">
      <div className="center">
        <div className={`player ${finalRound && "final"}`} onClick={() => handleWinner(p1)}>{p1}</div>
        <div className={`player ${p2 === "-" ? "disabled" : ""} ${finalRound && "final"}`} onClick={() => handleWinner(p2)}>
          {p2}
        </div>
      </div>
      <div className="bracket-connector" />
      <div className="center">
        <div style={{ position: "relative", top: "-10px" }}>{finalRound ? "Champion" : "Winner"}:</div>
        <div className={`winner ${finalRound && "final"}`} style={{ position: "relative", top: "-12px" }}>{winner}</div>
      </div>
      <Modal open={end} onClose={() => setEnd(false)}>
        <div className="modal center">
          <h2>We have a champion!</h2>
          <p>The champion is {champion}. Well played everyone!</p>
          <div className="horizontal-box">
            <button onClick={() => setEnd(false)}>Done</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
