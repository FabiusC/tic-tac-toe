import confetti from "canvas-confetti";
import { useState } from "react";
import { Square } from "../components/Square";
import { TURNS } from "../constants";
import { checkEndGame, checkWinnerFrom, aiMove } from "../logic/board";
import { WinnerModal } from "../components/WinnerModal";
import { saveGameToStorage, saveScoreToStorage, resetGameStorage, newGame } from "../logic/storage/LocalStorage";

// eslint-disable-next-line react/prop-types
export function Board({ gameMode, goToHomePage }) {
    // Estado para el tablero de juego, inicializa con el tablero guardado o uno vacío
    const [board, setBoard] = useState(() => {
        const savedBoard = window.localStorage.getItem('board');
        return savedBoard ? JSON.parse(savedBoard) : Array(9).fill(null);
    });

    // Estado para manejar el turno actual, inicializa con el turno guardado o con 'X'
    const [turn, setTurn] = useState(() => {
        const savedTurn = window.localStorage.getItem('turn');
        return savedTurn ?? TURNS.X;
    });

    // Estado para los puntos del jugador X
    const [pointsX, setPointsX] = useState(() => {
        const savedPointsX = window.localStorage.getItem('pointsX');
        return savedPointsX ? JSON.parse(savedPointsX) : 0;
    });

    // Estado para los puntos del jugador O
    const [pointsO, setPointsO] = useState(() => {
        const savedPointsO = window.localStorage.getItem('pointsO');
        return savedPointsO ? JSON.parse(savedPointsO) : 0;
    });

    // Estado para manejar si hay un ganador (null significa que no hay ganador aún)
    const [winner, setWinner] = useState(null); 

    // Estado para determinar si es el turno de la IA
    const [aiTurn, setAiTurn] = useState(() => gameMode === 'AI' && turn === TURNS.O); 

    // Función para actualizar el tablero con el movimiento en la posición 'index'
    const updateBoard = (index) => {
        // Si la casilla ya está ocupada o ya hay un ganador, no hace nada
        if (board[index] || winner) return;
        // Copia el estado actual del tablero y actualiza la posición con el turno actual
        const newBoard = [...board];
        newBoard[index] = turn;

        // Cambia el turno al jugador contrario
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;

        // Actualiza el estado del tablero y el turno
        setBoard(newBoard);
        setTurn(newTurn);

        // Actualiza si es el turno de la IA
        setAiTurn(gameMode === 'AI' && newTurn === TURNS.O);

        // Verifica si hay un ganador con el nuevo tablero
        const newWinner = checkWinnerFrom(newBoard);
        if (newWinner) {
            confetti(); 
            setWinner(newWinner); 
            let totalPointsX = pointsX;
            let totalPointsO = pointsO;
            if (newWinner === TURNS.X) {
                totalPointsX += 1; 
                setPointsX(totalPointsX);
            } else {
                totalPointsO += 1; 
                setPointsO(totalPointsO);
            }
        } else if (checkEndGame(newBoard)) {
            
            setWinner('🫱🏽‍🫲🏾');
        }

        // Guarda el estado del juego en localStorage
        saveGameToStorage({ board: newBoard, turn: newTurn, pointsX: pointsX, pointsO: pointsO });
    };

    // Función para reiniciar el juego, alternando quién empieza
    const resetGame = () => {
        const startingTurn = turn === TURNS.X ? TURNS.O : TURNS.X; 
        setBoard(Array(9).fill(null)); 
        setTurn(startingTurn); 
        setAiTurn(gameMode === 'AI' && startingTurn === TURNS.O); 
        setWinner(null); 
        setPointsX(0);
        setPointsO(0); 
        resetGameStorage(); 
    };

    // Función para iniciar un nuevo juego, manteniendo el turno del jugador que acaba de jugar
    const startNewGame = () => {
        const startingTurn = turn; 
        setBoard(Array(9).fill(null)); 
        setTurn(startingTurn); 
        setAiTurn(gameMode === 'AI' && startingTurn === TURNS.O); 
        setWinner(null);
        newGame();
    };

    // Función para manejar el movimiento de la IA
    const handleAIMove = (currentBoard) => {
        const bestMove = aiMove(currentBoard, TURNS.O);
        setTimeout(() => {
            updateBoard(bestMove.index); 
            setAiTurn(false); 
        }, 100);
    };

    // Realiza el movimiento de la IA si es su turno
    if (aiTurn) {
        handleAIMove(board);
    }

    const goToHomeAndResetGame = () => {
        goToHomePage();
        resetGame();
    }

    return (
        <main className="board">
            <div className="turn">
                <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
                <h2>{pointsX}</h2>
            </div>
            <section className="board-container">
                <header className="title-wrapper">
                    <h1 className="tic">Tic</h1> <h1 className="tac">Tac</h1> <h1 className="toe">Toe</h1>
                </header>
                <section className="game">
                    {board.map((square, index) => (
                        <Square key={index} index={index} updateBoard={updateBoard}>
                            {square}
                        </Square>
                    ))}
                </section>
                <section className="button-container">
                    <button onClick={goToHomeAndResetGame} className="btn-back">Back to Home & Reset Game</button>
                </section>
            </section>
            <div className="turn">
                <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
                <h2>{pointsO}</h2>
            </div>
            <>{saveScoreToStorage({ pointsX: pointsX, pointsO: pointsO })}</>
            <WinnerModal resetGame={startNewGame} winner={winner} />
        </main>
    );
}

export default Board;
