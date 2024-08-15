import { useState } from "react";
import Board from "./components/Board";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('');

  const startGame = (mode) => {
    setGameMode(mode);
    setIsGameStarted(true);
  };

  return (
    <section className="start-modal">
      <div className="text">
        {!isGameStarted ? (
          <>
            <h2>Welcome to Tic Tac Toe</h2>
            <p>Are you ready to play?</p>
            <footer>
              <button onClick={() => startGame('2P')}>Two Players</button>
              <button onClick={() => startGame('AI')}>Vs AI</button>
            </footer>
          </>
        ) : (
          <Board gameMode={gameMode} />
        )}
      </div>
    </section>
  );
}

export default App;
