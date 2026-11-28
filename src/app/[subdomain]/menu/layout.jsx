"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Footer from "@/components/menuComp/Footer";
import Header from "@/components/menuComp/Header";
import TableSessionError from "@/components/menuComp/TableSessionError";
import { useMenuOrder, useMenuOrderStore } from "@/store/menuOrderStore";
import UnlockOffersModal from "./[id]/modals/UnlockOffersModal";
import RequestWaiterModal from "./[id]/modals/RequestWaiterModal";
import GamesModal from "./[id]/modals/GamesModal";
import ChangeTableModal from "@/components/menuComp/ChangeTableModal";
import { connectTableSocket, disconnectTableSocket } from "@/services/socket";
import { registerCustomerServiceWorker, dispatchCustomerNotification } from "@/utils/customerNotification";
import { toast } from "sonner";

export default function MenuLayout({ children }) {
  const params = useParams();
  const {
    offersModalOpen,
    closeOffersModal,
    waiterModalOpen,
    closeWaiterModal,
    gamesModalOpen,
    closeGamesModal,
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
    const currentMobile = useMenuOrderStore.getState().mobile?.number;
    const mobQuery = currentMobile ? `?customerMobile=${encodeURIComponent(currentMobile)}` : "";

    try {
      const res = await fetch(
        `${apiUrl}/restaurants/verify-table/${encodeURIComponent(subdomain)}/${encodeURIComponent(tableId)}${mobQuery}`,
        { cache: "no-store" }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const isMaintenance = res.status === 503 || json?.isMaintenance || json?.errorType === "MAINTENANCE_MODE";
        const errPayload = {
          errorType:
            json?.errorType ||
            (isMaintenance ? "MAINTENANCE_MODE" : res.status === 404 ? "TABLE_NOT_FOUND" : "VERIFICATION_FAILED"),
          message:
            json?.message || `Unable to verify table session (HTTP ${res.status}).`,
        };
        setError(errPayload);
        setVerificationError(errPayload);
      } else {
        setError(null);
        setVerifiedSession(json.data);
        useMenuOrderStore.getState().fetchMenuData(subdomain);

        // Geofencing verification on menu load
        const rest = json.data?.restaurant;
        const geofence = rest?.portalSettings?.operations?.geofencing;
        const restLoc = rest?.location;

        if (geofence?.enabled && restLoc?.latitude && restLoc?.longitude && typeof window !== "undefined" && navigator?.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const custLat = pos.coords.latitude;
              const custLng = pos.coords.longitude;
              const toRad = (x) => (x * Math.PI) / 180;
              const dLat = toRad(restLoc.latitude - custLat);
              const dLon = toRad(restLoc.longitude - custLng);
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(custLat)) * Math.cos(toRad(restLoc.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const dist = 6371e3 * c;
              const allowed = (Number(geofence.radiusMeters) || 100) + 25; // 25m drift margin

              if (dist <= allowed) {
                // Mobile device has location ON and is inside the dining area
                useMenuOrderStore.getState().setLocationStatus({
                  checked: true,
                  enabled: true,
                  verified: true,
                  distance: Math.round(dist),
                  coords: { latitude: custLat, longitude: custLng },
                  message: `Dining area verified (~${Math.round(dist)}m)`,
                });
                toast.success(
                  `📍 Location verified: You are in ${rest.name || "the restaurant"}'s dining area (~${Math.round(dist)}m). Happy dining!`,
                  { id: "geofence-status", duration: 4000 }
                );
              } else {
                // Mobile device has location ON, but customer is outside the dining area
                useMenuOrderStore.getState().setLocationStatus({
                  checked: true,
                  enabled: true,
                  verified: false,
                  distance: Math.round(dist),
                  coords: { latitude: custLat, longitude: custLng },
                  message: `Outside dining area (~${Math.round(dist)}m away)`,
                });
                toast.error(
                  `📍 Location detected: You are outside ${rest.name || "the restaurant"}'s dining area (~${Math.round(dist)}m away). Dine-in orders can only be placed on-site.`,
                  { id: "geofence-status", duration: 5000 }
                );
                const isPathMode = window.location.pathname.startsWith(`/${subdomain}`);
                const websitePath = isPathMode ? `/${subdomain}` : "/";
                setTimeout(() => {
                  window.location.replace(websitePath);
                }, 2000);
              }
            },
            (err) => {
              console.warn("Geofence check GPS error/skipped:", err?.code, err?.message);
              useMenuOrderStore.getState().setLocationStatus({
                checked: true,
                enabled: false,
                verified: false,
                distance: null,
                coords: null,
                message: err?.code === 1 ? "Permission denied" : "Location off",
              });

              if (err?.code === 1) {
                // Permission Denied
                toast.warning(
                  `📍 Location permission is off. Please enable device location / GPS to verify you are at ${rest.name || "the restaurant"}.`,
                  { id: "geofence-status", duration: 5000 }
                );
              } else if (err?.code === 2) {
                // Position Unavailable / GPS Off
                toast.warning(
                  "📍 Mobile device location is turned off. Please turn on GPS in your phone settings to verify your table.",
                  { id: "geofence-status", duration: 5000 }
                );
              }
            },
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
          );
        }
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

  // Real-time WebSocket connection to the table room
  useEffect(() => {
    const tableId = params?.id;
    if (!tableId || error) return;

    const resolvedTableId =
      useMenuOrderStore.getState().verifiedTable?.tableId ||
      useMenuOrderStore.getState().verifiedTable?.id ||
      useMenuOrderStore.getState().verifiedTable?._id ||
      tableId;

    registerCustomerServiceWorker().catch(() => {});

    connectTableSocket(resolvedTableId, {
      onSessionUpdated: (data) => {
        if (data?.session && data?.orders) {
          const prevActiveOrder = useMenuOrderStore.getState().activeOrder;
          const prevStatus = prevActiveOrder?.status;

          useMenuOrderStore
            .getState()
            .updateLiveSession(data.session, data.orders);

          const newActiveOrder = useMenuOrderStore.getState().activeOrder;
          const newStatus = newActiveOrder?.status;

          // Dispatch mobile notification popup if status advanced
          if (newStatus && newStatus !== prevStatus) {
            const rawTable = useMenuOrderStore.getState().verifiedTable?.tableNo || "your table";
            const tableLabel = `Table ${rawTable}`;

            if (newStatus === "preparing" || newStatus === "cooking" || newStatus === "processing") {
              dispatchCustomerNotification({
                title: "🍳 Cooking in Progress!",
                body: `The kitchen has started preparing your order for ${tableLabel}.`,
                data: { orderId: newActiveOrder?.orderId }
              });
            } else if (newStatus === "ready" || newStatus === "delivered" || newStatus === "served") {
              dispatchCustomerNotification({
                title: "🍲 Order Ready & Served!",
                body: `Your food has been delivered to ${tableLabel}. Enjoy your meal!`,
                data: { orderId: newActiveOrder?.orderId }
              });
            }
          }
        }
      },
      onCustomerSynced: (data) => {
        if (data?.customerMobile) {
          useMenuOrderStore.getState().handleCustomerSynced(data);
          toast.success("Mobile number verified & linked to this table!");
        }
      },
      onFavoritesUpdated: (data) => {
        if (data?.favorites) {
          useMenuOrderStore.getState().handleFavoritesUpdated(data.favorites);
        }
      },
      onSessionCompleted: (data) => {
        dispatchCustomerNotification({
          title: "✨ Table Bill Settled",
          body: "Your table session has been settled at the counter. Thank you for dining with us!",
        });

        toast.info(
          "Your table session has been settled at the counter. Thank you for dining with us!"
        );
        useMenuOrderStore.getState().endLiveSession();

        const subdomain = params?.subdomain;
        const verifiedRestaurant = useMenuOrderStore.getState().verifiedRestaurant;
        const redirectTarget = data?.redirectTarget || verifiedRestaurant?.portalSettings?.operations?.sessionEndRedirect?.target || "website";
        const redirectUrl = data?.redirectUrl || verifiedRestaurant?.googleReviewLink || verifiedRestaurant?.portalSettings?.operations?.sessionEndRedirect?.googleReviewUrl || "";

        const isPathMode = typeof window !== "undefined" && window.location.pathname.startsWith(`/${subdomain}`);
        const websitePath = isPathMode ? `/${subdomain}` : "/";

        setTimeout(() => {
          if (typeof window !== "undefined") {
            if (redirectTarget === "google_review" && redirectUrl) {
              window.location.replace(redirectUrl);
            } else {
              window.location.replace(websitePath);
            }
          }
        }, 1500);
      },
      onWaiterAcknowledged: (data) => {
        const waiter = data?.staffName || "A team member";
        toast.success(`👋 ${waiter} is on the way to assist your table!`, {
          duration: 6000,
        });
        dispatchCustomerNotification({
          title: "👋 Waiter on the Way!",
          body: `${waiter} is coming to assist your table right now.`,
        });
      },
    });

    // Fallback sync every 25 seconds for reconnect resilience
    const fallbackInterval = setInterval(() => {
      useMenuOrderStore.getState().pollTableSession(params?.subdomain, tableId);
    }, 25000);

    return () => {
      clearInterval(fallbackInterval);
      disconnectTableSocket(resolvedTableId);
    };
  }, [params?.subdomain, params?.id, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex flex-col items-center justify-center p-6 text-center text-[#2b2118]">
        <Loader2 className="w-10 h-10 animate-spin text-[#d9480f] mb-4" />
        <h2 className="text-lg font-bold text-[#2b2118] tracking-tight">Verifying Table & Restaurant...</h2>
        <p className="text-xs text-[#786154] mt-1 max-w-xs leading-relaxed">
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
      {waiterModalOpen && <RequestWaiterModal isOpen={waiterModalOpen} onClose={closeWaiterModal} />}
      {gamesModalOpen && <GamesModal isOpen={gamesModalOpen} onClose={closeGamesModal} />}
      <ChangeTableModal />
    </div>
  );
}