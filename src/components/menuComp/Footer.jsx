"use client";

import React from "react";
import { Home, Utensils, Tag, CreditCard } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", icon: Home },
  { name: "Menu", icon: Utensils },
  { name: "Offers", icon: Tag },
  { name: "Table", icon: CreditCard },
];

export default function Footer() {
  const { activeTab, setActiveTab } = useMenuOrder();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabClick = (name) => {
    // Update store immediately for instant UI response
    setActiveTab(name);
    // Push the new URL so refresh / back-button works
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", name.toLowerCase());
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-surface/95 backdrop-blur-xl border-t border-border-light pb-safe">
      <div className="relative flex items-center justify-around max-w-md mx-auto px-2 h-[64px]">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => handleTabClick(item.name)}
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