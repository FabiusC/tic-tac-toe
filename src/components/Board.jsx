import confetti from "canvas-confetti";
import { useState } from "react";
import { Square } from "../components/Square";
import { TURNS } from "../constants";
import { checkEndGame, checkWinnerFrom } from "../logic/board";
import { WinnerModal } from "../components/WinnerModal";
import { saveGameToStorage, saveScoreToStorage, resetGameStorage, newGame } from "../logic/storage/LocalStorage";
export function Board() {
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
        console.log(`Points X: ${pointsX} Points O: ${pointsO} saved to storage`);
        // Update the board only if the square is empty
        if (board[index] || winner) return
        const newBoard = [...board]
        newBoard[index] = turn;
        setBoard(newBoard);
        // Change the turn
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);
        // Check if there is a winner
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
        // Save party in local storage
        saveGameToStorage({ board: newBoard, turn: newTurn, pointsX: pointsX, pointsO: pointsO })
    }
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setTurn(turn);
        setWinner(null);
        setPointsX(0);
        setPointsO(0);
        resetGameStorage();
    }
    const startNewGame = () => {
        setBoard(Array(9).fill(null));
        setTurn(turn);
        setWinner(null);
        updateBoard(board);
        newGame();
    }
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