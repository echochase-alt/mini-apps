import { HomePage } from "../screens/HomePage";
import { Scoreboard } from "../screens/Scoreboard";
import { SpinnerWheel } from "../screens/SpinnerWheel";
import { Base64 } from "../screens/Base64";
import { Timer } from "../screens/Timer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RNG } from "../screens/RNG";
import { DateCalculator } from "../screens/DateCalculator";
import { TextConverter } from "../screens/TextConverter";
import { Matchups } from "../screens/Matchups";
import { Dice } from "../screens/Dice";
import { LoremIpsumGenerator } from "../screens/LoremIpsum";
import { Analytics } from "@vercel/analytics/react"
import { CoinFlipper } from "../screens/CoinFlipper";
import { Operations } from "../screens/Operations";
import { PasswordChecker } from "../screens/PasswordChecker";
import { Memory } from "../screens/Memory";
import { TicTacToe } from "../screens/TicTacToe";
import { SpeechToText } from "../screens/SpeechToText";
import { Feedback } from "../screens/Feedback";
import { Achievements } from "../screens/Achievements";
import { CardGenerator } from "../screens/CardGenerator";
import { SocialPromo } from "../screens/SocialPromo";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/spinner-wheel" element={<SpinnerWheel />} />
        <Route path="/base64" element={<Base64 />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/rng" element={<RNG />} />
        <Route path="/matchups" element={<Matchups />} />
        <Route path="/date-calculator" element={<DateCalculator />} />
        <Route path="/text-converter" element={<TextConverter />} />
        <Route path="/dice" element={<Dice />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/coin-flipper" element={<CoinFlipper />} />
        <Route path="/lorem-ipsum" element={<LoremIpsumGenerator />} />
        <Route path="/password-checker" element={<PasswordChecker />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/speech-to-text" element={<SpeechToText />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/card-generator" element={<CardGenerator />} />
        <Route path="/socials" element={<SocialPromo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
