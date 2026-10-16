"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Footer from "@/components/menuComp/Footer";
import Header from "@/components/menuComp/Header";
import TableSessionError from "@/components/menuComp/TableSessionError";
import { useMenuOrder, useMenuOrderStore } from "@/store/menuOrderStore";
import UnlockOffersModal from "./[id]/modals/UnlockOffersModal";

export default function MenuLayout({ children }) {
  const params = useParams();
  const {
    offersModalOpen,
    closeOffersModal,
    setVerifiedSession,
    setVerificationError,
    setVerificationLoading,
  } = useMenuOrder();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    useMenuOrderStore.persist.rehydrate();
  }, []);

  const verifyTable = useCallback(async () => {
    const subdomain = params?.subdomain;
    const tableId = params?.id;

    if (!subdomain || !tableId) {
      const err = {
        errorType: "TABLE_NOT_FOUND",
        message: "No table or restaurant specified in the URL. Please scan a table QR code.",
      };
      setError(err);
      setVerificationError(err);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationLoading();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const res = await fetch(
        `${apiUrl}/restaurants/verify-table/${encodeURIComponent(subdomain)}/${encodeURIComponent(tableId)}`,
        { cache: "no-store" }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errPayload = {
          errorType:
            json?.errorType ||
            (res.status === 404 ? "TABLE_NOT_FOUND" : "VERIFICATION_FAILED"),
          message:
            json?.message || `Unable to verify table session (HTTP ${res.status}).`,
        };
        setError(errPayload);
        setVerificationError(errPayload);
      } else {
        setError(null);
        setVerifiedSession(json.data);
      }
    } catch (err) {
      console.error("Verification network error:", err);
      const errPayload = {
        errorType: "NETWORK_ERROR",
        message:
          "Could not connect to the server to verify this table. Please check your internet connection.",
      };
      setError(errPayload);
      setVerificationError(errPayload);
    } finally {
      setLoading(false);
    }
  }, [
    params?.subdomain,
    params?.id,
    setVerifiedSession,
    setVerificationError,
    setVerificationLoading,
  ]);

  useEffect(() => {
    verifyTable();
  }, [verifyTable]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
        <h2 className="text-lg font-bold text-white tracking-tight">Verifying Table & Restaurant...</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Setting up your digital dining session. Please wait a moment.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <TableSessionError
        error={error}
        subdomain={params?.subdomain}
        tableId={params?.id}
        onRetry={verifyTable}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <Header />

      {/* pt-[60px] clears fixed header, pb-[80px] clears fixed footer */}
      <main className="pt-[60px] pb-[80px]">{children}</main>

      <Footer />

      {offersModalOpen && <UnlockOffersModal onClose={closeOffersModal} />}
    </div>
  );
}