import { useState } from "react";
import "../styles/RNG.css";
import { useNavigate } from "react-router-dom";
import { TextField, useMediaQuery } from "@mui/material";
import { Bubbles } from "../components/Bubbles";

export const RNG = () => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [number, setNumber] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [customise, setCustomise] = useState(false);
  const [open, setOpen] = useState(false);
  const [customArray, setCustomArray] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  const getRandomNumber = () => {
    if (customise) {
      setGenerated(true);
      setNumber(customArray[Math.floor(Math.random() * customArray.length)]);
      return;
    }
    setGenerated(true);
    setNumber(Math.floor(Math.random() * (end - start + 1) + Number(start)));
  };

  const addNewItem = (e) => {
    e.preventDefault();
    if (!newNumber.trim()) return;
    if (customArray.length + newNumber.split(",").length > 100) {
      setError("full");
      return;
    }
    const newItems = newNumber
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setCustomArray((prev) => [...prev, ...newItems]);
    setNewNumber("");
  };

  const openCustom = () => {
    setGenerated(false);
    if (customArray.length === 0) setOpen(true);
    setCustomise(true);
  };

  const closeCustom = () => {
    setCustomise(false);
    setGenerated(false);
  };

  const handleEdit = (newNum) => {
    setError("");
    setNewNumber(newNum);
  }
  
  const deleteItem = (index) => {
    setCustomArray((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="center">
      <Bubbles colour="rgb(195, 138, 138)"></Bubbles>
      <h1 style={{ fontSize: isMobile ? "38px" : "48px" }}>Random Number Generator</h1>

      <div className={isMobile ? "center" : "horizontal-box"}>
        <button
          onClick={closeCustom}
          className={!customise ? "normal" : "grey"}
        >
          Random Number Generator
        </button>
        <button onClick={openCustom} className={customise ? "normal" : "grey"}>
          Custom Item Picker
        </button>
      </div>

      {customise ? (
        open ? (
          <div className="center">
            <p>
              Define a group to pick an item from.<br />
              Click an item to remove it.
            </p>
            <div className="number-box">
              {customArray.map((num, index) => (
                <p className="number-frame" key={index} onClick={() => deleteItem(index)}>
                  <span className="number-text">{num}</span>
                  <span className="delete-cross">x</span>
                </p>
              ))}
            </div>
            <form onSubmit={addNewItem}>
              <TextField
                placeholder="Add item or comma-separated list (press enter)"
                variant="standard"
                value={newNumber}
                onChange={(e) => handleEdit(e.target.value)}
                fullWidth
                sx={{
                  input: { color: "white" },
                  "& .MuiInputBase-input::placeholder": {
                    color: "lightgray",
                    opacity: 1,
                    fontSize: "12.5px",
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
                  width: "300px",
                  padding: "5px",
                }}
              />
            </form>
            <br />
            {error === "full" && <p style={{ color: "#E32636" }}>Please enter a maximum of 100 items!</p>}
            <div className={isMobile ? "center" : "horizontal-box"}>
              <button onClick={() => setCustomArray([])}>Clear Group</button>
              <button onClick={() => setOpen(false)}>Done</button>
            </div>
          </div>
        ) : (
          <div className="center">
            <div className="horizontal-box">
              <h2>Pick a random item from your group:</h2>
            </div>
            <div className="number-box">
              {customArray.length === 0 ? (
                <p style={{ color: "#E32636" }}>
                  You have not yet defined a custom set!
                </p>
              ) : (
                customArray.map((num, index) => (
                  <div style={ {fontSize: "1.5rem"} } key={index}>
                    {num}
                  </div>
                ))
              )}
            </div>
            {generated && <h1>{number}</h1>}
            <div className="horizontal-box">
              <button onClick={getRandomNumber}>Generate!</button>
              <button onClick={() => setOpen(true)}>Edit set</button>
            </div>
          </div>
        )
      ) : (
        <div className="center">
          <div className="horizontal-box">
            <h2>Generate a random number from</h2>
            <input
              className="rng-input"
              type="number"
              value={start}
              onChange={(e) => setStart(Number(e.target.value))}
            />
            <h2>to</h2>
            <input
              className="rng-input"
              type="number"
              value={end}
              onChange={(e) => setEnd(Number(e.target.value))}
            />
          </div>
          {generated && <h1>{number}</h1>}
          <button onClick={getRandomNumber}>Generate!</button>
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
      >
        Back to Mini Apps
      </button>
    </div>
  );
};
