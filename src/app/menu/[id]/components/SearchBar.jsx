"use client";

import { useMenuOrder } from "@/store/menuOrderStore";
import { Search, X } from "lucide-react";
import React from "react";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useMenuOrder();

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={18} className="text-text-muted" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search dishes, drinks..."
        className="w-full bg-surface-soft border border-transparent rounded-2xl py-3.5 pl-11 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-surface focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
      />
      {searchQuery && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary active:scale-90 transition-transform"
        >
          <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center">
            <X size={14} />
          </div>
        </button>
      )}
    </div>
  );
}