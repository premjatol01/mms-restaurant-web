"use client";

import React, { useState, useMemo } from "react";
import { Utensils, UtensilsCrossed, Star, Flame, Sparkles } from "lucide-react";

export default function PopularMenuSection({
  menuSection,
  popularCategories = [],
  fallbackItems = [],
}) {
  // Determine if we have categories with items
  const validCategories = useMemo(() => {
    return (popularCategories || []).filter((cat) => cat && cat.name);
  }, [popularCategories]);

  // Active category selection: default to first category that has items, or the first category
  const [activeCategoryId, setActiveCategoryId] = useState(() => {
    if (validCategories.length > 0) {
      const withItems = validCategories.find((c) => Array.isArray(c.items) && c.items.length > 0);
      return (withItems || validCategories[0])._id || (withItems || validCategories[0]).id;
    }
    return null;
  });

  // Current active category
  const activeCategory = useMemo(() => {
    if (!activeCategoryId) return validCategories[0] || null;
    return validCategories.find(
      (c) => (c._id && c._id.toString() === activeCategoryId.toString()) ||
             (c.id && c.id.toString() === activeCategoryId.toString())
    ) || validCategories[0] || null;
  }, [validCategories, activeCategoryId]);

  // Current active items (from active category or fallback to fallbackItems)
  const displayItems = useMemo(() => {
    if (activeCategory && Array.isArray(activeCategory.items) && activeCategory.items.length > 0) {
      return activeCategory.items;
    }
    if (validCategories.length === 0 && Array.isArray(fallbackItems) && fallbackItems.length > 0) {
      return fallbackItems;
    }
    return activeCategory?.items || [];
  }, [activeCategory, validCategories, fallbackItems]);

  const getItemImageUrl = (image) => {
    if (!image || typeof image !== "string") return null;
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
      return image;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const baseUrl = apiUrl.replace(/\/api\/?$/, "");
    return `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  return (
    <section
      id="menu"
      style={{ borderColor: "var(--theme-border)" }}
      className="py-16 border-t"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span
              style={{
                backgroundColor: "var(--theme-primary-soft)",
                color: "var(--theme-primary)",
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Chef's Recommendations</span>
            </span>
            <h3
              style={{ color: "var(--theme-text)" }}
              className="text-2xl font-bold"
            >
              {menuSection?.content?.title || "Popular Dishes"}
            </h3>
            <p
              style={{ color: "var(--theme-text-muted)" }}
              className="text-xs sm:text-sm mt-1"
            >
              {menuSection?.content?.description || "Our most loved dishes, picked by our guests"}
            </p>
          </div>

          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border shrink-0"
            style={{
              backgroundColor: "var(--theme-surface)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-text-muted)",
            }}
          >
            <span>Scan table QR to order</span>
          </div>
        </div>

        {/* Category Pills / Tabs (When 2 or more categories exist) */}
        {validCategories.length > 1 && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {validCategories.map((category) => {
              const catId = category._id || category.id;
              const isActive =
                activeCategory &&
                ((activeCategory._id && activeCategory._id.toString() === catId.toString()) ||
                 (activeCategory.id && activeCategory.id.toString() === catId.toString()));
              const itemCount = category.items?.length || 0;

              return (
                <button
                  key={catId}
                  type="button"
                  onClick={() => setActiveCategoryId(catId)}
                  style={{
                    backgroundColor: isActive ? "var(--theme-primary)" : "var(--theme-surface)",
                    color: isActive ? "var(--theme-primary-text)" : "var(--theme-text)",
                    borderColor: isActive ? "var(--theme-primary)" : "var(--theme-border)",
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 shrink-0 shadow-sm active:scale-95 ${
                    isActive ? "shadow-md ring-2 ring-[var(--theme-primary)]/30" : "hover:border-[var(--theme-primary)]"
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.22)" : "var(--theme-surface-soft)",
                      color: isActive ? "inherit" : "var(--theme-text-muted)",
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-full font-bold"
                  >
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Category Description (if provided) */}
        {activeCategory?.description && validCategories.length > 1 && (
          <p
            style={{ color: "var(--theme-text-muted)" }}
            className="text-xs sm:text-sm mb-6 -mt-2"
          >
            {activeCategory.description}
          </p>
        )}

        {/* Dishes Grid */}
        {displayItems && displayItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayItems.map((item) => {
              const imageUrl = getItemImageUrl(item.image);

              return (
                <div
                  key={item._id || item.id}
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    borderColor: "var(--theme-border)",
                  }}
                  className="rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 duration-200"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-black/5 overflow-hidden">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Utensils className="w-10 h-10 opacity-30" />
                        </div>
                      )}

                      {/* Food Type Indicator (Veg / Egg / Non-veg) */}
                      {item.foodType && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-sm">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              item.foodType === "veg"
                                ? "bg-green-600"
                                : item.foodType === "egg"
                                ? "bg-amber-500"
                                : "bg-red-600"
                            }`}
                          />
                        </div>
                      )}

                      {/* Popular / Bestseller Badge */}
                      {(item.isBestseller || item.isPopular) && (
                        <span
                          style={{
                            backgroundColor: "var(--theme-primary)",
                            color: "var(--theme-primary-text)",
                          }}
                          className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1"
                        >
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{item.isBestseller ? "Bestseller" : "Popular"}</span>
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h4
                        style={{ color: "var(--theme-text)" }}
                        className="font-bold text-sm sm:text-base line-clamp-1"
                      >
                        {item.name}
                      </h4>
                      {item.description && (
                        <p
                          style={{ color: "var(--theme-text-muted)" }}
                          className="text-xs mt-1 line-clamp-2 leading-relaxed"
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div
                      className="pt-3 border-t flex items-center justify-between"
                      style={{ borderColor: "var(--theme-border-subtle)" }}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span
                          style={{ color: "var(--theme-primary)" }}
                          className="text-base sm:text-lg font-bold"
                        >
                          ₹{item.price}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span
                            className="text-xs line-through"
                            style={{ color: "var(--theme-text-faint)" }}
                          >
                            ₹{item.mrp}
                          </span>
                        )}
                      </div>

                      <span
                        style={{ color: "var(--theme-text-faint)" }}
                        className="text-[11px] font-medium"
                      >
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "var(--theme-surface)",
              borderColor: "var(--theme-border)",
            }}
            className="p-10 rounded-2xl border text-center space-y-3"
          >
            <Utensils className="w-8 h-8 mx-auto text-slate-300 opacity-60" />
            <p style={{ color: "var(--theme-text)" }} className="text-sm font-semibold">
              {activeCategory ? `No dishes found under "${activeCategory.name}"` : "No popular dishes listed"}
            </p>
            <p style={{ color: "var(--theme-text-muted)" }} className="text-xs max-w-sm mx-auto">
              Explore our full menu, dishes and drinks by scanning the QR code at your table.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
