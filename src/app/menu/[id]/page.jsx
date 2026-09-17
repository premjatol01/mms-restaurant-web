"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMenuOrder } from "@/context/Menuordercontext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import TableSession from "./pages/TableSession";
import OffersRewards from "./pages/OffersRewards";
import Rating from "./pages/Rating";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const { activeTab } = useMenuOrder();
  // const tableId = searchParams.get("table"); // Use this if needed

  return (
    <>
      {activeTab === "Home" ? (
        <Home />
      ) : activeTab === "Menu" ? (
        <Menu />
      ) : activeTab === "Offers" ? (
        <OffersRewards />
      ) : activeTab === "Table" ? (
        <TableSession />
      ) : activeTab === "Rating" ? (
        <Rating />
      ) :(
        "Nothing to show for this tab."
      )}
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-primary">
          Loading...
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
