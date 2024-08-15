import confetti from "canvas-confetti";
import { useState } from "react";
import { Square } from "../components/Square";
import { TURNS } from "../constants";
import { checkEndGame, checkWinnerFrom } from "../logic/board";
import { WinnerModal } from "../components/WinnerModal";
import { saveGameToStorage, saveScoreToStorage, resetGameStorage, newGame } from "../logic/storage/LocalStorage";

export function Board({ gameMode }) {
    const [board, setBoard] = useState(() => {
        const savedBoard = window.localStorage.getItem('board');
        return savedBoard ? JSON.parse(savedBoard) : Array(9).fill(null);
    });
    const [turn, setTurn] = useState(() => {
        const savedTurn = window.localStorage.getItem('turn');
        return savedTurn ?? TURNS.X;
    });
    const [pointsX, setPointsX] = useState(() => {
        const savedPointsX = window.localStorage.getItem('pointsX');
        return savedPointsX ? JSON.parse(savedPointsX) : 0;
    });
    const [pointsO, setPointsO] = useState(() => {
        const savedPointsO = window.localStorage.getItem('pointsO');
        return savedPointsO ? JSON.parse(savedPointsO) : 0;
    });
    const [winner, setWinner] = useState(null); //null means no winner and false means a tie

    const updateBoard = (index) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = turn;
        setBoard(newBoard);

        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);

        const newWinner = checkWinnerFrom(newBoard);
        if (newWinner) {
            confetti();
            setWinner(newWinner);
            let totalPointsX = JSON.parse(window.localStorage.getItem('pointsX'));
            let totalPointsO = JSON.parse(window.localStorage.getItem('pointsO'));
            if (newWinner === TURNS.X) {
                totalPointsX += 1;
                setPointsX(totalPointsX);
            } else {
                totalPointsO += 1;
                setPointsO(totalPointsO);
            }
            console.log(`Points X: ${totalPointsX} Points O: ${totalPointsO}`);
        } else if (checkEndGame(newBoard)) {
            setWinner('🫱🏽‍🫲🏾');
        }

        saveGameToStorage({ board: newBoard, turn: newTurn, pointsX: pointsX, pointsO: pointsO });

        // Aquí es donde puedes agregar lógica para el turno de la IA si el modo es 'AI'
        if (gameMode === 'AI' && newTurn === TURNS.O && !newWinner) {
            // Lógica para que la IA haga su movimiento
            const availableSquares = newBoard
                .map((value, index) => (value === null ? index : null))
                .filter((index) => index !== null);

            const randomMove = availableSquares[Math.floor(Math.random() * availableSquares.length)];
            setTimeout(() => updateBoard(randomMove), 500); // Simula el movimiento de la IA con un pequeño retraso
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setTurn(turn);
        setWinner(null);
        setPointsX(0);
        setPointsO(0);
        resetGameStorage();
    };

    const startNewGame = () => {
        setBoard(Array(9).fill(null));
        setTurn(turn);
        setWinner(null);
        updateBoard(board);
        newGame();
    };

    return (
        <main className="board">
            <div className="turn">
                <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
                <h2>{pointsX}</h2>
            </div>
            <section className="board-container">
                <header>
                    <h1>Tic Tac Toe</h1>
                </header>
                <section className="game">
                    {board.map((square, index) => (
                        <Square key={index} index={index} updateBoard={updateBoard}>
                            {square}
                        </Square>
                    ))}
                </section>
                <button onClick={resetGame}>Reset game</button>
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
