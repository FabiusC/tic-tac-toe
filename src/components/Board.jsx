/* eslint-disable no-unused-vars */
import confetti from "canvas-confetti";
import { useState } from "react";
import { Square } from "../components/Square";
import { TURNS } from "../constants";
import { checkEndGame, checkWinnerFrom } from "../logic/board";
import { WinnerModal } from "../components/WinnerModal";
import { saveGameToStorage, resetGameStorage } from "../logic/storage/LocalStorage";
export function Board() {
    const [board, setBoard] = useState(() => {
        const savedBoard = window.localStorage.getItem('board');
        return savedBoard ? JSON.parse(savedBoard) : Array(9).fill(null);
    });
    const [turn, setTurn] = useState(() => {
        const savedTurn = window.localStorage.getItem('turn');
        return savedTurn ?? TURNS.X;
    });
    const [winner, setWinner] = useState(null); //null means no winner and false means a tie

    const updateBoard = (index) => {
        // Update the board only if the square is empty
        if (board[index] || winner) return
        const newBoard = [...board]
        newBoard[index] = turn;
        setBoard(newBoard);
        // Change the turn
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);
        // Save party in local storage
        saveGameToStorage({board: newBoard, turn: newTurn})
        // Check if there is a winner
        const newWinner = checkWinnerFrom(newBoard);
        if (newWinner) {
            confetti();
            setWinner(newWinner);
        } else if (checkEndGame(newBoard)) {
            setWinner(false);
        }
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);
        setWinner(null);
        resetGameStorage();
    }
    return (
        <main className="board">
            <h1>Tic Tac Toe</h1>
            <button onClick={resetGame}>Reset game</button>
            <section className="game">
                {board.map((square, index) => {
                    return (
                        <Square key={index} index={index} updateBoard={updateBoard}>
                            {square}
                        </Square>
                    );
                })}
            </section>

            <section className="turn">
                <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
                <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
            </section>
            <WinnerModal resetGame={resetGame} winner={winner} />
        </main>
    );
}
export default Board;