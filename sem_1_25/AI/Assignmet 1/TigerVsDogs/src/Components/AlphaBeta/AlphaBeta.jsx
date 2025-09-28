// src/Components/AlphaBeta/AlphaBeta.jsx

const evaluate = (board, tigerPosition) => {
  let score = 0;
  const dogCount = board.filter(cell => cell === 'D').length;
  const capturedDogs = 16 - dogCount;
  
  // Encourage capturing dogs
  score += capturedDogs * 20;
  
  // Penalize having more dogs on the board
  score -= dogCount * 10;
  
  // Encourage tiger mobility
  const { row, col } = tigerPosition;
  let tigerMoves = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5 && board[newRow * 5 + newCol] === null) {
        tigerMoves++;
      }
    }
  }
  score += tigerMoves * 5;
  
  return score;
};

const isMovesLeft = (board) => {
  return board.includes(null);
};

const alphaBeta = (board, depth, isMax, alpha, beta, tigerPosition, maxDepth) => {
  const score = evaluate(board, tigerPosition);

  if (depth === maxDepth) return score;
  if (!isMovesLeft(board)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'T';
        const newTigerPosition = { row: Math.floor(i / 5), col: i % 5 };
        best = Math.max(best, alphaBeta(board, depth + 1, false, alpha, beta, newTigerPosition, maxDepth));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'D';
        best = Math.min(best, alphaBeta(board, depth + 1, true, alpha, beta, tigerPosition, maxDepth));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
};

const findBestMove = (board, depth, tigerPosition, isPlayingAsTiger = true) => {
  if (isPlayingAsTiger) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'T';
        const newTigerPosition = { row: Math.floor(i / 5), col: i % 5 };
        let moveVal = alphaBeta(board, 0, false, -Infinity, Infinity, newTigerPosition, depth);
        board[i] = null;

        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  } else {
    let bestVal = Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'D';
        let moveVal = alphaBeta(board, 0, true, -Infinity, Infinity, tigerPosition, depth);
        board[i] = null;

        if (moveVal < bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  }
};

export default findBestMove;