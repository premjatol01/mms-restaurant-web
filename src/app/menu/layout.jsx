"use client";

import Footer from "@/components/menuComp/Footer";
import Header from "@/components/menuComp/Header";
import { MenuOrderProvider } from "@/context/Menuordercontext";
import React from "react";

export default function MenuLayout({ children }) {
  return (
    <MenuOrderProvider>
      <div className="max-w-md mx-auto bg-background">
        <Header />
        <main className="h-[calc(100vh-136px)] overflow-y-auto border-x border-gray-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </main>
        <Footer />
      </div>
    </MenuOrderProvider>
  );
}
