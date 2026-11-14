"use client";

import React from "react";
import { 
  Gamepad2, 
  X, 
  Dices, 
  Sparkles, 
  Trophy, 
  Flame, 
  Clock, 
  Users,
  Play
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function GamesModal({ isOpen, onClose }) {
  const { setActiveTab, verifiedRestaurant } = useMenuOrder();

  if (!isOpen) return null;

  const tableGamesConfig = verifiedRestaurant?.portalSettings?.tableGames || {};

  const games = [
    {
      id: "trivia",
      title: tableGamesConfig.trivia?.title || "Foodie Trivia Showdown",
      tagline: tableGamesConfig.trivia?.tagline || "Test culinary trivia with table mates",
      icon: Trophy,
      gradient: "from-amber-500 to-orange-600",
      players: "2 - 6 Players",
      status: tableGamesConfig.trivia?.status || "Active",
      enabled: tableGamesConfig.trivia?.enabled !== false,
    },
    {
      id: "wheel",
      title: tableGamesConfig.dareSpin?.title || "Table Dare & Spin",
      tagline: tableGamesConfig.dareSpin?.tagline || "Spin the wheel for fun dinner challenges",
      icon: Flame,
      gradient: "from-pink-500 to-rose-600",
      players: "Everyone",
      status: tableGamesConfig.dareSpin?.status || "Active",
      enabled: tableGamesConfig.dareSpin?.enabled !== false,
    },
    {
      id: "tictactoe",
      title: tableGamesConfig.ticTacToe?.title || "Table Tic-Tac-Toe",
      tagline: tableGamesConfig.ticTacToe?.tagline || "Quick matches while waiting for your order",
      icon: Dices,
      gradient: "from-blue-500 to-indigo-600",
      players: tableGamesConfig.ticTacToe?.mode === "bot" ? "vs Chef Bot" : "2 Players",
      status: tableGamesConfig.ticTacToe?.status || "Active",
      enabled: tableGamesConfig.ticTacToe?.enabled !== false,
    },
  ];

  const handlePlayGame = () => {
    setActiveTab("Games");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-surface rounded-t-[28px] sm:rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Gamepad2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-text-primary">
                  Table Games &amp; Fun
                </h2>
                <span className="text-[10px] font-extrabold bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live &amp; Ready
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Play casual games with table mates while your food prepares!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-soft transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-4 text-white space-y-1 relative overflow-hidden shadow-sm">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles size={13} />
            Interactive Dining Experience
          </div>
          <h3 className="text-sm font-bold leading-tight">
            Play while you wait! 3 fun multiplayer table games are live.
          </h3>
          <p className="text-[11px] text-white/80">
            Compete for table bragging rights, answer foodie trivia, and spin for dinner dares on your phone.
          </p>
        </div>

        {/* Available Games Grid */}
        <div className="space-y-2.5 pt-1">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Choose a Game to Play
          </h4>

          <div className="space-y-2.5">
            {games.map((game) => {
              const Icon = game.icon;

              return (
                <div
                  key={game.id}
                  onClick={handlePlayGame}
                  className="bg-surface rounded-xl p-3.5 border border-border-light flex items-center justify-between gap-3 hover:border-purple-300 transition-all shadow-xs cursor-pointer group hover:bg-purple-50/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${game.gradient} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-text-primary truncate">
                        {game.title}
                      </h5>
                      <p className="text-[10px] text-text-muted truncate">
                        {game.tagline}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-semibold text-text-muted flex items-center gap-1">
                          <Users size={10} /> {game.players}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayGame();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold shadow-xs hover:bg-primary-hover flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Play size={11} className="fill-current" />
                    <span>Play</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info & close */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-surface-soft hover:bg-border-light text-text-primary text-xs font-bold transition-all cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
