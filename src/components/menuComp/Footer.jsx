"use client";

import React from "react";
import { Home, Utensils, Tag, CreditCard } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

const navItems = [
  { name: "Home", icon: Home },
  { name: "Menu", icon: Utensils },
  { name: "Offers", icon: Tag },
  { name: "Table", icon: CreditCard },
];

export default function Footer() {
  const { activeTab, setActiveTab } = useMenuOrder();

  return (
    <footer className="bg-surface/90 backdrop-blur-xl border-t border-border-light pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto px-4 h-16">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              aria-label={item.name}
              className="group relative flex items-center justify-center w-12 h-12 outline-none"
            >
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-success-light scale-100"
                    : "scale-50 opacity-0 group-hover:bg-surface-soft group-hover:scale-90 group-hover:opacity-100"
                }`}
              />

              <div
                className={`relative z-10 transition-transform duration-300 ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-text-muted group-hover:text-text-secondary"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span
                className={`absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </footer>
  );
}