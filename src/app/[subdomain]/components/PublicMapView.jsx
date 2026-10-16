"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin } from "lucide-react";

export default function PublicMapView({
  latitude,
  longitude,
  address,
  restaurantName,
  showDirections = true,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const numLat = parseFloat(latitude);
  const numLng = parseFloat(longitude);
  const hasCoords = !isNaN(numLat) && !isNaN(numLng) && numLat !== 0 && numLng !== 0;

  const lat = hasCoords ? numLat : 19.076;
  const lng = hasCoords ? numLng : 72.8777;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let isMounted = true;

    // Dynamically import Leaflet on client-side only to be fully SSR-safe
    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      if (!isMounted || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: hasCoords ? 16 : 14,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      }).addTo(map);

      if (hasCoords) {
        const pin = L.divIcon({
          className: "custom-leaflet-pin",
          html: `
            <div style="position: relative; width: 34px; height: 42px; transform: translate(-17px, -42px);">
              <svg viewBox="0 0 24 32" width="34" height="42" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="#e11d48" stroke="#ffffff" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
              </svg>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([numLat, numLng], { icon: pin }).addTo(map);

        if (restaurantName || address) {
          marker.bindPopup(
            `<div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
              <strong>${restaurantName || "Our Restaurant"}</strong><br/>
              ${address || ""}
            </div>`
          );
        }
      }

      mapRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, hasCoords, numLat, numLng, restaurantName, address]);

  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${numLat},${numLng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || restaurantName || "")}`;

  return (
    <div
      style={{
        backgroundColor: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
      className="rounded-2xl border overflow-hidden shadow-sm"
    >
      <div className="relative" style={{ height: "360px", width: "100%" }}>
        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
            Loading interactive map...
          </div>
        )}
        <div ref={containerRef} style={{ height: "100%", width: "100%", zIndex: 10 }} />
      </div>

      <div
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t"
        style={{ borderColor: "var(--theme-border)" }}
      >
        <div className="flex items-start gap-2.5">
          <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--theme-primary)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--theme-text)" }}>
              {restaurantName || "Our Location"}
            </p>
            {address && (
              <p className="text-xs mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
                {address}
              </p>
            )}
          </div>
        </div>

        {showDirections && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "var(--theme-primary)",
              color: "var(--theme-primary-text)",
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-transform hover:scale-105 shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </a>
        )}
      </div>
    </div>
  );
}
