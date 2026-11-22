"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, MapPin } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { motion, AnimatePresence } from "framer-motion";
import { formatTableName, formatShortTableLabel } from "@/utils/formatTableName";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Header() {
  const { totalItems, favorites, tableId, tableName, setActiveTab, verifiedRestaurant, verifiedTable } = useMenuOrder();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const subdomain = params?.subdomain || verifiedRestaurant?.subdomain || "";
  const currentTable = params?.id || tableId || verifiedTable?.id || "";

  // Calculate restaurant website URL
  // In path mode (/spicegarden/menu/table-1) -> /spicegarden
  // In subdomain mode (spicegarden.tablly.com/menu/table-1) -> /
  const isPathMode = typeof window !== "undefined" && window.location.pathname.startsWith(`/${subdomain}`);
  const baseWebsitePath = isPathMode ? `/${subdomain}` : "/";
  const websiteUrl = `${baseWebsitePath}${currentTable ? `?from=menu&table=${encodeURIComponent(currentTable)}` : "?from=menu"}`;

  const handleNav = (tab) => {
    setActiveTab(tab);
    if (pathname) {
      const newParams = new URLSearchParams(searchParams?.toString() || "");
      newParams.set("tab", tab.toLowerCase());
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  };

  const restaurantName = verifiedRestaurant?.name || "Restaurant";
  const initials = restaurantName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TB";

  const rawTable = verifiedTable?.tableName || verifiedTable?.tableNo || verifiedTable?.name || (tableName && tableName.length !== 24 ? tableName : null);
  const displayTable = formatTableName(rawTable, "");
  const shortTable = formatShortTableLabel(rawTable, verifiedTable?.label);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 max-w-md mx-auto bg-surface/95 backdrop-blur-xl border-b border-border-light">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Brand / Logo (Click to visit restaurant website) */}
        <Link
          href={websiteUrl}
          title={`Visit ${restaurantName} website`}
          className="flex items-center gap-3 min-w-0 group cursor-pointer active:scale-95 transition-all text-left"
        >
          {verifiedRestaurant?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                verifiedRestaurant.logo.startsWith("http://") || verifiedRestaurant.logo.startsWith("https://")
                  ? verifiedRestaurant.logo
                  : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${verifiedRestaurant.logo.startsWith("/") ? verifiedRestaurant.logo : `/${verifiedRestaurant.logo}`}`
              }
              alt={restaurantName}
              className="w-11 h-11 rounded-2xl object-cover border border-border-light shadow-sm shrink-0 group-hover:border-primary/50 transition-colors"
            />
          ) : (
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center text-text-on-primary font-bold text-lg shadow-lg shadow-primary/20 shrink-0 group-hover:opacity-95 transition-opacity">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-text-primary font-bold text-[15px] leading-tight truncate group-hover:text-primary transition-colors">
              {restaurantName}
            </h1>
            <p className="text-text-muted text-[11px] font-medium truncate">
              Dine-in Order Portal
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Table Badge in Short format (e.g. T-1, T-2) */}
          {shortTable && (
            <div
              className="flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-black px-2.5 py-1.5 rounded-xl border border-primary/25 tracking-wider shadow-2xs"
              title={displayTable || shortTable}
            >
              <MapPin size={12} strokeWidth={2.5} />
              <span>{shortTable}</span>
            </div>
          )}

          {/* Favorites */}
          <button
            onClick={() => handleNav("Favorites")}
            className="relative w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center text-text-secondary active:scale-95 transition-transform"
            aria-label="Favorites"
          >
            <Heart size={18} />
            <AnimatePresence>
              {favorites.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface"
                >
                  {favorites.length}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Cart */}
          <button
            onClick={() => handleNav("Cart")}
            className="relative w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center text-text-secondary active:scale-95 transition-transform"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-cart-badge text-text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
}