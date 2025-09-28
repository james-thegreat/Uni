// MinMax.jsx

const findBestMoveMinMax = (total, depth) => {
  if (total === 0) return 0;

  let bestMove = 0;
  let bestValue = -Infinity;

  for (let move = 1; move <= 3; move++) { // Assuming you can take 1 to 3 sticks
      if (move <= total) {
          const value = minimax(total - move, depth - 1, false);
          if (value > bestValue) {
              bestValue = value;
              bestMove = move;
          }
      }
  }

  return bestMove;
};

const minimax = (total, depth, isMaximizing) => {
  if (total === 0) return isMaximizing ? -1 : 1; // If no sticks left, the current player loses
  if (depth === 0) return 0; // Depth limit reached

  if (isMaximizing) {
      let bestValue = -Infinity;
      for (let move = 1; move <= 3; move++) {
          if (move <= total) {
              const value = minimax(total - move, depth - 1, false);
              bestValue = Math.max(bestValue, value);
          }
      }
      return bestValue;
  } else {
      let bestValue = Infinity;
      for (let move = 1; move <= 3; move++) {
          if (move <= total) {
              const value = minimax(total - move, depth - 1, true);
              bestValue = Math.min(bestValue, value);
          }
      }
      return bestValue;
  }
};

export default findBestMoveMinMax;