import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";
import { TextField, Checkbox, FormControlLabel, FormGroup, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from "@mui/material";
import { useState } from "react";

export const CardGenerator = () => {
  const navigate = useNavigate();
  const [numCards, setNumCards] = useState(0);
  const [randomCards, setRandomCards] = useState([]);
  const [withoutReplacement, setWithoutReplacement] = useState(false);
  const [excludeJokers, setExcludeJokers] = useState(false);
  const [numbersOnly, setNumbersOnly] = useState(false);
  const [letterOnly, setLetterOnly] = useState(false);
  const [selectedSuits, setSelectedSuits] = useState([]);

  const handleCardsChange = (num) => {
    if (num < 0) {
      setNumCards(0);
    } else if (num > 10) {
      setNumCards(10);
    } else {
      setNumCards(num);
    }
  };
  const generateCards = () => {
    if (numCards === 0) return;

    const cardImages = import.meta.glob(
      "../assets/svg_playing_cards/fronts/*.svg",
      { eager: true, import: "default" }
    );
    let cardEntries = Object.entries(cardImages); // [ [path, url], ... ]

    if (excludeJokers) {
      cardEntries = cardEntries.filter(
        ([path]) => !path.toLowerCase().includes("joker")
      );
    }
    if (numbersOnly) {
      cardEntries = cardEntries.filter(([path]) => {
        const match = path.match(/_(\d+)\.svg$/);
        return match && Number(match[1]) >= 2 && Number(match[1]) <= 10;
      });
    }
    if (letterOnly) {
      cardEntries = cardEntries.filter(([path]) =>
        /_(ace|jack|queen|king)\.svg$/i.test(path)
      );
    }
    if (selectedSuits.length > 0) {
      cardEntries = cardEntries.filter(([path]) =>
        selectedSuits.some((suit) => path.includes(suit))
      );
    }
    let availableCards = [...cardEntries];
    const selectedCards = [];
    for (let i = 0; i < numCards; i++) {
      if (availableCards.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      selectedCards.push(availableCards[randomIndex][1]);
      if (withoutReplacement) availableCards.splice(randomIndex, 1);
    }
    setRandomCards(selectedCards);
  };

  return (
    <div
      className="center"
      style={{ gap: "20px", maxWidth: "90vw", color: "white" }}
    >
      <Bubbles colour="white" />
      <h1>Random Card Generator</h1>
      <div
        className="horizontal-box"
        style={{ alignItems: "center", gap: "10px" }}
      >
        <h3 style={{ fontSize: "20px" }}>Generate</h3>
        <TextField
          className="num-para"
          placeholder="--"
          type="number"
          value={numCards}
          onChange={(e) => handleCardsChange(Number(e.target.value))}
          variant="standard"
          sx={{
            "& .MuiInput-underline:before": { borderBottomColor: "white" },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "white",
            },
            "& .MuiInput-underline:after": { borderBottomColor: "white" },
            "& .MuiInputBase-input": {
              color: "white",
              textAlign: "center",
              "&::placeholder": {
                color: "white",
                opacity: 0.5,
                textAlign: "center",
              },
            },
          }}
        />
        <h3 style={{ fontSize: "20px" }}>{numCards === 1 ? "card" : "cards"}.</h3>
      </div>

      <FormGroup row sx={{ gap: "10px" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={withoutReplacement}
              onChange={(e) => setWithoutReplacement(e.target.checked)}
              sx={{ color: "white" }}
            />
          }
          label="Without Replacement"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={excludeJokers}
              onChange={(e) => setExcludeJokers(e.target.checked)}
              sx={{ color: "white" }}
            />
          }
          label="Exclude Jokers"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={numbersOnly}
              onChange={(e) => {
                setNumbersOnly(e.target.checked);
                if (e.target.checked) setLetterOnly(false);
              }}
              sx={{ color: "white" }}
            />
          }
          label="Numbers Only"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={letterOnly}
              onChange={(e) => {
                setLetterOnly(e.target.checked);
                if (e.target.checked) setNumbersOnly(false);
              }}
              sx={{ color: "white" }}
            />
          }
          label="Letter Cards Only"
        />
      </FormGroup>

      <FormControl sx={{ m: 1, width: "350px", maxWidth: "95vw" }}>
        <InputLabel sx={{ color: "white", fontSize: "14px" }}>
          Select Suits
        </InputLabel>
        <Select
          multiple
          value={selectedSuits}
          onChange={(e) => setSelectedSuits(e.target.value)}
          input={<OutlinedInput label="Select Suits" />}
          renderValue={(selected) => (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value.charAt(0).toUpperCase() + value.slice(1)}
                  style={{
                    backgroundColor:
                      value === "hearts" || value === "diamonds"
                        ? "#D32F2F"
                        : "#212121",
                    color: "white",
                    fontSize: "12px",
                    height: "24px",
                    outline: "2px solid white",
                  }}
                />
              ))}
            </div>
          )}
          sx={{
            color: "white",
            fontSize: "14px",
            "& .MuiSvgIcon-root": { color: "white" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" }, // gray on hover
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // white on focus
            "& .MuiInputLabel-root": { color: "white" }, // default label color
            "&:hover .MuiInputLabel-root": { color: "#ccc" }, // label gray on hover
            "&.Mui-focused .MuiInputLabel-root": { color: "white" }, // label white on focus
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "#333",
                color: "white",
                fontSize: "14px",
              },
            },
          }}
        >
          {["spades", "hearts", "clubs", "diamonds" ].map((suit) => (
            <MenuItem
              key={suit}
              value={suit}
              sx={{
                backgroundColor: "#212121",
                color: "white",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "#525252",
                },
              }}
            >
              {suit.charAt(0).toUpperCase() + suit.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="horizontal-box">
        <button style={{ width: "125px" }} onClick={() => setRandomCards([])}>Clear Cards</button>
        <button style={{ width: "125px" }} onClick={generateCards}>Generate!</button>
      </div>

      {randomCards.length > 0 && (
        <div
          className="horizontal-box"
          style={{
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {randomCards.map((card, index) => (
            <img
              src={card}
              key={index}
              alt="Random Card"
              style={{ width: "150px" }}
            />
          ))}
        </div>
      )}
      <p>Card images sourced from <a href="https://tekeye.uk/playing_cards/svg-playing-cards">Tekeye</a> with permission.</p>
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
      >
        Back to Mini Apps
      </button>
    </div>
  );
};
