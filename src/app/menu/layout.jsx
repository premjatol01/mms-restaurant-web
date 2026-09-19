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
    <div className="relative max-w-md mx-auto bg-background flex flex-col h-[100dvh] overflow-hidden">
      <Header />

      <main className="flex-1 w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </main>

      <Footer />

      {offersModalOpen && <UnlockOffersModal onClose={closeOffersModal} />}
    </div>
  );
}