"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useMenuOrder } from "@/store/menuOrderStore";

import "swiper/css";
import "swiper/css/pagination";

const defaultOffers = [
  {
    id: 1,
    label: "Repeat Special",
    title: "10% off on your return visit",
    description: "Re-order within 7 days to unlock",
  },
  {
    id: 2,
    label: "Order Bonus",
    title: "Get 15% off your order",
    description: "Order above ₹1,500 to unlock",
  },
  {
    id: 3,
    label: "Weekday Treat",
    title: "20% off Tuesday Special",
    description: "Available on orders above ₹1,000",
  },
];

export default function OfferCarousel() {
  const params = useParams();
  const subdomain = params?.subdomain;
  const [paginationEl, setPaginationEl] = useState(null);
  const [carouselOffers, setCarouselOffers] = useState(defaultOffers);
  const { setActiveTab } = useMenuOrder();

  useEffect(() => {
    if (!subdomain) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    fetch(`${apiUrl}/public/offers/${subdomain}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((offer, idx) => {
            const discount =
              offer.benefit?.type === "flat"
                ? `₹${offer.benefit.value} OFF`
                : `${offer.benefit?.value || 0}% OFF`;
            const label =
              offer.type === "repeat_order"
                ? "Repeat Special"
                : offer.type === "order_value"
                ? "Order Bonus"
                : "Limited Offer";

            return {
              id: offer.id || offer._id || idx,
              label,
              title: `${offer.name} · ${discount}`,
              description: offer.terms || "Tap to check eligibility and save on your order",
            };
          });
          setCarouselOffers(mapped);
        }
      })
      .catch(() => {
        // Keep fallback
      });
  }, [subdomain]);

  return (
    <section className="h-fit">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={12}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: paginationEl,
        }}
        className="offer-swiper"
      >
        {carouselOffers.map((offer) => (
          <SwiperSlide key={offer.id}>
            <button
              type="button"
              onClick={() => setActiveTab("Offers")}
              className="w-full text-left bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden active:scale-[0.98] transition-transform"
            >
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/5" />

              <div className="relative w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Sparkles size={20} />
              </div>

              <div className="relative flex-1 min-w-0">
                <p className="text-[10px] font-bold text-white/80 tracking-wider uppercase mb-0.5">
                  {offer.label}
                </p>
                <h3 className="text-[15px] font-bold text-white leading-tight mb-0.5">
                  {offer.title}
                </h3>
                <p className="text-[11px] text-white/70 line-clamp-1">
                  {offer.description}
                </p>
              </div>

              <ChevronRight
                size={20}
                className="relative text-white/80 flex-shrink-0"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        ref={(node) => setPaginationEl(node)}
        className="offer-pagination flex justify-center items-center gap-1.5 mt-2 min-h-[8px]"
      />
    </section>
  );
}