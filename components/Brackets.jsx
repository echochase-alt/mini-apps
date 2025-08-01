import { useEffect, useState } from "react";
import { Round } from "../components/Round";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Modal, Snackbar, SnackbarContent, useMediaQuery } from "@mui/material";

export const Brackets = ({ players, name, randomise, presetWinners }) => {
  function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  function nextPowerOf2(n) {
    if (n < 1) return 1;
    let power = 1;
    let exponent = 1;
    while (power < n) {
      power *= 2;
      exponent++;
    }
    return exponent;
  }

  const [openMenu, setOpenMenu] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [shuffledNotification, setShuffledNotification] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [shuffledPlayers, setShuffledPlayers] = useState(() => {
    const copy = [...players];
    if (randomise) shuffle(copy);
    return copy;
  });

  const numRounds = nextPowerOf2(shuffledPlayers.length);
  const [roundWinners, setRoundWinners] = useState(Array(numRounds).fill([]));

  useEffect(() => {
    if (presetWinners) {
      setRoundWinners(presetWinners);
    }
  }, [presetWinners]);
  
  let actualRounds = numRounds;
  for (let i = 0; i < numRounds; i++) {
    if (roundWinners[i] && roundWinners[i].length <= 2) {
      actualRounds = i + 1;
      break;
    }
  }

  const handleShuffle = () => {
    const existingPlayers = shuffledPlayers.filter((p) => p);

    shuffle(existingPlayers);

    const newPlayers = [
      ...existingPlayers,
      ...Array(shuffledPlayers.length - existingPlayers.length).fill(null),
    ];

    setShuffledPlayers(newPlayers);

    setOpenWarning(false);

    setShuffledNotification(true);
  };

  const handleExport = () => {
    const tournamentData = {
      name,
      players: shuffledPlayers,
      winners: roundWinners,
    };
    const encoded = btoa(JSON.stringify(tournamentData));
    navigator.clipboard.writeText(encoded);
    setOpenExport(true);
  };

  return (
    <div className="center">
      {isMobile && <div style={{ margin: "10px" }}></div>}
      <h1 style={{ fontSize: isMobile ? "32px" : "3.2em" }}>
        Matchup Brackets for <u>{name ? name : "Tournament"}</u>
      </h1>
      <div className="bracket-box">
        {Array.from({ length: actualRounds }, (_, roundIndex) => {
          const roundPlayers =
            roundIndex === 0
              ? shuffledPlayers
              : roundWinners[roundIndex - 1] || [];

          return (
            <Round
              key={roundIndex}
              players={roundPlayers}
              roundWinners={roundWinners}
              setRoundWinners={setRoundWinners}
              finalRound={false}
              index={roundIndex}
            />
          );
        })}
        <Round
          key={actualRounds}
          players={[
            roundWinners[actualRounds - 1]?.[0],
            roundWinners[actualRounds - 1]?.[1],
          ]}
          {...{ roundWinners, setRoundWinners }}
          finalRound={true}
          index={actualRounds}
        />
      </div>

      {/* Sliding Menu */}
      <div className={`contestants ${openMenu ? "open" : ""}`}>
        <button className="close-button" onClick={() => setOpenMenu(false)}>
          <CloseIcon />
        </button>
        <div className="contestant-info">
          <h2>Contestants</h2>
          {shuffledPlayers.map((p, index) => (
            <div key={index} className="contestant">
              {String(index + 1) + ". " + String(p)}
            </div>
          ))}
        </div>
        <div className="center">
          <button onClick={() => setOpenWarning(true)}>
            Shuffle Contestants
          </button>
          <button onClick={handleExport}>Export Tournament</button>
        </div>
        <br />
        <br />
        <br />
      </div>
      <Modal open={openWarning} onClose={() => setOpenWarning(false)}>
        <div className="modal centered">
          <h2>Are you sure you want to shuffle contestants?</h2>
          <p>This will restart the tournament.</p>
          <div className="horizontal-box">
            <button onClick={() => setOpenWarning(false)}>Cancel</button>
            <button onClick={handleShuffle}>Shuffle</button>
          </div>
        </div>
      </Modal>
      <Modal open={openExport} onClose={() => setOpenExport(false)}>
        <div className="modal centered">
          <h2>Exported successfully!</h2>
          <p>Tournament data copied to clipboard!</p>
          <div className="horizontal-box">
            <button onClick={() => setOpenExport(false)}>Done</button>
          </div>
        </div>
      </Modal>
      <div className="menu-icon" onClick={() => setOpenMenu(!openMenu)}>
        <MenuIcon />
      </div>
      <Snackbar
        open={shuffledNotification}
        autoHideDuration={3000}
        onClose={() => setShuffledNotification(false)}
      >
        <SnackbarContent
          style={{
            backgroundColor: "#E32636",
            opacity: "90%",
          }}
          message={<span>Successfully shuffled contestants!</span>}
        />
      </Snackbar>
    </div>
  );
};
