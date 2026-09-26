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

  useEffect(() => {
    useMenuOrderStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (params?.id) setTableId(params.id);
  }, [params?.id, setTableId]);

  return (
    <div className="max-w-md mx-auto bg-background h-[100dvh] flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0">
        <Header />
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </main>

      {/* Fixed Footer */}
      <div className="shrink-0">
        <Footer />
      </div>

      {offersModalOpen && <UnlockOffersModal onClose={closeOffersModal} />}
    </div>
  );
}