"use client";

import React from "react";
import { Wrench, Sparkles, RefreshCw, ShieldCheck, Clock } from "lucide-react";

export default function MaintenanceScreen({
  message = "We are currently performing scheduled maintenance to improve our systems. Tablly will be back shortly!",
  platformName = "Tablly",
  logoUrl = null,
}) {
  const handleRefresh = () => {
    window.location.reload();
  };

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  const fullLogoUrl = logoUrl ? (logoUrl.startsWith("http") ? logoUrl : `${API_BASE}${logoUrl}`) : null;

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#2b2118] flex flex-col justify-between p-4 sm:p-6 selection:bg-[#d9480f]/20">
      {/* Top Header */}
      <header className="max-w-2xl mx-auto w-full py-4 flex items-center justify-between border-b border-[#ede4dc]">
        <div className="flex items-center gap-2.5">
          {fullLogoUrl ? (
            <img src={fullLogoUrl} alt={platformName} className="h-8 w-auto object-contain rounded" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#d9480f] flex items-center justify-center text-white font-bold shadow-md shadow-[#d9480f]/20">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          <span className="font-bold text-lg text-[#2b2118] tracking-tight">{platformName}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-100 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Maintenance Mode</span>
        </div>
      </header>

      {/* Main Center Card */}
      <main className="max-w-xl mx-auto w-full text-center space-y-6 py-12 px-4">
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xl shadow-amber-500/10">
            <Wrench className="w-12 h-12 stroke-[2.2] animate-bounce" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#d9480f] text-white flex items-center justify-center shadow-md">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-[#2b2118] tracking-tight">
            We'll Be Back Shortly!
          </h1>
          <p className="text-base text-[#6b584d] max-w-md mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {/* Feature status strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left pt-2">
          <div className="p-3.5 rounded-xl bg-white border border-[#ede4dc] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2b2118]">Data & Orders Safe</p>
              <p className="text-[11px] text-[#786154]">All records securely preserved</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#ede4dc] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2b2118]">Resuming Soon</p>
              <p className="text-[11px] text-[#786154]">Updates in active deployment</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-semibold text-sm transition-all shadow-lg shadow-[#d9480f]/25 hover:shadow-[#d9480f]/40 hover:-translate-y-0.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Again</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#9c887e] py-4">
        &copy; {new Date().getFullYear()} {platformName}. All rights reserved.
      </footer>
    </div>
  );
}
