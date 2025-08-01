import { useEffect, useState } from "react";
import { Match } from "./Match";

export const Round = ({ players, setRoundWinners, index, finalRound }) => {
  const matches = players.reduce((acc, _, i, arr) => {
    if (i % 2 === 0) acc.push([arr[i], arr[i + 1] || (index === 0 ? "-" : "")]); 
    return acc;
  }, []);

  // Initialize winners: First round keeps auto-wins, others are empty
  const initialWinners = index === 0 
    ? matches.map(([p1, p2]) => (p2 === "-" ? p1 : "")) 
    : Array(matches.length).fill("");

  const [winners, setWinners] = useState(initialWinners);

  // Reset winners when players change (i.e., shuffle happens)
  useEffect(() => {
    setWinners(initialWinners);
  }, [players]); // Resets winners only when players update

  useEffect(() => {
    setRoundWinners((prev) => {
      if (JSON.stringify(prev[index]) === JSON.stringify(winners)) {
        return prev; // Prevent unnecessary updates
      }
      const updated = [...prev];
      updated[index] = [...winners]; 
      return updated;
    });
  }, [winners, index, setRoundWinners]);
  

  return (
    <div className={`round ${finalRound && "final"}`}>
      <h2 style={{ position: "relative", top: "-10px" }}>Round {index + 1}</h2>
      {matches.map((m, matchIndex) => (
        <Match
          key={matchIndex}
          p1={m[0]}
          p2={m[1]}
          {...{ setWinners, finalRound }}
          index={matchIndex}
        />
      ))}
    </div>
  );
};
