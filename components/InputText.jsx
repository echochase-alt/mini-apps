import { TextField } from "@mui/material";

export const InputText = ({ text, field, setField }) => {
  return (
    <TextField
      placeholder={text}
      variant="standard"
      value={field}
      onChange={setField}
      fullWidth
      sx={{
        input: { color: 'white' },
        "& .MuiInputBase-input::placeholder": {
          color: "lightgray",
          opacity: 1,
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
        padding: "5px"
      }}
    />
  );
};
