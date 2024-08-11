export const TURNS = {
    X: "✖️",
    O: "⭕",
};

export const WINING_COMBINATIONS = [
    [0, 1, 2], // First row
    [3, 4, 5], // Second row
    [6, 7, 8], // Third row
    [0, 3, 6], // First column
    [1, 4, 7], // Second column
    [2, 5, 8], // Third column
    [0, 4, 8], // Diagonal 1
    [2, 4, 6], // Diagonal 2
];