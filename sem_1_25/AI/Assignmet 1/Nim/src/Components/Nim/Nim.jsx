import React, { useEffect, useState } from 'react';
import findBestMoveAlphaBeta from '../AlphaBeta/AlphaBeta';
import findBestMoveMinMax from '../Minmax/MinMax';
import './Nim.css';

const Nim = () => {
    const [total, setTotal] = useState(20); // Total number of sticks/numbers
    const [input, setInput] = useState('');
    const [winner, setWinner] = useState(null);
    const [gameMode, setGameMode] = useState('HumanVsHuman');
    const [minmaxDepth, setMinmaxDepth] = useState(3);
    const [alphabetaDepth, setAlphabetaDepth] = useState(3);
    const [lastMove, setLastMove] = useState(null); // Track the last move

    useEffect(() => {
        if (gameMode === 'MinMaxVsAlphaBeta' && total > 0) {
            const timer = setTimeout(() => {
                if (total > 0) {
                    makeAIMove(total, 'MinMax');
                }
            }, 2000); // Slowing down the AI moves with a 2-second delay
            return () => clearTimeout(timer);
        }
    }, [total, gameMode]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleTake = () => {
        const takeAmount = parseInt(input);
        if (takeAmount > 0 && takeAmount <= total) {
            const newTotal = total - takeAmount;
            setTotal(newTotal);
            setLastMove(`User took ${takeAmount} stick(s)`);
            setInput('');
            if (newTotal === 0) {
                setWinner('Human');
            } else {
                if (gameMode === 'VsMinMax') {
                    makeAIMove(newTotal, 'MinMax');
                } else if (gameMode === 'VsAlphaBeta') {
                    makeAIMove(newTotal, 'AlphaBeta');
                }
            }
        }
    };

    const makeAIMove = (currentTotal, currentPlayer) => {
        let aiMove = 0;
        if (currentPlayer === 'MinMax') {
            aiMove = findBestMoveMinMax(currentTotal, minmaxDepth);
        } else if (currentPlayer === 'AlphaBeta') {
            aiMove = findBestMoveAlphaBeta(currentTotal, alphabetaDepth);
        }
        if (aiMove > 0 && aiMove <= currentTotal) {
            const newTotal = currentTotal - aiMove;
            setTotal(newTotal);
            setLastMove(`${currentPlayer} took ${aiMove} stick(s)`);
            if (newTotal === 0) {
                setWinner(currentPlayer === 'MinMax' ? 'MinMax' : 'AlphaBeta');
            } else if (gameMode === 'MinMaxVsAlphaBeta') {
                // Switch turns
                const nextPlayer = currentPlayer === 'MinMax' ? 'AlphaBeta' : 'MinMax';
                setTimeout(() => makeAIMove(newTotal, nextPlayer), 2000); // Adding delay between AI moves
            }
        }
    };

    const startHumanVsMinMax = () => {
        setGameMode('VsMinMax');
        resetGame();
    };

    const startHumanVsAlphaBeta = () => {
        setGameMode('VsAlphaBeta');
        resetGame();
    };

    const startMinMaxVsAlphaBeta = () => {
        setGameMode('MinMaxVsAlphaBeta');
        resetGame();
    };

    const resetGame = () => {
        setTotal(20);
        setInput('');
        setWinner(null);
        setLastMove(null);
    };

    const renderPyramid = () => {
        let pyramid = [];
        let count = 0;
        for (let i = 1; count < total; i++) {
            let row = '';
            for (let j = 0; j < i && count < total; j++) {
                row += '| ';
                count++;
            }
            pyramid.push(row.trim());
        }
        return pyramid.map((row, index) => <div key={index} className="pyramid-row">{row}</div>);
    };

    return (
        <div className='container'>
            <h1 className='title'>Nim Game</h1>

            <div className="sliders-container">
                <div className="slider-wrapper">
                    <div className="slider-container">
                        <label>MinMax Depth: {minmaxDepth}</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={minmaxDepth}
                            onChange={(e) => setMinmaxDepth(parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div className="slider-wrapper">
                    <div className="slider-container">
                        <label>AlphaBeta Depth: {alphabetaDepth}</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={alphabetaDepth}
                            onChange={(e) => setAlphabetaDepth(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div>
                <p>Numbers left: {total}</p>
                {renderPyramid()}
                {(gameMode === 'HumanVsHuman' || gameMode === 'VsMinMax' || gameMode === 'VsAlphaBeta') && (
                    <>
                        <input
                            type='number'
                            value={input}
                            onChange={handleInputChange}
                            min='1'
                            max={total}
                        />
                        <button onClick={handleTake}>Take</button>
                    </>
                )}
            </div>
            {lastMove && <p>{lastMove}</p>}
            {winner && <p>Winner: {winner}</p>}
            <div className='RightMenu'>
                <button className='VsMinMax' onClick={startHumanVsMinMax}>Vs MinMax</button>
                <button className='VsAlphaBeta' onClick={startHumanVsAlphaBeta}>Vs AlphaBeta</button>
                <button className='MinMaxVsAlphaBeta' onClick={startMinMaxVsAlphaBeta}>MinMax vs AlphaBeta</button>
                <button className='reset' onClick={resetGame}>Reset Game</button>
            </div>
        </div>
    );
};

export default Nim;