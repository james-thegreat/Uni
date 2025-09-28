import React, { useEffect, useRef, useState } from 'react';
import findBestMoveAlphaBeta from '../AlphaBeta/AlphaBeta'; // Import the AlphaBeta function
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';
import findBestMove from '../Minmax/MinMax'; // Import the Minimax function
import './TicTacToe.css';

let data = ["", "", "", "", "", "", "", "", ""];

const TicTacToe = () => {
  let [count, setCount] = useState(0);
  let [lock, setLock] = useState(false);
  let [startingPlayer, setStartingPlayer] = useState('x');
  let [gameMode, setGameMode] = useState('HumanVsHuman'); // New state for game mode
  let [minimaxDepth, setMinimaxDepth] = useState(3); // New state for Minimax depth
  let [alphaBetaDepth, setAlphaBetaDepth] = useState(3); // New state for AlphaBeta depth
  let titleRef = useRef(null);
  let box1 = useRef(null);
  let box2 = useRef(null);
  let box3 = useRef(null);
  let box4 = useRef(null);
  let box5 = useRef(null);
  let box6 = useRef(null);
  let box7 = useRef(null);
  let box8 = useRef(null);
  let box9 = useRef(null);
  let box_array = [box1, box2, box3, box4, box5, box6, box7, box8, box9];

  useEffect(() => {
    if (gameMode === 'MinMaxVsAlphaBeta' && !lock) {
      const currentPlayer = count % 2 === 0 ? 'x' : 'o';
      if (currentPlayer === 'x') {
        const bestMove = findBestMove(data, minimaxDepth);
        if (bestMove !== -1) {
          setTimeout(() => {
            box_array[bestMove].current.innerHTML = `<img src='${cross_icon}'>`;
            data[bestMove] = "x";
            setCount(++count);
            checkWin();
          }, 500); // Delay for better UX
        }
      } else {
        const bestMove = findBestMoveAlphaBeta(data, alphaBetaDepth);
        if (bestMove !== -1) {
          setTimeout(() => {
            box_array[bestMove].current.innerHTML = `<img src='${circle_icon}'>`;
            data[bestMove] = "o";
            setCount(++count);
            checkWin();
          }, 500); // Delay for better UX
        }
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
  };

  const checkWin = () => {
    // Check for win conditions
    // (same as your existing checkWin function)
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
    data = ["", "", "", "", "", "", "", "", ""];
    titleRef.current.innerHTML = 'Tic Tac Toe In <span>React</span>';
    box_array.map((e) => {
      e.current.innerHTML = "";
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
      box_array[bestMove].current.style.backgroundColor = 'yellow';
      setTimeout(() => {
        box_array[bestMove].current.style.backgroundColor = '';
      }, 1000); // Highlight for 1 second
    }
  };

  return (
    <div className='container'>
      <h1 className='title' ref={titleRef}>Tic Tac Toe Game In <span>React</span></h1>
      <div className='board'>
        <div className="row1">
          <div className="boxes" ref={box1} onClick={(e) => { toggle(e, 0) }}></div>
          <div className="boxes" ref={box2} onClick={(e) => { toggle(e, 1) }}></div>
          <div className="boxes" ref={box3} onClick={(e) => { toggle(e, 2) }}></div>
        </div>
        <div className="row2">
          <div className="boxes" ref={box4} onClick={(e) => { toggle(e, 3) }}></div>
          <div className="boxes" ref={box5} onClick={(e) => { toggle(e, 4) }}></div>
          <div className="boxes" ref={box6} onClick={(e) => { toggle(e, 5) }}></div>
        </div>
        <div className="row3">
          <div className="boxes" ref={box7} onClick={(e) => { toggle(e, 6) }}></div>
          <div className="boxes" ref={box8} onClick={(e) => { toggle(e, 7) }}></div>
          <div className="boxes" ref={box9} onClick={(e) => { toggle(e, 8) }}></div>
        </div>
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