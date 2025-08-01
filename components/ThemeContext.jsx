// ThemeContext.jsx
import { createContext, useContext } from "react";
import { useTheme } from "./useTheme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => useContext(ThemeContext);
