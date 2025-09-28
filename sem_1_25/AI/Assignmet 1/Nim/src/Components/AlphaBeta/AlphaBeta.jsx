// AlphaBeta.jsx

const findBestMoveAlphaBeta = (total, depth) => {
  if (total === 0) return 0;

  let bestMove = 0;
  let bestValue = -Infinity;

  for (let move = 1; move <= 3; move++) { // Assuming you can take 1 to 3 sticks
      if (move <= total) {
          const value = alphaBeta(total - move, depth - 1, false, -Infinity, Infinity);
          if (value > bestValue) {
              bestValue = value;
              bestMove = move;
          }
      }
  }

  return bestMove;
};

const alphaBeta = (total, depth, isMaximizing, alpha, beta) => {
  if (total === 0) return isMaximizing ? -1 : 1; // If no sticks left, the current player loses
  if (depth === 0) return 0; // Depth limit reached

  if (isMaximizing) {
      let bestValue = -Infinity;
      for (let move = 1; move <= 3; move++) {
          if (move <= total) {
              const value = alphaBeta(total - move, depth - 1, false, alpha, beta);
              bestValue = Math.max(bestValue, value);
              alpha = Math.max(alpha, bestValue);
              if (beta <= alpha) break; // Beta cut-off
          }
      }
      return bestValue;
  } else {
      let bestValue = Infinity;
      for (let move = 1; move <= 3; move++) {
          if (move <= total) {
              const value = alphaBeta(total - move, depth - 1, true, alpha, beta);
              bestValue = Math.min(bestValue, value);
              beta = Math.min(beta, bestValue);
              if (beta <= alpha) break; // Alpha cut-off
          }
      }
      return bestValue;
  }
};

export default findBestMoveAlphaBeta;