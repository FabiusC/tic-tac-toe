import { WINING_COMBINATIONS, TURNS } from '../constants';

// Verificar si hay un ganador
export const checkWinnerFrom = (boardToCheck) => {
    for (const combination of WINING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (
            boardToCheck[a] &&
            boardToCheck[a] === boardToCheck[b] &&
            boardToCheck[a] === boardToCheck[c]
        ) {
            return boardToCheck[a];
        }
    }
    return null; // No winner
}

// Verificar si el juego ha terminado
export const checkEndGame = (boardToCheck) => {
    return boardToCheck.every((square) => square !== null);
}

// Movimiento de la IA
export const aiMove = (newBoard, player) => {
    // Posibilidad de hacer un movimiento erróneo (5% de probabilidad)
    if (Math.floor(Math.random() * 100) < 5) {
        const availableSquares = newBoard
            .map((value, index) => (value === null ? index : null))
            .filter((index) => index !== null);

        const randomIndex = Math.floor(Math.random() * availableSquares.length);
        return { index: availableSquares[randomIndex] };
    } else {
        return minimax(newBoard, player);
    }
}

// Algoritmo Minimax
export const minimax = (newBoard, player) => {
    const availableSquares = newBoard
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null);

    const winner = checkWinnerFrom(newBoard);
    if (winner === TURNS.O) {
        return { score: 1 };
    } else if (winner === TURNS.X) {
        return { score: -1 };
    } else if (availableSquares.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableSquares.length; i++) {
        const move = {};
        move.index = availableSquares[i];
        newBoard[availableSquares[i]] = player;

        if (player === TURNS.O) {
            const result = minimax(newBoard, TURNS.X);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, TURNS.O);
            move.score = result.score;
        }

        newBoard[availableSquares[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === TURNS.O) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}