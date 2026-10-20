"use client";

import React from "react";
import Link from "next/link";
import {
  QrCode,
  AlertCircle,
  Search,
  Clock,
  AlertTriangle,
  RotateCcw,
  Globe,
  Home,
  Utensils
} from "lucide-react";

export default function TableSessionError({ error, subdomain, tableId, onRetry }) {
  const errorType = error?.errorType || "VERIFICATION_FAILED";
  const message = error?.message || "We could not verify your table session.";

  // Tailored configurations based on error type
  const config = {
    TABLE_NOT_FOUND: {
      icon: QrCode,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50",
      badge: "404 • Invalid Table",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      title: "Table Not Found",
      suggestion: "The table number or ID scanned does not exist in this restaurant's system. Please scan the QR code located on your table."
    },
    TABLE_INACTIVE: {
      icon: AlertCircle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50",
      badge: "403 • Table Inactive",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
      title: "Table Currently Inactive",
      suggestion: "This table has been set to inactive and is not accepting orders at this time. Please ask your server or restaurant staff for assistance."
    },
    RESTAURANT_NOT_FOUND: {
      icon: Search,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50",
      badge: "404 • Restaurant Not Found",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
      title: "Restaurant Not Found",
      suggestion: "We couldn't locate an active restaurant for this web address or QR code. The restaurant may not exist or its subdomain may have changed."
    },
    RESTAURANT_INACTIVE: {
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50",
      badge: "Unavailable • Closed",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      title: "Restaurant Unavailable",
      suggestion: "This restaurant is currently inactive and is not taking orders right now. Please check back later."
    },
    DEFAULT: {
      icon: AlertTriangle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50",
      badge: "Verification Error",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
      title: "Verification Failed",
      suggestion: "Unable to complete table verification. Please ensure you are connected to the internet and try again."
    }
  };

  const activeConfig = config[errorType] || config.DEFAULT;
  const IconComponent = activeConfig.icon;

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#2b2118] flex flex-col justify-between p-4 sm:p-6">
      {/* Top Brand Header */}
      <header className="max-w-md mx-auto w-full py-3 flex items-center justify-between border-b border-[#ede4dc]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#d9480f] flex items-center justify-center text-white font-bold shadow-md shadow-[#d9480f]/20">
            <Utensils className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-base text-[#2b2118] tracking-tight">Tablly Order Portal</span>
        </div>
        {subdomain && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-[#ede4dc] text-[#786154]">
            {subdomain}
          </span>
        )}
      </header>

      {/* Main Error Card */}
      <main className="max-w-md mx-auto w-full py-8 space-y-6 text-center">
        {/* Animated Icon Container */}
        <div className="relative inline-flex items-center justify-center">
          <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center ${activeConfig.iconBg} ${activeConfig.iconColor} shadow-lg shadow-[#d9480f]/5`}>
            <IconComponent className="w-10 h-10 animate-pulse" />
          </div>
        </div>

        {/* Status Badge & Title */}
        <div className="space-y-2">
          <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${activeConfig.badgeColor}`}>
            {activeConfig.badge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2b2118] tracking-tight">
            {activeConfig.title}
          </h1>
          <p className="text-sm text-[#4a3b32] leading-relaxed font-medium">
            {message}
          </p>
          <p className="text-xs text-[#786154] leading-relaxed pt-1">
            {activeConfig.suggestion}
          </p>
        </div>

        {/* Diagnostic Session Info */}
        <div className="bg-white border border-[#ede4dc] rounded-xl p-3.5 text-left text-xs space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center text-[#786154]">
            <span>Restaurant Subdomain:</span>
            <span className="font-mono text-[#2b2118] font-semibold">{subdomain || "—"}</span>
          </div>
          <div className="flex justify-between items-center text-[#786154]">
            <span>Table Identifier:</span>
            <span className="font-mono text-[#2b2118] font-semibold">{tableId || "—"}</span>
          </div>
          <div className="flex justify-between items-center text-[#786154]">
            <span>Verification Status:</span>
            <span className="text-rose-600 font-medium">Failed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-bold text-sm transition-all shadow-lg shadow-[#d9480f]/25 hover:shadow-[#d9480f]/40 active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Verification</span>
            </button>
          )}

          {subdomain && (
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#fff4e6] border border-[#d9480f]/35 text-[#d9480f] font-semibold text-sm transition-colors shadow-sm"
            >
              <Globe className="w-4 h-4 text-[#d9480f]" />
              <span>Visit Restaurant Website</span>
            </Link>
          )}

          <a
            href="http://localhost:3000"
            className="inline-flex items-center gap-1.5 text-xs text-[#786154] hover:text-[#d9480f] transition-colors pt-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Tablly Homepage</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-[#9c887e] py-3 border-t border-[#ede4dc]">
        &copy; {new Date().getFullYear()} Tablly Order Portal • Dine-in Experience
      </footer>
    </div>
  );
}
