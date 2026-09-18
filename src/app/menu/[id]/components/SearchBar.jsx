"use client";

import { useMenuOrder } from "@/store/menuOrderStore";
import { Search, X } from "lucide-react";
import React from "react";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useMenuOrder();

  return (
    <div className="relative mb-2">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={20} className="text-text-muted" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search dishes, drinks..."
        className="w-full bg-surface border border-border rounded-lg py-3.5 pl-11 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all shadow-sm"
      />
      {searchQuery && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}