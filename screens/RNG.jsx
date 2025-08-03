import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  useMediaQuery,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Bubbles } from "../components/Bubbles";
import "../styles/RNG.css";

export const RNG = () => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [number, setNumber] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [customise, setCustomise] = useState(false);
  const [open, setOpen] = useState(false);
  const [customArray, setCustomArray] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const primaryColor = "#15719cff";
  const textColor = "#e0e0e0";

  const getRandomNumber = () => {
    setGenerated(true);
    if (customise) {
      const result = customArray[Math.floor(Math.random() * customArray.length)];
      setNumber(result);
    } else {
      const result = Math.floor(Math.random() * (end - start + 1)) + Number(start);
      setNumber(result);
    }
  };

  const addNewItem = (e) => {
    e.preventDefault();
    if (!newNumber.trim()) return;

    const newItems = newNumber
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    if (customArray.length + newItems.length > 100) {
      setError("full");
      return;
    }

    setCustomArray((prev) => [...prev, ...newItems]);
    setNewNumber("");
    setError("");
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

  const deleteItem = (index) => {
    setCustomArray((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box className="center" p={3}>
      <Bubbles colour="rgb(195, 138, 138)" />
      <Typography
        variant={isMobile ? "h4" : "h3"}
        textAlign="center"
        mb={3}
        color={textColor}
      >
        Random Generator
      </Typography>

      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="center"
        spacing={2}
        mb={4}
      >
        <Button
          variant={!customise ? "contained" : "outlined"}
          onClick={closeCustom}
          sx={{
            backgroundColor: !customise ? primaryColor : "transparent",
            color: textColor,
            borderColor: primaryColor,
            ":hover": { backgroundColor: customise ? "#333" : primaryColor },
          }}
        >
          Number Generator
        </Button>
        <Button
          variant={customise ? "contained" : "outlined"}
          onClick={openCustom}
          sx={{
            backgroundColor: customise ? primaryColor : "transparent",
            color: textColor,
            borderColor: primaryColor,
            ":hover": { backgroundColor: !customise ? "#333" : primaryColor },
          }}
        >
          Custom Picker
        </Button>
      </Stack>

      {customise ? (
        open ? (
          <Box textAlign="center">
            <Typography color={textColor} mb={2}>
              Enter items to choose from. Click to delete.
            </Typography>

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              gap={1}
              mb={2}
            >
              {customArray.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => deleteItem(index)}
                  sx={{ backgroundColor: "#333", color: textColor }}
                  deleteIcon={<ClearIcon sx={{ color: "#E32636" }} />}
                />
              ))}
            </Box>

            <Box component="form" onSubmit={addNewItem}>
              <TextField
                placeholder="Add item(s), separated by commas"
                variant="standard"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                fullWidth
                sx={{
                  input: { color: textColor },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#aaa",
                    fontSize: "14px",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "gray",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: primaryColor,
                  },
                  maxWidth: 400,
                  mx: "auto",
                }}
              />
            </Box>

            {error === "full" && (
              <Typography color="#E32636" mt={1}>
                Please enter a maximum of 100 items.
              </Typography>
            )}

            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              justifyContent="center"
              mt={3}
            >
              <Button onClick={() => setCustomArray([])} color="error">
                Clear
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant="contained"
                sx={{ backgroundColor: primaryColor, color: "white" }}
              >
                Done
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant="h6" mb={2} color={textColor}>
              Pick a random item:
            </Typography>
            {customArray.length === 0 ? (
              <Typography color="#E32636">
                No custom items defined.
              </Typography>
            ) : (
              <Typography variant="h3" mt={2} color={textColor}>
                {generated && number}
              </Typography>
            )}
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <Button
                variant="contained"
                onClick={getRandomNumber}
                sx={{ backgroundColor: primaryColor, color: "white" }}
              >
                Generate
              </Button>
              <Button onClick={() => setOpen(true)} sx={{ color: textColor }}>
                Edit Set
              </Button>
            </Stack>
          </Box>
        )
      ) : (
        <Box textAlign="center">
          <Typography variant="h6" mb={2} color={textColor}>
            Generate a number from:
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              type="number"
              variant="outlined"
              size="small"
              value={start}
              onChange={(e) => setStart(Number(e.target.value))}
              sx={{
                width: "100px",
                input: { color: textColor },
                fieldset: { borderColor: "gray" },
              }}
            />
            <Typography color={textColor}>to</Typography>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              value={end}
              onChange={(e) => setEnd(Number(e.target.value))}
              sx={{
                width: "100px",
                input: { color: textColor },
                fieldset: { borderColor: "gray" },
              }}
            />
          </Stack>
          {generated && (
            <Typography variant="h2" mt={3} color={textColor}>
              {number}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={getRandomNumber}
            sx={{ mt: 2, backgroundColor: primaryColor, color: "white" }}
          >
            Generate
          </Button>
        </Box>
      )}

      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636", marginTop: "30px" }}
      >
        Back to Mini Apps
      </button>
    </Box>
  );
};
