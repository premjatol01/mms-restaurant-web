"use client";

import { useMenuOrder } from "@/store/menuOrderStore";
import React, { useMemo } from "react";
import SearchBar from "../components/SearchBar";
import PageHeader from "@/components/menuComp/PageHeader";
import { motion } from "framer-motion";
import { UtensilsCrossed, SearchX, Star } from "lucide-react";
import EmptyState from "@/components/menuComp/EmptyState";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import FloatingCartBar from "../components/FloatingCartBar";

export default function AllCategories() {
  const {
    categories,
    setActiveTab,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    getItemsByCategory,
  } = useMenuOrder();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category.id);
    setActiveTab("Menu");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", "menu");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handleBack = () => {
    setActiveTab("Menu");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", "menu");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const q = (searchQuery || "").trim().toLowerCase();
  const list = useMemo(() => {
    const all = categories || [];
    if (!q) return all;
    return all.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
    );
  }, [categories, q]);

  return (
    <div className="px-4 pt-4 pb-28">
      <PageHeader
        title="All Categories"
        subtitle="Explore our full menu selection"
        showBack={true}
        onBack={handleBack}
        trailing={
          <span className="text-[11px] font-semibold text-text-muted bg-surface-soft px-2.5 py-1 rounded-full">
            {list.length} {list.length === 1 ? "category" : "categories"}
          </span>
        }
      />

      <SearchBar />

      <div className="mt-4">
        {list.length === 0 ? (
          q ? (
            <EmptyState
              icon={SearchX}
              title="No categories found"
              description={`No category matches "${searchQuery}". Try a different keyword.`}
              actionLabel="Clear search"
              onAction={() => setSearchQuery("")}
            />
          ) : (
            <EmptyState
              icon={UtensilsCrossed}
              title="No categories available"
              description="The restaurant has not listed any active categories yet."
            />
          )
        ) : (
          /* Grid */
          <div className="grid grid-cols-3 gap-y-5 gap-x-3 mt-2">
            {list.map((category, index) => {
              const itemCount =
                category.itemCount ??
                getItemsByCategory?.(category.id)?.length ??
                0;

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleCategoryClick(category)}
                  className="flex flex-col items-center group p-1.5 rounded-2xl hover:bg-surface-soft/60 transition-colors"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-2 border border-border-light group-hover:border-primary/40 transition-colors shadow-sm bg-surface-soft flex items-center justify-center">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-3xl select-none">
                        {category.emoji || "🍽️"}
                      </span>
                    )}
                    {category.isTopCategory && (
                      <span
                        className="absolute top-1.5 right-1.5 bg-amber-500 text-white p-1 rounded-full shadow-sm"
                        title="Top Category"
                      >
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] font-bold text-text-primary text-center leading-tight line-clamp-1 w-full">
                    {category.name}
                  </span>
                  <span className="text-[10px] text-text-muted mt-0.5">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <FloatingCartBar />
    </div>
  );
}