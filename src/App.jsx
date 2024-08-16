import { useState } from "react";
import Board from "./components/Board";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('');

  const startGame = (mode) => {
    setGameMode(mode);
    setIsGameStarted(true);
  };

  const goToHomePage = () => {
    setIsGameStarted(false);
    setGameMode('');
  };

  return (
    <section className="start-modal">
      {!isGameStarted &&
        <section className="start-modal">
          <h1>Welcome to</h1>
          <div className="title-wrapper">
            <h1 className="tic">Tic</h1> <h1 className="tac">Tac</h1> <h1 className="toe">Toe</h1>
          </div>
          <p>Are you ready to play?</p>
          <div className="button-container">
            <button onClick={() => startGame('2P')}>Two Players</button>
            <button onClick={() => startGame('AI')}>Vs AI</button>
          </div>
        </section>
      }
      {isGameStarted && <Board gameMode={gameMode} goToHomePage={goToHomePage} />}
    </section>
  );
}

export default App;
