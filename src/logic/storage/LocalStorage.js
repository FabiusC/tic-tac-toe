export const saveGameToStorage = ({board, turn, pointsX, pointsO}) => {
    window.localStorage.setItem('board', JSON.stringify(board));
    window.localStorage.setItem('turn', turn);
    window.localStorage.setItem('pointsX', pointsX);
    window.localStorage.setItem('pointsO', pointsO);
}

export const resetGameStorage = () => {
    window.localStorage.removeItem('board');
    window.localStorage.removeItem('turn');
    window.localStorage.removeItem('pointsX');
    window.localStorage.removeItem('pointsO');
}

export const newGame = () => {
    window.localStorage.removeItem('board');
    window.localStorage.removeItem('turn');
}