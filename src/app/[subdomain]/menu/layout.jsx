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
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <Header />

      {/* pt-[60px] clears fixed header, pb-[80px] clears fixed footer */}
      <main className="pt-[60px] pb-[80px]">
        {children}
      </main>

      <Footer />

      {offersModalOpen && <UnlockOffersModal onClose={closeOffersModal} />}
    </div>
  );
}