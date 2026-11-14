"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  ArrowLeft,
  Clock,
  Sparkles,
  RotateCcw,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  Award,
} from "lucide-react";

const DEFAULT_QUESTIONS = [
  {
    id: "q-1",
    question: "Which country is the historical birthplace of French Fries?",
    options: ["France", "Belgium", "USA", "Germany"],
    correctIndex: 1,
    explanation: "Historians believe fries originated in Belgium, where villagers fried small potatoes when rivers froze!"
  },
  {
    id: "q-2",
    question: "Which spice is the most expensive in the world by weight?",
    options: ["Vanilla", "Saffron", "Cardamom", "Star Anise"],
    correctIndex: 1,
    explanation: "Saffron is harvested by hand from the stigma of Crocus sativus flowers — it takes 75,000 flowers to make one pound!"
  },
  {
    id: "q-3",
    question: "What ingredient causes bread dough to rise and become airy?",
    options: ["Baking Soda", "Yeast", "Cornstarch", "Sugar"],
    correctIndex: 1,
    explanation: "Yeast consumes sugars in dough and releases carbon dioxide gas bubbles, which expands the dough."
  },
  {
    id: "q-4",
    question: "What gives traditional Italian pesto sauce its vibrant green color?",
    options: ["Spinach", "Fresh Basil", "Oregano", "Green Bell Pepper"],
    correctIndex: 1,
    explanation: "Classic Genovese pesto is made with crushed fresh sweet basil leaves, pine nuts, garlic, parmesan, and olive oil."
  },
  {
    id: "q-5",
    question: "Which fruit has all of its seeds on the outside of its skin?",
    options: ["Strawberry", "Kiwi", "Blueberry", "Raspberry"],
    correctIndex: 0,
    explanation: "Strawberries are the only fruit that bear their seeds on the outside — an average strawberry has around 200 seeds!"
  },
  {
    id: "q-6",
    question: "Which country is the world's largest producer of Olive Oil?",
    options: ["Italy", "Greece", "Spain", "Portugal"],
    correctIndex: 2,
    explanation: "Spain produces roughly 45% of the total olive oil supply in the world, with Andalusia leading the harvest."
  },
  {
    id: "q-7",
    question: "Real Japanese Wasabi is traditionally prepared from which plant part?",
    options: ["Mustard leaves", "Wasabia japonica rhizome root", "Green radishes", "Ginger stalk"],
    correctIndex: 1,
    explanation: "Authentic wasabi is grated from the underground stem (rhizome) of Wasabia japonica, known for its rapid aroma."
  },
  {
    id: "q-8",
    question: "What gives Earl Grey tea its distinct citrus aroma and flavor?",
    options: ["Bergamot orange oil", "Lemon peel", "Grapefruit zest", "Yuzu extract"],
    correctIndex: 0,
    explanation: "Earl Grey is black tea infused with cold-pressed oil from the rind of the fragrant bergamot citrus fruit."
  }
];

const PLAYER_COLORS = [
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-fuchsia-500 to-violet-500",
];

export default function FoodieTriviaGame({
  questions = DEFAULT_QUESTIONS,
  timerSeconds = 15,
  onBack,
}) {
  const activeQuestions = Array.isArray(questions) && questions.length > 0 ? questions : DEFAULT_QUESTIONS;
  const timeLimit = Math.max(5, Number(timerSeconds) || 15);

  const [gameState, setGameState] = useState("lobby"); // 'lobby' | 'playing' | 'gameover'
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", score: 0 },
    { id: 2, name: "Player 2", score: 0 },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [timerActive, setTimerActive] = useState(false);

  const timerRef = useRef(null);

  // Setup players when count changes in lobby
  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    const newPlayers = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      score: 0,
    }));
    setPlayers(newPlayers);
  };

  const handleStartGame = () => {
    setCurrentIndex(0);
    setCurrentPlayerTurn(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(timeLimit);
    setTimerActive(true);
    setGameState("playing");
  };

  // Timer loop
  useEffect(() => {
    if (!timerActive || isAnswered || gameState !== "playing") return;

    if (timeLeft <= 0) {
      // Time up! Mark as wrong answer
      handleSelectAnswer(-1);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerActive, isAnswered, timeLeft, gameState]);

  const handleSelectAnswer = (optionIdx) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setSelectedOption(optionIdx);
    setIsAnswered(true);
    setTimerActive(false);

    const currentQ = activeQuestions[currentIndex];
    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === currentPlayerTurn
            ? { ...p, score: p.score + (100 + timeLeft * 5) }
            : p
        )
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= activeQuestions.length) {
      setGameState("gameover");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setCurrentPlayerTurn((prev) => (prev + 1) % players.length);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(timeLimit);
    setTimerActive(true);
  };

  const currentQ = activeQuestions[currentIndex];
  const activePlayer = players[currentPlayerTurn];

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

        <div className="flex items-center gap-1 text-xs font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200/60">
          <Trophy size={14} />
          <span>Foodie Trivia</span>
        </div>
      </div>

      {/* ─── LOBBY VIEW ──────────────────────────────────────────────────────────── */}
      {gameState === "lobby" && (
        <div className="space-y-5 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Trophy size={32} />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-text-primary">
              Foodie Trivia Showdown
            </h3>
            <p className="text-xs text-text-muted max-w-xs mx-auto">
              Compete with table mates! Answer culinary questions before time runs out.
            </p>
          </div>

          {/* Select Player Count */}
          <div className="bg-surface rounded-2xl p-4 border border-border-light space-y-3 max-w-sm mx-auto text-left shadow-xs">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} />
              Select Table Players:
            </label>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 6].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handlePlayerCountChange(count)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    playerCount === count
                      ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                      : "bg-surface-soft border-border-light text-text-secondary hover:border-amber-300"
                  }`}
                >
                  {count} {count === 1 ? "Solo" : "P"}
                </button>
              ))}
            </div>

            {/* Custom Player Names (Optional) */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-text-muted">
                Player Roster ({players.length}):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {players.map((p, idx) => (
                  <input
                    key={p.id}
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      const copy = [...players];
                      copy[idx].name = e.target.value;
                      setPlayers(copy);
                    }}
                    placeholder={`Player ${idx + 1}`}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-border-light bg-surface-soft text-text-primary font-medium focus:outline-none focus:border-amber-500"
                  />
                ))}
              </div>
            </div>

            <div className="pt-1 text-[11px] text-text-muted flex items-center justify-between border-t border-border-light">
              <span>{activeQuestions.length} Questions</span>
              <span>{timeLimit}s per Turn</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartGame}
            className="w-full max-w-sm py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm transition-all shadow-md shadow-orange-500/25 hover:opacity-95 cursor-pointer"
          >
            Start Trivia Showdown 🔥
          </button>
        </div>
      )}

      {/* ─── PLAYING VIEW ────────────────────────────────────────────────────────── */}
      {gameState === "playing" && currentQ && (
        <div className="space-y-4">
          {/* Header Bar: Turn & Timer */}
          <div className="flex items-center justify-between bg-surface p-3 rounded-2xl border border-border-light shadow-xs">
            {/* Active Player badge */}
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-lg bg-gradient-to-br ${
                  PLAYER_COLORS[currentPlayerTurn % PLAYER_COLORS.length]
                } text-white text-xs font-black flex items-center justify-center shadow-xs`}
              >
                {currentPlayerTurn + 1}
              </span>
              <div>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                  Current Turn
                </p>
                <h4 className="text-xs font-extrabold text-text-primary truncate max-w-[120px]">
                  {activePlayer?.name || `Player ${currentPlayerTurn + 1}`}
                </h4>
              </div>
            </div>

            {/* Timer circle */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border transition-colors ${
                  timeLeft <= 5
                    ? "bg-red-500 text-white border-red-600 animate-pulse"
                    : "bg-surface-soft border-border-light text-text-primary"
                }`}
              >
                <Clock size={13} />
                <span>{timeLeft}s</span>
              </div>

              <span className="text-[11px] font-bold text-text-muted">
                {currentIndex + 1} / {activeQuestions.length}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-surface rounded-2xl p-5 border border-border-light space-y-4 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              <Sparkles size={13} />
              Question {currentIndex + 1}
            </div>

            <h3 className="text-base sm:text-lg font-black text-text-primary leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = "bg-surface-soft border-border-light text-text-primary hover:border-amber-400";

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-green-500 text-white border-green-600 shadow-sm";
                  } else if (isSelected) {
                    btnStyle = "bg-red-500 text-white border-red-600 shadow-sm";
                  } else {
                    btnStyle = "bg-surface-soft/60 border-border-light text-text-muted opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px] shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </span>

                    {isAnswered && isCorrect && <CheckCircle2 size={16} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle size={16} />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-text-primary space-y-1 animate-in fade-in duration-200">
                <span className="font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  💡 Fun Fact &amp; Answer:
                </span>
                <p className="leading-relaxed text-[11px] text-text-secondary">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Action button */}
          {isAnswered && (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm transition-all shadow-md shadow-orange-500/25 hover:opacity-95 cursor-pointer animate-in slide-in-from-bottom-2 duration-200"
            >
              {currentIndex + 1 >= activeQuestions.length ? "View Final Scores 🏆" : "Next Question →"}
            </button>
          )}

          {/* Score ticker at bottom */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
            {players.map((p, idx) => (
              <div
                key={p.id}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 shrink-0 ${
                  idx === currentPlayerTurn
                    ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "border-border-light bg-surface text-text-muted"
                }`}
              >
                <span>{p.name}:</span>
                <span className="font-black text-text-primary">{p.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── GAMEOVER LEADERBOARD VIEW ───────────────────────────────────────────── */}
      {gameState === "gameover" && (
        <div className="space-y-5 text-center py-4 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Trophy size={32} />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-text-primary">
              Trivia Showdown Finished!
            </h3>
            <p className="text-xs text-text-muted">
              Here are the table results &amp; foodie bragging rights!
            </p>
          </div>

          {/* Ranked list */}
          <div className="bg-surface rounded-2xl p-4 border border-border-light space-y-2 max-w-sm mx-auto shadow-xs text-left">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider pb-1 border-b border-border-light">
              Final Standings
            </h4>

            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((p, rank) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    rank === 0
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200"
                      : "bg-surface-soft border-border-light text-text-primary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-xs font-black shrink-0">
                      {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `#${rank + 1}`}
                    </span>
                    <span className="text-xs font-extrabold truncate">
                      {p.name}
                    </span>
                  </div>

                  <span className="text-xs font-black text-primary">
                    {p.score} pts
                  </span>
                </div>
              ))}
          </div>

          <div className="flex gap-2 max-w-sm mx-auto">
            <button
              type="button"
              onClick={handleStartGame}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs transition-all shadow-sm shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Rematch</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 rounded-xl bg-surface-soft border border-border-light text-text-primary font-bold text-xs transition-all cursor-pointer"
            >
              Choose Other Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
