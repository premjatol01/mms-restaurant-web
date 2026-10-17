"use client";

import React, { useMemo } from "react";
import FoodCard from "@/components/menuComp/FoodCard";
import EmptyState from "@/components/menuComp/EmptyState";
import { SearchX, UtensilsCrossed } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function TopCategoriesItems() {
  const {
    searchQuery,
    selectedCategoryId,
    setSearchQuery,
    menuItems,
    categories,
    menuLoading,
  } = useMenuOrder();

  // Search Results view when search query is active
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return (menuItems || []).filter((item) => {
      const title = (item.title || item.name || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [searchQuery, menuItems]);

  // Loading skeleton
  if (menuLoading && (!menuItems || menuItems.length === 0)) {
    return (
      <div className="space-y-6">
        {[1, 2].map((catIndex) => (
          <div key={catIndex} className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-border-light/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-surface-soft rounded-lg animate-pulse" />
                <div className="h-5 w-28 bg-surface-soft rounded-lg animate-pulse" />
              </div>
              <div className="h-5 w-14 bg-surface-soft rounded-full animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((itemIndex) => (
                <div
                  key={itemIndex}
                  className="bg-surface rounded-2xl p-3 border border-border-light space-y-2.5 animate-pulse"
                >
                  <div className="w-full aspect-[4/3] bg-surface-soft rounded-xl" />
                  <div className="h-4 bg-surface-soft rounded w-3/4" />
                  <div className="h-3 bg-surface-soft rounded w-1/2" />
                  <div className="h-8 bg-surface-soft rounded-xl w-full mt-2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If user searched for something
  if (searchResults !== null) {
    return (
      <section className="space-y-3">
        <div className="flex items-end justify-between pb-1 border-b border-border-light/60">
          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-text-primary">
              Search Results
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {searchResults.length} {searchResults.length === 1 ? "dish" : "dishes"}
          </span>
        </div>

        {searchResults.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No dishes found"
            description={`No dishes match "${searchQuery}". Try searching for something else.`}
            actionLabel="Clear search"
            onAction={() => setSearchQuery("")}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {searchResults.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    );
  }

  // Top categories: prioritize categories marked as isTopCategory by admin
  const topOnly = (categories || []).filter((c) => Boolean(c.isTopCategory));
  const topCategories =
    topOnly.length > 0 ? topOnly.slice(0, 5) : (categories || []).slice(0, 5);
  const displayCategories = [...topCategories];

  // If the user actively selected a category beyond top categories (e.g. from AllCategories), include it as well
  if (
    selectedCategoryId &&
    !topCategories.some((c) => String(c.id) === String(selectedCategoryId))
  ) {
    const extra = (categories || []).find(
      (c) => String(c.id) === String(selectedCategoryId)
    );
    if (extra) {
      displayCategories.push(extra);
    }
  }

  // Map each category to its active items
  const categoriesWithItems = displayCategories
    .map((cat) => {
      const items = (menuItems || []).filter(
        (i) => String(i.categoryId) === String(cat.id)
      );
      return { ...cat, items };
    })
    .filter((cat) => cat.items.length > 0);

  // Check for any uncategorized items
  const uncategorizedItems = (menuItems || []).filter(
    (i) => !i.categoryId || i.categoryId === ""
  );

  const hasAnyItems =
    categoriesWithItems.length > 0 || uncategorizedItems.length > 0;

  if (!hasAnyItems) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="Menu is being prepared"
        description="The restaurant has not listed any dishes yet. Please check back soon!"
      />
    );
  }

  return (
    <div className="space-y-7">
      {categoriesWithItems.map((cat) => (
        <section
          key={cat.id}
          id={`category-section-${cat.id}`}
          className="scroll-mt-24 space-y-3"
        >
          {/* Category Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-border-light/60">
            <div className="flex items-center gap-2">
              <span className="text-xl select-none">{cat.emoji || "🍽️"}</span>
              <div>
                <h2 className="text-[17px] font-bold tracking-tight text-text-primary">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
              {cat.items.length} {cat.items.length === 1 ? "dish" : "dishes"}
            </span>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-2 gap-3">
            {cat.items.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}

      {/* Uncategorized items section if any */}
      {uncategorizedItems.length > 0 && (
        <section
          id="category-section-uncategorized"
          className="scroll-mt-24 space-y-3"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-border-light/60">
            <div className="flex items-center gap-2">
              <span className="text-xl select-none">✨</span>
              <h2 className="text-[17px] font-bold tracking-tight text-text-primary">
                More Dishes
              </h2>
            </div>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
              {uncategorizedItems.length}{" "}
              {uncategorizedItems.length === 1 ? "dish" : "dishes"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {uncategorizedItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
