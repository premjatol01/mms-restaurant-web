"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Flame,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Users,
  Trophy,
  History,
} from "lucide-react";

const DEFAULT_DARES = [
  { id: "d-1", text: "Food Critic: Review your last bite or sip like a 3-star Michelin chef for 30 seconds.", color: "#EF4444" },
  { id: "d-2", text: "Chef's Compliment: Give a genuine, creative compliment to the person sitting across from you.", color: "#F59E0B" },
  { id: "d-3", text: "Table Selfie: Take a silly group selfie with everyone at the table right now!", color: "#10B981" },
  { id: "d-4", text: "Mystery Order: The player to your left gets to pick your next dessert or side dish.", color: "#3B82F6" },
  { id: "d-5", text: "Food Confession: Share the weirdest food combination you secretly enjoy.", color: "#8B5CF6" },
  { id: "d-6", text: "Accent Time: Say your favorite food order in a dramatic French or Italian accent.", color: "#EC4899" },
  { id: "d-7", text: "No Hands: Eat your next French fry, chip, or nacho using only your mouth — no hands!", color: "#F97316" },
  { id: "d-8", text: "Quick Trivia: The person on your right asks you any question — get it right or tell a funny secret.", color: "#14B8A6" },
];

export default function DareAndSpinGame({
  dares = DEFAULT_DARES,
  onBack,
}) {
  const activeDares = Array.isArray(dares) && dares.length >= 2 ? dares : DEFAULT_DARES;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedDare, setSelectedDare] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const numSegments = activeDares.length;
  const segmentAngle = 360 / numSegments;

  // Draw the wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 8;
    const center = width / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw segments
    for (let i = 0; i < numSegments; i++) {
      const startAngle = ((i * segmentAngle) * Math.PI) / 180;
      const endAngle = (((i + 1) * segmentAngle) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = activeDares[i].color || DEFAULT_DARES[i % DEFAULT_DARES.length].color;
      ctx.fill();

      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw segment text / number
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + ((endAngle - startAngle) / 2));
      ctx.textAlign = "right";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 3;

      // Extract brief label (first 2-3 words)
      const rawText = activeDares[i].text.split(":")[0];
      const shortText = rawText.length > 14 ? rawText.slice(0, 14) + ".." : rawText;
      ctx.fillText(shortText, radius - 18, 5);
      ctx.restore();
    }

    // Outer rim ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.stroke();

    // Center hub pin
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = "#1E1B4B";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center star / icon
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⭐", center, center);
  }, [activeDares, numSegments, segmentAngle]);

  const handleSpin = () => {
    if (isSpinning) return;

    setSelectedDare(null);
    setIsSpinning(true);

    // Generate random 5 to 9 full spins + random target angle
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 4));
    const randomOffset = Math.floor(Math.random() * 360);
    const newTotalRotation = rotation + extraSpins + randomOffset;

    setRotation(newTotalRotation);

    // Calculate winning segment
    // Top pointer is at 270 degrees in canvas coords (top center)
    setTimeout(() => {
      setIsSpinning(false);

      const normalizedDegree = (360 - (newTotalRotation % 360) + 270) % 360;
      const winningIndex = Math.floor(normalizedDegree / segmentAngle) % numSegments;
      const won = activeDares[winningIndex];

      setSelectedDare(won);
      setHistory((prev) => [won, ...prev.slice(0, 4)]);
    }, 4000);
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

        <div className="flex items-center gap-1 text-xs font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200/60">
          <Flame size={14} />
          <span>Dare &amp; Spin</span>
        </div>
      </div>

      {/* Wheel Area */}
      <div className="bg-surface rounded-2xl p-5 border border-border-light text-center space-y-4 shadow-xs relative overflow-hidden">
        <div>
          <h3 className="text-lg font-black text-text-primary">
            Table Dare &amp; Spin Wheel
          </h3>
          <p className="text-xs text-text-muted">
            Gather your table mates, hit SPIN, and take on the dinner dare!
          </p>
        </div>

        {/* Wheel Container with Top Pointer */}
        <div className="relative w-[300px] h-[300px] mx-auto flex items-center justify-center my-2">
          {/* Top Pointer Triangle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-md" />

          {/* Canvas Wheel */}
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="w-[300px] h-[300px] rounded-full drop-shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? "transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)" : "none",
            }}
          />
        </div>

        {/* Spin Button */}
        <div>
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className={`w-full max-w-xs py-3.5 rounded-2xl font-black text-sm transition-all shadow-md cursor-pointer ${
              isSpinning
                ? "bg-gray-400 text-white cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-pink-500 via-rose-600 to-red-600 text-white shadow-rose-500/25 hover:opacity-95 active:scale-98"
            }`}
          >
            {isSpinning ? "Spinning Wheel... 🎡" : "SPIN THE WHEEL! 🎯"}
          </button>
        </div>
      </div>

      {/* ─── DARE REVEAL MODAL / BANNER ────────────────────────────────────────── */}
      {selectedDare && (
        <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 rounded-2xl p-5 text-white space-y-3 shadow-lg shadow-pink-500/25 animate-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/20 text-white uppercase tracking-wider backdrop-blur-xs">
              <Sparkles size={12} />
              The Wheel Has Spoken!
            </span>
            <span className="text-xl">🎉</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-black leading-snug">
              {selectedDare.text}
            </h4>
            <p className="text-xs text-white/80">
              Complete the dare with your table mates or pass to the next player!
            </p>
          </div>

          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={handleSpin}
              className="flex-1 py-2.5 rounded-xl bg-white text-rose-600 font-extrabold text-xs shadow-sm hover:bg-white/90 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Next Player Spin</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDare(null)}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Recent Dares History */}
      {history.length > 0 && (
        <div className="bg-surface rounded-2xl p-4 border border-border-light space-y-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
            <History size={13} />
            <span>Recent Table Dares ({history.length})</span>
          </div>

          <div className="space-y-1.5">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-surface-soft border border-border-light text-xs text-text-primary flex items-center gap-2"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: h.color || "#EF4444" }}
                />
                <span className="truncate">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
