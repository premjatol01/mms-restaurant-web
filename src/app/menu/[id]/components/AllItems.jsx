"use client";

import FoodCard from "@/components/menuComp/FoodCard";
import EmptyState from "@/components/menuComp/EmptyState";
import { SearchX } from "lucide-react";
import React, { useMemo } from "react";
import { menuItems, categories } from "@/data/menuItems";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function AllItems() {
  const { searchQuery, selectedCategoryId, setSearchQuery } = useMenuOrder();

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      // When searching, ignore the category filter so results aren't hidden.
      const matchesCategory = q ? true : item.categoryId === selectedCategoryId;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategoryId]);

  const categoryName =
    categories.find((c) => c.id === selectedCategoryId)?.name ?? "this category";

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <h2 className="text-base font-bold tracking-tight text-text-primary">
          {searchQuery ? "Search Results" : categoryName}
        </h2>
        <span className="text-xs text-text-muted">
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
    </div>
  );
}
