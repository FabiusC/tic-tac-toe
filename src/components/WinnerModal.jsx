import { Square } from "./Square"

// eslint-disable-next-line react/prop-types
export function WinnerModal({ winner, resetGame }) {
    if (winner === null) return null
    const winnerText = winner === '🫱🏽‍🫲🏾' ? "It's a tie" : `The winner is:`
    return (
        <section className="winner" >
            <div className="text">
                <h2> {winnerText} </h2>
                <header className="win">
                    {<Square>{winner}</Square>}
                </header>
                <button onClick={resetGame}>New game</button>
            </div>
        </section >
    )
}