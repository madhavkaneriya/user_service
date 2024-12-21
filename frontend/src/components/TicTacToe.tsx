import React, { useState } from 'react';
import axios from 'axios';
import './styles/tictactoe.css';
import { useLoggedInUser } from '../context/UserContext';

const BASE_URL = 'http://localhost:3000';

const TicTacToe: React.FC = () => {
  const { token } = useLoggedInUser();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const recordGameResult = async () => {
    try {
      await axios.patch(`${BASE_URL}/users/update-profile`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    } catch (err) {
      console.error('Error recording game result:', err);
    }
  };

  const checkWinner = (newBoard: string[]) => {
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
    for (const line of lines) {
      const [a, b, c] = line;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return newBoard.every(cell => cell) ? 'Draw' : null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      recordGameResult();
    } else {
      setIsXNext(!isXNext);
      setTimeout(() => computerMove(newBoard), 250);
    }
    
  };

  const computerMove = (newBoard: string[]) => {
    const emptyIndices = newBoard.map((cell, index) => (cell ? null : index)).filter(index => index !== null);
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      recordGameResult();
    }
    setIsXNext(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderCell = (index: number) => (
    <div key={index} className="cell" onClick={() => handleClick(index)}>
      {board[index]}
    </div>
  );

  return (
    <div className="tictactoe-container">
      <div className="board">
        {board.map((_, index) => renderCell(index))}
      </div>
      {winner && <div className="winner-message">{winner === 'Draw' ? 'It\'s a Draw!' : `Winner: ${winner}`}</div>}
      {winner && <button className="reset-button" onClick={resetGame}>Reset</button>}
    </div>
  );
};

export default TicTacToe;