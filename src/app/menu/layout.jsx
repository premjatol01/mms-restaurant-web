"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/menuComp/Footer";
import Header from "@/components/menuComp/Header";
import { useMenuOrder, useMenuOrderStore } from "@/store/menuOrderStore";
import UnlockOffersModal from "./[id]/modals/UnlockOffersModal";

export default function MenuLayout({ children }) {
  const params = useParams();
  const { offersModalOpen, closeOffersModal, setTableId } = useMenuOrder();

  // Rehydrate the persisted slice of the store after mount only, so the
  // server-rendered markup and the very first client render always match.
  useEffect(() => {
    useMenuOrderStore.persist.rehydrate();
  }, []);

  // Keep the store's tableId in sync with the /menu/[id] route segment.
  useEffect(() => {
    if (params?.id) setTableId(params.id);
  }, [params?.id, setTableId]);

  return (
    <div className="relative max-w-md mx-auto bg-background flex flex-col h-[100dvh] overflow-hidden">
      {/* Header stays at the top */}
      <Header />

      <main className="flex-1 w-full overflow-y-auto border-x border-border-light [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </main>

      {/* Footer stays at the bottom */}
      <Footer />

      {/* Modal Overlay */}
      {offersModalOpen && <UnlockOffersModal onClose={closeOffersModal} />}
    </div>
  );
}
