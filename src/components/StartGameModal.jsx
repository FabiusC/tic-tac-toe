export function StartGameModal({ startGame }) {
    return (
        <section className="start-modal">
            <div className="text">
                <h2>Welcome to Tic Tac Toe</h2>
                <p>Are you ready to play?</p>
                <footer>
                    <button onClick={startGame}>Start Game</button>
                </footer>
            </div>
        </section>
    );
}