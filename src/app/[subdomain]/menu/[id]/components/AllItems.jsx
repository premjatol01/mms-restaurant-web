"use client";

import FoodCard from "@/components/menuComp/FoodCard";
import EmptyState from "@/components/menuComp/EmptyState";
import { SearchX } from "lucide-react";
import React, { useMemo } from "react";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function AllItems() {
  const {
    searchQuery,
    selectedCategoryId,
    setSearchQuery,
    menuItems,
    categories,
    menuLoading,
  } = useMenuOrder();

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (menuItems || []).filter((item) => {
      const title = (item.title || item.name || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const matchesQuery = !q || title.includes(q) || desc.includes(q);
      const matchesCategory =
        q || !selectedCategoryId
          ? true
          : String(item.categoryId) === String(selectedCategoryId);
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategoryId, menuItems]);

  const categoryName =
    (categories || []).find(
      (c) => String(c.id) === String(selectedCategoryId)
    )?.name ?? "Menu";

  if (menuLoading && (!menuItems || menuItems.length === 0)) {
    return (
      <section>
        <div className="flex items-end justify-between mb-3">
          <div className="h-5 w-28 bg-surface-soft rounded-lg animate-pulse" />
          <div className="h-5 w-14 bg-surface-soft rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-surface rounded-2xl p-3 border border-border-light space-y-2.5 animate-pulse"
            >
              <div className="w-full aspect-[4/3] bg-surface-soft rounded-xl" />
              <div className="h-4 bg-surface-soft rounded w-3/4" />
              <div className="h-3 bg-surface-soft rounded w-1/2" />
              <div className="h-8 bg-surface-soft rounded-xl w-full mt-2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight text-text-primary">
            {searchQuery ? "Search Results" : categoryName}
          </h2>
          {searchQuery && (
            <p className="text-xs text-text-muted mt-0.5">
              for "{searchQuery}"
            </p>
          )}
        </div>
        <span className="text-[11px] font-semibold text-text-muted bg-surface-soft px-2.5 py-1 rounded-full">
          {visible.length} {visible.length === 1 ? "item" : "items"}
        </span>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Nothing here yet"
          description={
            searchQuery
              ? `No dishes match "${searchQuery}". Try a different search.`
              : `${categoryName} doesn't have any items on the menu right now.`
          }
          actionLabel={searchQuery ? "Clear search" : undefined}
          onAction={searchQuery ? () => setSearchQuery("") : undefined}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {visible.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}