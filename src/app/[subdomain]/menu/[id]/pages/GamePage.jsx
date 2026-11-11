"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Gamepad2, Dices, Sparkles, Trophy, Flame, Users, ArrowLeft } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";

const UPCOMING_GAMES = [
  {
    id: "trivia",
    title: "Foodie Trivia Showdown",
    tagline: "Test culinary trivia with table mates",
    icon: Trophy,
    gradient: "from-amber-500 to-orange-600",
    players: "2 - 6 Players",
    status: "In Development",
  },
  {
    id: "wheel",
    title: "Table Dare & Spin",
    tagline: "Spin the wheel for fun dinner challenges",
    icon: Flame,
    gradient: "from-pink-500 to-rose-600",
    players: "Everyone",
    status: "Coming Soon",
  },
  {
    id: "tictactoe",
    title: "Table Tic-Tac-Toe",
    tagline: "Quick matches while waiting for your order",
    icon: Dices,
    gradient: "from-blue-500 to-indigo-600",
    players: "2 Players",
    status: "Coming Soon",
  },
];

export default function GamePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setActiveTab } = useMenuOrder();

  const handleBack = () => {
    setActiveTab("Home");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", "home");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <PageHeader
        title="Table Games"
        subtitle="Play while you wait! Exciting games coming soon"
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

      {/* Featured Games in Development */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          Featured Games in Development
        </h3>

        <div className="space-y-3">
          {UPCOMING_GAMES.map((game) => {
            const Icon = game.icon;

            return (
              <div
                key={game.id}
                className="bg-surface rounded-2xl p-4 border border-border-light flex items-center justify-between gap-3 shadow-xs hover:border-purple-300 transition-all"
              >
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

                <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-200/50 whitespace-nowrap">
                  {game.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

