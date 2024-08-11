import { WINING_COMBINATIONS } from '../constants'

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

export const checkEndGame = (boardToCheck) => {
    return boardToCheck.every((square) => square !== null);
}
