"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, Sparkles, History, TrendingUp, Calendar, Tag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useMenuOrder } from "@/store/menuOrderStore";

import "swiper/css";
import "swiper/css/pagination";

const defaultFallbackOffers = [
  {
    id: "f-1",
    type: "repeat_order",
    discount: "10% OFF",
    label: "Repeat Customer Special",
    title: "10% OFF · Return Visit",
    description: "Re-order within 7 days to unlock",
    gradient: "from-primary to-primary-hover",
  },
  {
    id: "f-2",
    type: "order_value",
    discount: "15% OFF",
    label: "Orders above ₹1,500",
    title: "15% OFF · Order Bonus",
    description: "Add items worth ₹1,500 or more to unlock",
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: "f-3",
    type: "low_traffic",
    discount: "20% OFF",
    label: "Weekday Treat",
    title: "20% OFF · Tuesday Special",
    description: "Available on orders above ₹1,000",
    gradient: "from-amber-600 to-orange-700",
  },
];

function mapOfferToCarousel(offer, idx) {
  const discount =
    offer.benefit?.type === "flat"
      ? `₹${offer.benefit.value} OFF`
      : `${offer.benefit?.value || 0}% OFF`;

  let label = "Special Offer";
  let title = `${discount} · ${offer.name}`;
  let description = offer.terms?.trim() || "";

  if (offer.type === "repeat_order") {
    label = "Repeat Customer Special";
    title = `${discount} · Return Reward`;
    description =
      offer.terms?.trim() ||
      `Re-order within ${offer.repeatWithinDays || 7} days (past order ₹${(
        offer.previousOrderAmount || 0
      ).toLocaleString()}+)`;
  } else if (offer.type === "order_value") {
    const minAmount = offer.minimumOrderAmount
      ? `₹${offer.minimumOrderAmount.toLocaleString()}`
      : "minimum spend";
    label = offer.minimumOrderAmount ? `Orders above ${minAmount}` : "Order Bonus";
    title = `${discount} · ${offer.name}`;
    description =
      offer.terms?.trim() ||
      `Add items worth ${minAmount} or more to unlock`;
  } else if (offer.type === "low_traffic") {
    if (offer.dayOfWeek && offer.menuItemName) {
      label = `${offer.dayOfWeek} Special`;
      title = `${discount} on ${offer.menuItemName}`;
      description =
        offer.terms?.trim() ||
        `Valid on ${offer.menuItemName} every ${offer.dayOfWeek}`;
    } else if (offer.dayOfWeek) {
      label = `${offer.dayOfWeek} Treat`;
      title = `${discount} · ${offer.name}`;
      description =
        offer.terms?.trim() ||
        `Enjoy special pricing this ${offer.dayOfWeek}`;
    } else if (offer.menuItemName) {
      label = `${offer.menuItemName} Deal`;
      title = `${discount} on ${offer.menuItemName}`;
      description =
        offer.terms?.trim() ||
        `Limited time discount on ${offer.menuItemName}`;
    } else {
      label = "Limited Offer";
      title = `${discount} · ${offer.name}`;
      description = offer.terms?.trim() || "Tap to check eligibility and save on your order";
    }
  }

  const gradients = [
    "from-primary to-primary-hover",
    "from-emerald-600 to-teal-700",
    "from-amber-600 to-orange-700",
    "from-indigo-600 to-violet-700",
  ];
  const gradient = gradients[idx % gradients.length];

  return {
    id: offer.id || offer._id || `offer-${idx}`,
    type: offer.type,
    discount,
    label,
    title,
    description,
    gradient,
  };
}

function getOfferIcon(type) {
  switch (type) {
    case "repeat_order":
      return History;
    case "order_value":
      return TrendingUp;
    case "low_traffic":
      return Calendar;
    default:
      return Sparkles;
  }
}

export default function OfferCarousel() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { offers: storeOffers, verifiedRestaurant, setActiveTab } = useMenuOrder();
  const subdomain = params?.subdomain || verifiedRestaurant?.subdomain;

  const [paginationEl, setPaginationEl] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [carouselOffers, setCarouselOffers] = useState(() => {
    if (Array.isArray(storeOffers) && storeOffers.length > 0) {
      return storeOffers.map(mapOfferToCarousel);
    }
    return defaultFallbackOffers;
  });

  // Keep in sync with store offers
  useEffect(() => {
    if (Array.isArray(storeOffers) && storeOffers.length > 0) {
      setCarouselOffers(storeOffers.map(mapOfferToCarousel));
    }
  }, [storeOffers]);

  // Fetch directly from API for freshness
  useEffect(() => {
    if (!subdomain) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    fetch(`${apiUrl}/public/offers/${encodeURIComponent(subdomain)}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setCarouselOffers(json.data.map(mapOfferToCarousel));
        }
      })
      .catch(() => {});
  }, [subdomain]);

  // Bind Swiper pagination element when ref is attached
  useEffect(() => {
    if (swiperInstance && paginationEl && !swiperInstance.destroyed) {
      swiperInstance.params.pagination.el = paginationEl;
      if (swiperInstance.pagination) {
        swiperInstance.pagination.destroy();
        swiperInstance.pagination.init();
        swiperInstance.pagination.render();
        swiperInstance.pagination.update();
      }
    }
  }, [swiperInstance, paginationEl]);

  const handleOfferClick = () => {
    setActiveTab("Offers");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", "offers");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  if (!carouselOffers || carouselOffers.length === 0) return null;

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
        onSwiper={setSwiperInstance}
        className="offer-swiper rounded-2xl overflow-hidden"
      >
        {carouselOffers.map((offer) => {
          const Icon = getOfferIcon(offer.type);

          return (
            <SwiperSlide key={offer.id}>
              <button
                type="button"
                onClick={handleOfferClick}
                className={`w-full text-left bg-gradient-to-br ${offer.gradient} rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden active:scale-[0.98] transition-transform shadow-sm`}
              >
                {/* Decorative ambient highlights */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

                {/* Offer Icon Box */}
                <div className="relative w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                  <Icon size={20} />
                </div>

                {/* Offer Content */}
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-white/95 tracking-wider uppercase bg-white/15 px-2 py-0.5 rounded-md">
                      {offer.label}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-300 tracking-wide uppercase">
                      {offer.discount}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-bold text-white leading-tight mb-0.5 truncate">
                    {offer.title}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 leading-snug">
                    {offer.description}
                  </p>
                </div>

                {/* Action arrow */}
                <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/15 text-white flex-shrink-0">
                  <ChevronRight size={16} />
                </div>
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {carouselOffers.length > 1 && (
        <div
          ref={(node) => setPaginationEl(node)}
          className="offer-pagination flex justify-center items-center gap-1.5 mt-2 min-h-[8px]"
        />
      )}
    </section>
  );
}