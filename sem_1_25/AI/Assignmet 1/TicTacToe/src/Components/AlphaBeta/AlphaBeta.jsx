// AlphaBeta.js

const evaluate = (board) => {
    // Check rows, columns, and diagonals for a win
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]            // diagonals
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
  
  const alphaBeta = (board, depth, isMax, alpha, beta) => {
    const score = evaluate(board);
  
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!isMovesLeft(board)) return 0;
  
    if (isMax) {
      let best = -Infinity;
  
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = 'x';
          best = Math.max(best, alphaBeta(board, depth + 1, !isMax, alpha, beta));
          board[i] = "";
          alpha = Math.max(alpha, best);
  
          if (beta <= alpha) break;
        }
      }
      return best;
    } else {
      let best = Infinity;
  
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = 'o';
          best = Math.min(best, alphaBeta(board, depth + 1, !isMax, alpha, beta));
          board[i] = "";
          beta = Math.min(beta, best);
  
          if (beta <= alpha) break;
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
        let moveVal = alphaBeta(board, 0, false, -Infinity, Infinity);
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