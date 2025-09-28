import React, { useEffect, useRef, useState } from 'react';
import findBestMoveAlphaBeta from '../AlphaBeta/AlphaBeta'; // Import the AlphaBeta function
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';
import findBestMove from '../Minmax/MinMax'; // Import the Minimax function
import './TicTacToe.css';

let data = Array(49).fill("");

const TicTacToe = () => {
  let [count, setCount] = useState(0);
  let [lock, setLock] = useState(false);
  let [startingPlayer, setStartingPlayer] = useState('x');
  let [gameMode, setGameMode] = useState('HumanVsHuman'); // New state for game mode
  let [minimaxDepth, setMinimaxDepth] = useState(3); // Default Minimax depth
  let [alphaBetaDepth, setAlphaBetaDepth] = useState(3); // Default AlphaBeta depth
  let titleRef = useRef(null);

  // Create a single ref to hold an array of refs for all 49 boxes
  const boxRefs = useRef(Array.from({ length: 49 }, () => React.createRef()));

  useEffect(() => {
    if (gameMode === 'MinMaxVsAlphaBeta' && !lock) {
      const currentPlayer = count % 2 === 0 ? 'x' : 'o';
      const bestMove = currentPlayer === 'x' ? findBestMove(data, minimaxDepth) : findBestMoveAlphaBeta(data, alphaBetaDepth);
      if (bestMove !== -1) {
        setTimeout(() => {
          boxRefs.current[bestMove].current.innerHTML = currentPlayer === 'x' ? `<img src='${cross_icon}'>` : `<img src='${circle_icon}'>`;
          data[bestMove] = currentPlayer;
          setCount(++count);
          checkWin();
        }, 500); // Delay for better UX
      }
    }
  }, [count, gameMode, lock]);

  const toggle = (e, num) => {
    if (lock || data[num] !== "" || gameMode === 'MinMaxVsAlphaBeta') {
      return;
    }

    // Determine the current player based on the starting player and count
    const currentPlayer = count % 2 === 0 ? startingPlayer : (startingPlayer === 'x' ? 'o' : 'x');
    if (currentPlayer === 'x') {
      e.target.innerHTML = `<img src='${cross_icon}'>`;
      data[num] = "x";
    } else {
      e.target.innerHTML = `<img src='${circle_icon}'>`;
      data[num] = "o";
    }
    setCount(++count);
    checkWin();

    // Trigger AI move if in HumanVsMinMax or HumanVsAlphaBeta mode
    if (gameMode === 'HumanVsMinMax' || gameMode === 'HumanVsAlphaBeta') {
      setTimeout(() => {
        const aiMove = gameMode === 'HumanVsMinMax' ? findBestMove(data, minimaxDepth) : findBestMoveAlphaBeta(data, alphaBetaDepth);
        if (aiMove !== -1) {
          boxRefs.current[aiMove].current.innerHTML = currentPlayer === 'x' ? `<img src='${circle_icon}'>` : `<img src='${cross_icon}'>`;
          data[aiMove] = currentPlayer === 'x' ? 'o' : 'x';
          setCount(++count);
          checkWin();
        }
      }, 500); // Delay for better UX
    }
  };

  const checkWin = () => {
    const lines = [
      // Horizontal lines
      ...Array(7).fill().flatMap((_, row) => Array(4).fill().map((_, col) => [row * 7 + col, row * 7 + col + 1, row * 7 + col + 2, row * 7 + col + 3])),
      // Vertical lines
      ...Array(7).fill().flatMap((_, col) => Array(4).fill().map((_, row) => [row * 7 + col, (row + 1) * 7 + col, (row + 2) * 7 + col, (row + 3) * 7 + col])),
      // Diagonal lines (top-left to bottom-right)
      ...Array(4).fill().flatMap((_, row) => Array(4).fill().map((_, col) => [(row + col) * 7 + col, (row + col + 1) * 7 + col + 1, (row + col + 2) * 7 + col + 2, (row + col + 3) * 7 + col + 3])),
      // Diagonal lines (bottom-left to top-right)
      ...Array(4).fill().flatMap((_, row) => Array(4).fill().map((_, col) => [(row + col) * 7 + (6 - col), (row + col + 1) * 7 + (5 - col), (row + col + 2) * 7 + (4 - col), (row + col + 3) * 7 + (3 - col)])),
    ];

    for (let line of lines) {
      const [a, b, c, d] = line;
      if (data[a] && data[a] === data[b] && data[a] === data[c] && data[a] === data[d]) {
        won(data[a]);
        return;
      }
    }
  };

  const won = (winner) => {
    setLock(true);
    if (winner === "x") {
      titleRef.current.innerHTML = `Congratulations: <img src=${cross_icon}>`;
    } else {
      titleRef.current.innerHTML = `Congratulations: <img src=${circle_icon}>`;
    }
  };

  const reset = () => {
    setLock(false);
    data = Array(49).fill("");
    titleRef.current.innerHTML = 'Tic Tac Toe In <span>React</span>';
    boxRefs.current.forEach((ref) => {
      ref.current.innerHTML = "";
    });
    setCount(0);
  };

  const startHumanVsHuman = () => {
    setGameMode('HumanVsHuman');
    reset();
  };

  const startHumanVsMinMax = () => {
    setGameMode('HumanVsMinMax');
    reset();
  };

  const startHumanVsAlphaBeta = () => {
    setGameMode('HumanVsAlphaBeta');
    reset();
  };

  const startMinMaxVsAlphaBeta = () => {
    setGameMode('MinMaxVsAlphaBeta');
    reset();
  };

  const showBestMove = () => {
    const bestMove = findBestMove(data, minimaxDepth);
    if (bestMove !== -1) {
      boxRefs.current[bestMove].current.style.backgroundColor = 'yellow';
      setTimeout(() => {
        boxRefs.current[bestMove].current.style.backgroundColor = '';
      }, 1000); // Highlight for 1 second
    }
  };

  return (
    <div className='container'>
      <h1 className='title' ref={titleRef}>Tic Tac Toe Game In <span>React</span></h1>
      <div className='board'>
        {Array.from({ length: 49 }).map((_, index) => (
          <div
            className="box"
            ref={boxRefs.current[index]}
            onClick={(e) => { toggle(e, index) }}
            key={index}
          ></div>
        ))}
      </div>
      <button className='reset' onClick={() => { reset() }}>Reset</button>
      <div className='RightMenu'>
        <button className='PlayO' onClick={() => { setStartingPlayer('o'); reset(); }}>Play as O</button>
        <button className='PlayX' onClick={() => { setStartingPlayer('x'); reset(); }}>Play as X</button>
        <button className='HumanVsHuman' onClick={startHumanVsHuman}>Human vs Human</button>
        <div className='slider-wrapper'>
          <button className='VsMinMax' onClick={startHumanVsMinMax}>Vs MinMax</button>
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
          <button className='VsAlphaBeta' onClick={startHumanVsAlphaBeta}>Vs AlphaBeta</button>
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
        <button className='MinMaxVsAlphaBeta' onClick={startMinMaxVsAlphaBeta}>MinMax vs AlphaBeta</button>
        <button className='BestMove' onClick={showBestMove}>Show Best Move</button>
      </div>
    </div>
  );
};

export default TicTacToe;