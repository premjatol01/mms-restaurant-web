"use client";

import React, { useState } from "react";
import { Wifi, Copy, Check, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function GuestWifiCard() {
  const { verifiedRestaurant } = useMenuOrder();
  const [copied, setCopied] = useState(false);

  const wifi = verifiedRestaurant?.portalSettings?.wifiSharing;

  // Only render if enabled and credentials provided
  if (!wifi || wifi.enabled === false) return null;
  if (!wifi.ssid && !wifi.password) return null;

  const handleCopyPassword = () => {
    if (!wifi.password) return;
    navigator.clipboard.writeText(wifi.password);
    setCopied(true);
    toast.success("Wi-Fi password copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-3.5 border border-blue-200/60 dark:border-blue-900/40 shadow-xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Wifi size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Free Guest Wi-Fi
            </span>
            {wifi.security && (
              <span className="text-[9px] font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-1.5 py-0.2 rounded">
                {wifi.security}
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-text-primary truncate mt-0.5">
            {wifi.ssid || "Guest Wi-Fi"}
          </p>
          {wifi.password && (
            <p className="text-[11px] font-mono text-text-muted truncate">
              Pass: <span className="font-semibold text-text-primary">{wifi.password}</span>
            </p>
          )}
        </div>
      </div>

      {wifi.password && (
        <button
          type="button"
          onClick={handleCopyPassword}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-surface text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900 text-xs font-bold shadow-2xs hover:bg-blue-50 transition-colors cursor-pointer active:scale-95"
          title="Copy Wi-Fi Password"
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-600" />
              <span className="text-green-600">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

