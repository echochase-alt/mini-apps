import { useState } from 'react'
import '../styles/scoreboard.css'
import { EnterDetails } from '../components/EnterDetails';
import { EnterScores } from '../components/EnterScores';
import { Bubbles } from '../components/Bubbles';

export const Scoreboard = () => {
  const [game, setGame] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [players, setPlayers] = useState([]);
  const [roundScores, setRoundScores] = useState({});
  const [rounds, setRounds] = useState([]);

  return (
    <>
      <Bubbles colour="rgba(140, 199, 240, 0.6)"></Bubbles>
      {step === 1 && 
        <EnterDetails {...{game, setGame, name, setName, players, setPlayers, setStep, setRounds}}/>
      }
      {step === 2 &&
        <EnterScores {...{game,
          players,
          setPlayers,
          rounds,
          setRounds,
          roundScores,
          setRoundScores,
          setStep,}} />
      }
    </>
  )
}