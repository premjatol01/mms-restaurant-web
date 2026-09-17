"use client";

import React, { useState } from "react";
import Footer from "@/components/menuComp/Footer";
import Header from "@/components/menuComp/Header";
import { MenuOrderProvider } from "@/context/Menuordercontext";
import UnlockOffersModal from "./[id]/modals/UnlockOffersModal";

export default function MenuLayout({ children }) {
  return (
    <MenuOrderProvider>
      <div className="relative max-w-md mx-auto bg-background flex flex-col h-[100dvh] overflow-hidden">
        {/* Header stays at the top */}
        <Header />

        <main className="flex-1 w-full overflow-y-auto border-x border-gray-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </main>

        {/* Footer stays at the bottom */}
        <Footer />
      </div>
    </MenuOrderProvider>
  );
}
