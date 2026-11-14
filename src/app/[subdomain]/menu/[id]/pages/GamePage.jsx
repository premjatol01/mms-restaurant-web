"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Gamepad2,
  Dices,
  Sparkles,
  Trophy,
  Flame,
  Users,
  ArrowLeft,
  Play,
  Lock,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import FoodieTriviaGame from "../components/games/FoodieTriviaGame";
import DareAndSpinGame from "../components/games/DareAndSpinGame";
import TicTacToeGame from "../components/games/TicTacToeGame";

export default function GamePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setActiveTab, verifiedRestaurant } = useMenuOrder();

  const [activeGameId, setActiveGameId] = useState(null);

  // Retrieve admin configured settings from verified restaurant
  const tableGamesConfig = verifiedRestaurant?.portalSettings?.tableGames || {
    enabled: true,
    trivia: { enabled: true, title: "Foodie Trivia Showdown", status: "Active", timerSeconds: 15, questions: [] },
    dareSpin: { enabled: true, title: "Table Dare & Spin", status: "Active", dares: [] },
    ticTacToe: { enabled: true, title: "Table Tic-Tac-Toe", status: "Active", mode: "pvp" },
  };

  const handleBack = () => {
    if (activeGameId) {
      setActiveGameId(null);
      return;
    }
    setActiveTab("Home");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", "home");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const gamesList = [
    {
      id: "trivia",
      title: tableGamesConfig.trivia?.title || "Foodie Trivia Showdown",
      tagline: tableGamesConfig.trivia?.tagline || "Test culinary trivia with table mates",
      icon: Trophy,
      gradient: "from-amber-500 to-orange-600",
      players: "2 - 6 Players",
      status: tableGamesConfig.trivia?.status || "Active",
      enabled: tableGamesConfig.trivia?.enabled !== false,
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
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
      badgeColor: "text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
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
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
    },
  ];

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      {/* ─── ACTIVE GAME SCREENS ────────────────────────────────────────────── */}
      {activeGameId === "trivia" && (
        <FoodieTriviaGame
          questions={tableGamesConfig.trivia?.questions}
          timerSeconds={tableGamesConfig.trivia?.timerSeconds || 15}
          onBack={() => setActiveGameId(null)}
        />
      )}

      {activeGameId === "wheel" && (
        <DareAndSpinGame
          dares={tableGamesConfig.dareSpin?.dares}
          onBack={() => setActiveGameId(null)}
        />
      )}

      {activeGameId === "tictactoe" && (
        <TicTacToeGame
          defaultMode={tableGamesConfig.ticTacToe?.mode || "pvp"}
          onBack={() => setActiveGameId(null)}
        />
      )}

      {/* ─── GAMES LOBBY (DEFAULT) ─────────────────────────────────────────── */}
      {!activeGameId && (
        <>
          <PageHeader
            title="Table Games"
            subtitle="Play while you wait! Exciting table multiplayer games"
            showBack={true}
            onBack={handleBack}
          />

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-5 text-white space-y-2 relative overflow-hidden shadow-sm">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles size={14} />
              Interactive Dining Experience
            </div>
            <h2 className="text-lg font-bold leading-tight">
              Fun multiplayer games directly at your table!
            </h2>
            <p className="text-xs text-white/80 leading-relaxed">
              Challenge table companions to foodie trivia, spin-the-wheel dares, and rapid board battles right on your phone while the chef prepares your meal.
            </p>
          </div>

          {/* Games List */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Available Table Games ({gamesList.filter((g) => g.enabled).length})
            </h3>

            <div className="space-y-3">
              {gamesList.map((game) => {
                const Icon = game.icon;

                return (
                  <div
                    key={game.id}
                    className={`bg-surface rounded-2xl p-4 border transition-all shadow-xs ${
                      game.enabled
                        ? "border-border-light hover:border-purple-300"
                        : "border-border-light/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.gradient} text-white flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          <Icon size={22} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-text-primary truncate">
                            {game.title}
                          </h4>
                          <p className="text-xs text-text-muted mt-0.5 truncate">
                            {game.tagline}
                          </p>
                          <span className="text-[10px] font-semibold text-text-muted flex items-center gap-1 mt-1">
                            <Users size={11} /> {game.players}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border whitespace-nowrap ${game.badgeColor}`}
                      >
                        {game.status}
                      </span>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 pt-3 border-t border-border-light flex items-center justify-between">
                      <span className="text-[11px] text-text-muted">
                        No app install required &bull; Free to play
                      </span>

                      {game.enabled ? (
                        <button
                          type="button"
                          onClick={() => setActiveGameId(game.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-extrabold shadow-sm shadow-purple-500/20 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Play size={12} className="fill-current" />
                          <span>Play Now</span>
                        </button>
                      ) : (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Lock size={12} /> Paused
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
