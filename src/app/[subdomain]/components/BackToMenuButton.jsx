"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Utensils } from "lucide-react";
import { useMenuOrderStore } from "@/store/menuOrderStore";

export default function BackToMenuButton({ subdomain }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fromMenu = searchParams?.get("from") === "menu";
  const tableParam = searchParams?.get("table");

  // Read stored table details from persistent store if available
  const verifiedTable = useMenuOrderStore((s) => s.verifiedTable);
  const storeTableId = useMenuOrderStore((s) => s.tableId);
  const tableSession = useMenuOrderStore((s) => s.tableSession);

  const activeTable = tableParam || verifiedTable?.id || verifiedTable?.tableName || storeTableId || tableSession?.tableId;

  // Render only if user came from menu portal or has an active table session
  if (!mounted || (!fromMenu && !activeTable)) {
    return null;
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      const isPathMode = typeof window !== "undefined" && window.location.pathname.startsWith(`/${subdomain}`);
      const targetTable = activeTable || "preview";
      const targetUrl = isPathMode ? `/${subdomain}/menu/${targetTable}` : `/menu/${targetTable}`;
      router.push(targetUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#d9480f] hover:bg-[#c93b07] text-white shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
      title="Return to Table Order Portal"
    >
      <ArrowLeft size={14} strokeWidth={2.5} />
      <span>Back to Menu</span>
    </button>
  );
}
