"use client";

import React, { useState, useEffect } from "react";
import {
  Dices,
  ArrowLeft,
  RotateCcw,
  Users,
  Bot,
  Trophy,
  Sparkles,
  RefreshCw,
} from "lucide-react";

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6],             // Diagonals
];

export default function TicTacToeGame({
  defaultMode = "pvp",
  onBack,
}) {
  const [mode, setMode] = useState(defaultMode); // 'pvp' | 'bot'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // X is Pizza (🍕), O is Burger (🍔)
  const [winner, setWinner] = useState(null); // 'X' | 'O' | 'draw' | null
  const [winningLine, setWinningLine] = useState([]);
  const [isBotThinking, setIsBotThinking] = useState(false);

  const [scores, setScores] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
  });

  const checkWinner = (currentBoard) => {
    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: "draw", line: [] };
    }
    return null;
  };

  const handleClickCell = (index) => {
    if (board[index] || winner || isBotThinking) return;

    const newBoard = [...board];
    const currentMarker = isXNext ? "X" : "O";
    newBoard[index] = currentMarker;
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      handleGameOver(winResult);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const handleGameOver = (winResult) => {
    setWinner(winResult.winner);
    setWinningLine(winResult.line);

    if (winResult.winner === "X") {
      setScores((prev) => ({ ...prev, xWins: prev.xWins + 1 }));
    } else if (winResult.winner === "O") {
      setScores((prev) => ({ ...prev, oWins: prev.oWins + 1 }));
    } else if (winResult.winner === "draw") {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  // Bot AI move when playing vs Chef Bot
  useEffect(() => {
    if (mode !== "bot" || isXNext || winner) return;

    setIsBotThinking(true);

    const botTimer = setTimeout(() => {
      // 1. Check if bot can win in one move
      let targetIndex = findWinningMove(board, "O");

      // 2. Check if player X is about to win and block them
      if (targetIndex === null) {
        targetIndex = findWinningMove(board, "X");
      }

      // 3. Take center if available
      if (targetIndex === null && board[4] === null) {
        targetIndex = 4;
      }

      // 4. Take random available spot
      if (targetIndex === null) {
        const available = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((v) => v !== null);
        if (available.length > 0) {
          targetIndex = available[Math.floor(Math.random() * available.length)];
        }
      }

      if (targetIndex !== null) {
        const newBoard = [...board];
        newBoard[targetIndex] = "O";
        setBoard(newBoard);

        const winResult = checkWinner(newBoard);
        if (winResult) {
          handleGameOver(winResult);
        } else {
          setIsXNext(true);
        }
      }

      setIsBotThinking(false);
    }, 450);

    return () => clearTimeout(botTimer);
  }, [mode, isXNext, board, winner]);

  const findWinningMove = (currentBoard, marker) => {
    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (vals.filter((v) => v === marker).length === 2 && vals.filter((v) => v === null).length === 1) {
        if (currentBoard[a] === null) return a;
        if (currentBoard[b] === null) return b;
        if (currentBoard[c] === null) return c;
      }
    }
    return null;
  };

  const handleResetRound = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setIsBotThinking(false);
  };

  const handleResetScores = () => {
    handleResetRound();
    setScores({ xWins: 0, oWins: 0, draws: 0 });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border-light">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Games</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-200/60">
          <Dices size={14} />
          <span>Table Tic-Tac-Toe</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 bg-surface p-1.5 rounded-2xl border border-border-light shadow-xs max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => {
            setMode("pvp");
            handleResetRound();
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === "pvp"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-soft"
          }`}
        >
          <Users size={14} />
          <span>Pass &amp; Play</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("bot");
            handleResetRound();
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === "bot"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-soft"
          }`}
        >
          <Bot size={14} />
          <span>Play vs Chef Bot</span>
        </button>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-2 bg-surface p-3 rounded-2xl border border-border-light shadow-xs text-center max-w-sm mx-auto">
        <div className={`p-2 rounded-xl border ${isXNext && !winner ? "border-amber-400 bg-amber-500/10" : "border-transparent"}`}>
          <div className="text-xl">🍕</div>
          <p className="text-[10px] font-bold text-text-muted mt-0.5">Pizza (P1)</p>
          <p className="text-sm font-black text-text-primary">{scores.xWins}</p>
        </div>

        <div className="p-2 rounded-xl flex flex-col justify-center">
          <p className="text-[10px] font-bold text-text-muted">Ties</p>
          <p className="text-sm font-black text-text-primary">{scores.draws}</p>
        </div>

        <div className={`p-2 rounded-xl border ${!isXNext && !winner ? "border-rose-400 bg-rose-500/10" : "border-transparent"}`}>
          <div className="text-xl">🍔</div>
          <p className="text-[10px] font-bold text-text-muted mt-0.5">
            {mode === "bot" ? "Chef Bot" : "Burger (P2)"}
          </p>
          <p className="text-sm font-black text-text-primary">{scores.oWins}</p>
        </div>
      </div>

      {/* Status banner */}
      <div className="text-center">
        {winner === "X" && (
          <p className="text-sm font-black text-amber-600 animate-bounce">
            🎉 Pizza (Player 1) Wins the Table Match!
          </p>
        )}
        {winner === "O" && (
          <p className="text-sm font-black text-rose-600 animate-bounce">
            🎉 {mode === "bot" ? "Chef Bot Takes the Win!" : "Burger (Player 2) Wins!"}
          </p>
        )}
        {winner === "draw" && (
          <p className="text-sm font-black text-text-secondary">
            🤝 It's a Tie! Both chefs played well.
          </p>
        )}
        {!winner && (
          <p className="text-xs font-bold text-text-muted">
            {isBotThinking ? (
              <span className="flex items-center justify-center gap-1.5 text-blue-600">
                <RefreshCw size={12} className="animate-spin" />
                Chef Bot is calculating delicious moves...
              </span>
            ) : isXNext ? (
              "🍕 Player 1's Turn (Pizza)"
            ) : mode === "bot" ? (
              "🍔 Chef Bot's Turn"
            ) : (
              "🍔 Player 2's Turn (Burger)"
            )}
          </p>
        )}
      </div>

      {/* 3x3 Game Grid */}
      <div className="w-[280px] h-[280px] sm:w-[310px] sm:h-[310px] mx-auto grid grid-cols-3 gap-2.5 p-3 bg-surface rounded-3xl border border-border-light shadow-md">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine.includes(idx);

          return (
            <button
              key={idx}
              type="button"
              disabled={Boolean(cell || winner || isBotThinking)}
              onClick={() => handleClickCell(idx)}
              className={`rounded-2xl flex items-center justify-center text-4xl select-none transition-all cursor-pointer ${
                isWinningCell
                  ? "bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-500 scale-105 shadow-md"
                  : cell
                  ? "bg-surface-soft border border-border-light"
                  : "bg-surface-soft/60 hover:bg-surface-soft border border-border-light/60 hover:border-blue-400 active:scale-95"
              }`}
            >
              {cell === "X" && <span className="animate-in zoom-in-75 duration-200">🍕</span>}
              {cell === "O" && <span className="animate-in zoom-in-75 duration-200">🍔</span>}
            </button>
          );
        })}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-2 max-w-sm mx-auto pt-2">
        <button
          type="button"
          onClick={handleResetRound}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={14} />
          <span>New Match</span>
        </button>

        <button
          type="button"
          onClick={handleResetScores}
          className="px-4 py-3 rounded-2xl bg-surface-soft border border-border-light text-text-muted hover:text-text-primary text-xs font-bold transition-colors cursor-pointer"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
}
