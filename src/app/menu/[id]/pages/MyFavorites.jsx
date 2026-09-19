"use client";

import React, { useMemo } from "react";
import { Heart } from "lucide-react";
import { menuItems } from "@/data/menuItems";
import { useMenuOrder } from "@/store/menuOrderStore";
import FoodCard from "@/components/menuComp/FoodCard";
import PageHeader from "@/components/menuComp/PageHeader";
import EmptyState from "@/components/menuComp/EmptyState";

const MyFavorites = () => {
  const { favorites, setActiveTab } = useMenuOrder();

  const favoriteItems = useMemo(
    () => menuItems.filter((item) => favorites.includes(item.id)),
    [favorites]
  );

  return (
    <div className="px-4 pt-4 pb-28">
      <PageHeader
        title="My Favorites"
        subtitle={`${favoriteItems.length} saved ${
          favoriteItems.length === 1 ? "dish" : "dishes"
        }`}
      />

      {favoriteItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          tone="danger"
          title="No favorites yet"
          description="Tap the heart on any dish to save it here for your next order."
          actionLabel="Explore menu"
          onAction={() => setActiveTab("Menu")}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favoriteItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;