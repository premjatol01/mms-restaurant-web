"use client";

import React from "react";
import { Home, Utensils, Tag, CreditCard } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", icon: Home },
  { name: "Menu", icon: Utensils },
  { name: "Offers", icon: Tag },
  { name: "Table", icon: CreditCard },
];

export default function Footer() {
  const { activeTab, setActiveTab } = useMenuOrder();

  return (
    <footer className="bg-surface/95 backdrop-blur-xl border-t border-border-light pb-safe">
      <div className="relative flex items-center justify-around max-w-md mx-auto px-2 h-[64px]">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              aria-label={item.name}
              className="relative flex flex-col items-center justify-center gap-1 w-16 h-full"
            >
              {isActive && (
                <motion.span
                  layoutId="activeTabBar"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-text-muted"
                }`}
              />
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-text-muted"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}