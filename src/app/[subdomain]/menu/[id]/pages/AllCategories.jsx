"use client";

import { categoryItems } from "@/data/menuItems";
import { useMenuOrder } from "@/store/menuOrderStore";
import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchBar from "../components/SearchBar";
import { motion } from "framer-motion";

export default function AllCategories() {
  const { setActiveTab } = useMenuOrder();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryClick = (categoryName) => {
    setActiveTab("Menu");

    const params = new URLSearchParams(searchParams.toString());
    const formattedCategory = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-");
    params.set("category", formattedCategory);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="px-4 pt-4 pb-28">
      <SearchBar />

      {/* Header */}
      <div className="flex items-end justify-between mt-5 mb-4">
        <div>
          <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
            What are you craving?
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Pick a category to explore
          </p>
        </div>
        <span className="text-[11px] font-semibold text-text-muted bg-surface-soft px-2.5 py-1 rounded-full">
          {categoryItems.length} categories
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-y-6 gap-x-3">
        {categoryItems.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleCategoryClick(category.name)}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-full overflow-hidden mb-2.5 border-2 border-border-light group-hover:border-primary/40 transition-colors shadow-sm">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-[12px] font-bold text-text-primary text-center leading-tight line-clamp-2">
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}