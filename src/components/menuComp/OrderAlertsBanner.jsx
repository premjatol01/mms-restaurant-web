"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellRing, CheckCircle2, X, ChefHat, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { 
  isNotificationSupported, 
  getCustomerNotificationPermission, 
  requestCustomerNotificationPermission, 
  registerCustomerServiceWorker,
  dispatchCustomerNotification
} from "@/utils/customerNotification";

export default function OrderAlertsBanner({ tableName = "your table" }) {
  const [permission, setPermission] = useState("denied");
  const [dismissed, setDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Check initial permission
    if (isNotificationSupported()) {
      setPermission(getCustomerNotificationPermission());
      registerCustomerServiceWorker();
    }

    const wasDismissed = sessionStorage.getItem("tablly_customer_alerts_dismissed");
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleEnableAlerts = async () => {
    setIsRequesting(true);
    try {
      const perm = await requestCustomerNotificationPermission();
      setPermission(perm);

      if (perm === "granted") {
        toast.success("Phone notifications enabled!");
        dispatchCustomerNotification({
          title: "🔔 Order Alerts Active!",
          body: `We will notify your phone screen when food is cooking and served at ${tableName}.`,
        });
      } else if (perm === "denied") {
        toast.info("Notifications were blocked in your browser settings.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("tablly_customer_alerts_dismissed", "true");
  };

  if (!isNotificationSupported() || dismissed || permission === "denied") {
    return null;
  }

  // Already granted state
  if (permission === "granted") {
    return (
      <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>Live order popups are active on this phone</span>
        </div>
      </div>
    );
  }

  // Permission is 'default' - Prompt customer
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/5 border border-primary/25 p-4 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
            <BellRing size={20} className="animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--color-text,#1a1a1a)] leading-tight">
              Get Live Order Alerts on Screen?
            </h4>
            <p className="text-xs text-[var(--color-text-secondary,#666)] mt-1 leading-relaxed">
              Lock your phone or switch apps! We'll pop up an alert when the Chef starts cooking and when food arrives at <strong>{tableName}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-3 pt-2.5 border-t border-primary/15">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          Not now
        </button>
        <button
          onClick={handleEnableAlerts}
          disabled={isRequesting}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[var(--color-primary-hover,#e03131)] transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Bell size={13} />
          <span>{isRequesting ? "Enabling..." : "Enable Screen Alerts"}</span>
        </button>
      </div>
    </div>
  );
}
