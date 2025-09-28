// src/Components/TigerVsDogs/TigerVsDogs.jsx
import React, { useEffect, useRef, useState } from 'react';
import findBestMoveAlphaBeta from '../AlphaBeta/AlphaBeta';
import findBestMoveMinMax from '../Minmax/MinMax';
import './TigerVsDogs.css';

const TigerVsDogs = () => {
  const initialBoard = [
    ['D', 'D', 'D', 'D', 'D'],
    ['D', null, null, null, 'D'],
    ['D', null, 'T', null, 'D'],
    ['D', null, null, null, 'D'],
    ['D', 'D', 'D', 'D', 'D'],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('T');
  const [tigerPosition, setTigerPosition] = useState({ row: 2, col: 2 });
  const [selectedDog, setSelectedDog] = useState(null);
  const [selectedTiger, setSelectedTiger] = useState(false);
  const [capturedDogs, setCapturedDogs] = useState(0);
  const [minimaxDepth, setMinimaxDepth] = useState(3);
  const [alphaBetaDepth, setAlphaBetaDepth] = useState(3);
  const [humanPiece, setHumanPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isAIvsAI, setIsAIvsAI] = useState(false);
  const [aiInterval, setAiInterval] = useState(null);
  const titleRef = useRef(null);

  const isTigerTrapped = () => {
    const { row, col } = tigerPosition;
    
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const newRow = row + i;
        const newCol = col + j;
        
        if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
          if (isValidMove(row, col, newRow, newCol) || isValidJump(row, col, newRow, newCol)) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleAIvsAI = () => {
    if (isAIvsAI) {
      if (aiInterval) {
        clearInterval(aiInterval);
        setAiInterval(null);
      }
      setIsAIvsAI(false);
    } else {
      setIsAIvsAI(true);
      reset();
      const interval = setInterval(() => {
        const flatBoard = board.flat();
        let bestMoveIndex;

        if (currentPlayer === 'T') {
          // AlphaBeta plays as Tiger
          bestMoveIndex = findBestMoveAlphaBeta(flatBoard, alphaBetaDepth, tigerPosition, true);
          if (bestMoveIndex !== -1) {
            const row = Math.floor(bestMoveIndex / 5);
            const col = bestMoveIndex % 5;
            moveTiger(row, col);
          }
        } else {
          // MinMax plays as Dogs
          bestMoveIndex = findBestMoveMinMax(flatBoard, minimaxDepth, tigerPosition, false);
          if (bestMoveIndex !== -1) {
            const row = Math.floor(bestMoveIndex / 5);
            const col = bestMoveIndex % 5;
            moveDog(row, col);
          }
        }

        if (winner) {
          clearInterval(interval);
          setAiInterval(null);
          setIsAIvsAI(false);
        }
      }, 1000);
      setAiInterval(interval);
    }
  };

  const makeAIMove = () => {
    if (winner || currentPlayer === humanPiece) return;

    setTimeout(() => {
      const flatBoard = board.flat();
      let bestMoveIndex;

      if (currentPlayer === 'T') {
        bestMoveIndex = findBestMoveAlphaBeta(flatBoard, alphaBetaDepth, tigerPosition, true);
        if (bestMoveIndex !== -1) {
          const row = Math.floor(bestMoveIndex / 5);
          const col = bestMoveIndex % 5;
          moveTiger(row, col);
        }
      } else {
        if (humanPiece === 'T') {
          bestMoveIndex = findBestMoveMinMax(flatBoard, minimaxDepth, tigerPosition, false);
        } else {
          bestMoveIndex = findBestMoveAlphaBeta(flatBoard, alphaBetaDepth, tigerPosition, false);
        }
        if (bestMoveIndex !== -1) {
          const row = Math.floor(bestMoveIndex / 5);
          const col = bestMoveIndex % 5;
          moveDog(row, col);
        }
      }
    }, 500);
  };

  useEffect(() => {
    if (humanPiece && currentPlayer !== humanPiece) {
      makeAIMove();
    }
  }, [currentPlayer, humanPiece]);

  useEffect(() => {
    return () => {
      if (aiInterval) {
        clearInterval(aiInterval);
      }
    };
  }, [aiInterval]);

  const handleCellClick = (row, col) => {
    if (winner || currentPlayer !== humanPiece || isAIvsAI) return;

    if (humanPiece === 'T') {
      if (selectedTiger) {
        moveTiger(row, col);
        setSelectedTiger(false);
      } else if (board[row][col] === 'T') {
        setSelectedTiger(true);
      }
    } else {
      if (selectedDog) {
        moveDog(row, col);
      } else if (board[row][col] === 'D') {
        setSelectedDog({ row, col });
      }
    }
  };

  // ... (rest of the movement and game logic functions remain the same)
  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return rowDiff <= 1 && colDiff <= 1 && board[toRow][toCol] === null;
  };
  
  const isValidJump = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    if (rowDiff === 2 && colDiff === 0) {
      const midRow = (fromRow + toRow) / 2;
      return board[toRow][toCol] === null && board[midRow][fromCol] === 'D';
    }
    if (colDiff === 2 && rowDiff === 0) {
      const midCol = (fromCol + toCol) / 2;
      return board[toRow][toCol] === null && board[fromRow][midCol] === 'D';
    }
    return false;
  };
  
  const moveTiger = (row, col) => {
    if (winner) return;
  
    if (isValidMove(tigerPosition.row, tigerPosition.col, row, col)) {
      const newBoard = board.map((r) => r.slice());
      newBoard[tigerPosition.row][tigerPosition.col] = null;
      newBoard[row][col] = 'T';
      setBoard(newBoard);
      setTigerPosition({ row, col });
      setCurrentPlayer('D');
      checkWinner();
    } else if (isValidJump(tigerPosition.row, tigerPosition.col, row, col)) {
      const newBoard = board.map((r) => r.slice());
      const midRow = (tigerPosition.row + row) / 2;
      const midCol = (tigerPosition.col + col) / 2;
      newBoard[tigerPosition.row][tigerPosition.col] = null;
      newBoard[midRow][midCol] = null;
      newBoard[row][col] = 'T';
      setBoard(newBoard);
      setTigerPosition({ row, col });
      const newCapturedDogs = capturedDogs + 1;
      setCapturedDogs(newCapturedDogs);
      setCurrentPlayer('D');
      
      if (newCapturedDogs >= 6) {
        setWinner('Tiger');
        titleRef.current.innerHTML = 'Tiger Wins! 🎉';
      }
    }
  };
  
  const moveDog = (row, col) => {
    if (winner) return;
  
    if (selectedDog && isValidMove(selectedDog.row, selectedDog.col, row, col)) {
      const newBoard = board.map((r) => r.slice());
      newBoard[selectedDog.row][selectedDog.col] = null;
      newBoard[row][col] = 'D';
      setBoard(newBoard);
      setSelectedDog(null);
      setCurrentPlayer('T');
      
      setTimeout(() => {
        if (isTigerTrapped()) {
          setWinner('Dogs');
          titleRef.current.innerHTML = 'Dogs Win! 🎉';
        }
      }, 0);
    }
  };
  
  const checkWinner = () => {
    if (capturedDogs >= 6) {
      setWinner('Tiger');
      titleRef.current.innerHTML = 'Tiger Wins! 🎉';
      return true;
    }
    
    if (isTigerTrapped()) {
      setWinner('Dogs');
      titleRef.current.innerHTML = 'Dogs Win! 🎉';
      return true;
    }
    
    return false;
  };

  const reset = () => {
    if (aiInterval) {
      clearInterval(aiInterval);
      setAiInterval(null);
    }
    setIsAIvsAI(false);
    setBoard(initialBoard);
    setCurrentPlayer('T');
    setTigerPosition({ row: 2, col: 2 });
    setSelectedDog(null);
    setSelectedTiger(false);
    setCapturedDogs(0);
    setWinner(null);
    setHumanPiece(null);
    titleRef.current.innerHTML = 'Tiger vs Dogs Game In <span>React</span>';
  };

  const startHumanVsHuman = () => {
    setHumanPiece(null);
    reset();
  };

  const startHumanVsMinMax = () => {
    if (!humanPiece) return;
    reset();
    if (currentPlayer !== humanPiece) {
      makeAIMove();
    }
  };

  const startHumanVsAlphaBeta = () => {
    if (!humanPiece) return;
    reset();
    if (currentPlayer !== humanPiece) {
      makeAIMove();
    }
  };

  const startMinMaxVsAlphaBeta = () => {
    setHumanPiece(null);
    handleAIvsAI();
  };

  return (
    <div className='container'>
      <h1 className='title' ref={titleRef}>Tiger vs Dogs Game In <span>React</span></h1>
      <div className='board-container'>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              className={`cell ${
                selectedDog && selectedDog.row === rowIndex && selectedDog.col === colIndex
                  ? 'selected'
                  : ''
              } ${selectedTiger && tigerPosition.row === rowIndex && tigerPosition.col === colIndex ? 'selected' : ''}`}
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell === 'T' && <div className="tiger" />}
              {cell === 'D' && <div className="dog" />}
            </div>
          ))
        )}
      </div>

      {winner && (
        <div className='winner-message'>
          <h2>{winner === 'Tiger' ? '🐯 Tiger Wins! 🎉' : '🐕 Dogs Win! 🎉'}</h2>
          <p>
            {winner === 'Tiger' 
              ? `Tiger captured ${capturedDogs} dogs!` 
              : 'Dogs successfully trapped the Tiger!'}
          </p>
        </div>
      )}

      <button className='reset' onClick={reset}>Reset</button>
      <div className='RightMenu'>
        <div className='piece-selection'>
          <h3>Select Your Piece:</h3>
          <button 
            className={`piece-button ${humanPiece === 'T' ? 'selected' : ''}`} 
            onClick={() => setHumanPiece('T')}
            disabled={isAIvsAI}
          >
            Play as Tiger
          </button>
          <button 
            className={`piece-button ${humanPiece === 'D' ? 'selected' : ''}`} 
            onClick={() => setHumanPiece('D')}
            disabled={isAIvsAI}
          >
            Play as Dogs
          </button>
        </div>

        <button 
          className='HumanVsHuman' 
          onClick={startHumanVsHuman}
          disabled={isAIvsAI}
        >
          Human vs Human
        </button>
        
        <div className='slider-wrapper'>
          <button 
            className='VsMinMax' 
            onClick={startHumanVsMinMax}
            disabled={!humanPiece || isAIvsAI}
          >
            Vs MinMax
          </button>
          <div className='slider-container'>
            <label htmlFor='minimaxDepth'>Minimax Depth: {minimaxDepth}</label>
            <input
              type='range'
              id='minimaxDepth'
              min='1'
              max='10'
              value={minimaxDepth}
              onChange={(e) => setMinimaxDepth(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className='slider-wrapper'>
          <button 
            className='VsAlphaBeta' 
            onClick={startHumanVsAlphaBeta}
            disabled={!humanPiece || isAIvsAI}
          >
            Vs AlphaBeta
          </button>
          <div className='slider-container'>
            <label htmlFor='alphaBetaDepth'>AlphaBeta Depth: {alphaBetaDepth}</label>
            <input
              type='range'
              id='alphaBetaDepth'
              min='1'
              max='10'
              value={alphaBetaDepth}
              onChange={(e) => setAlphaBetaDepth(parseInt(e.target.value))}
            />
          </div>
        </div>

        <button 
          className={`MinMaxVsAlphaBeta ${isAIvsAI ? 'active' : ''}`} 
          onClick={startMinMaxVsAlphaBeta}
        >
          {isAIvsAI ? 'Stop AI vs AI' : 'MinMax vs AlphaBeta'}
        </button>
      </div>
    </div>
  );
};

export default TigerVsDogs;