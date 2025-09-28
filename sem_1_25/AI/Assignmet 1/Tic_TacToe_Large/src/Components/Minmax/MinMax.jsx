// src/Components/Minmax/Minimax.jsx

const evaluateBoard = (board) => {
    // Check rows, columns, and diagonals for a win
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === 'x' ? 10 : -10;
    }
}

    return 0;
};

const isMovesLeft = (board) => {
    return board.includes("");
};

const minimax = (board, depth, isMaximizing) => {
    const score = evaluateBoard(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!isMovesLeft(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = 'x';
            best = Math.max(best, minimax(board, depth + 1, false));
            board[i] = "";
        }
    }
    return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = 'o';
            best = Math.min(best, minimax(board, depth + 1, true));
            board[i] = "";
        }
    }
    return best;
    }
};

const findBestMove = (board) => {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
        board[i] = 'x';
        let moveVal = minimax(board, 0, false);
        board[i] = "";

        if (moveVal > bestVal) {
            bestMove = i;
            bestVal = moveVal;
        }
    }
}

    return bestMove;
};

export default findBestMove;