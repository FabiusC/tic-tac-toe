import { useState } from "react";
import { Board } from "./components/Board";
import { StartGameModal } from "./components/StartGameModal";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const startGame = () => {
    setIsGameStarted(true);
  };
  return (
    <div className="start-modal">
      {!isGameStarted && <StartGameModal startGame={startGame} />}
      {isGameStarted && <Board />}
    </div>
  );
}

export default App;
