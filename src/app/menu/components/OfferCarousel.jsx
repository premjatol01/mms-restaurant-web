"use client";

import { useState } from "react";
import { ChevronRight, Leaf } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const offers = [
  {
    id: 1,
    label: "Dessert Bonus",
    title: "Free kulfi with your meal",
    description: "Add any main course to unlock",
    icon: Leaf,
  },
  {
    id: 2,
    label: "Special Offer",
    title: "Get 15% off your order",
    description: "Order above ₹1,000 to unlock",
    icon: Leaf,
  },
  {
    id: 3,
    label: "Weekend Special",
    title: "Free drink with your meal",
    description: "Available on orders above ₹799",
    icon: Leaf,
  },
];

export default function OfferCarousel() {
  const [paginationEl, setPaginationEl] = useState(null);

  return (
    <section className="mb-2 h-fit">
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={12}
        pagination={{
          clickable: true,
          el: paginationEl, // Dynamic ref prevents mount timing issues
        }}
        className="offer-swiper"
      >
        {offers.map((offer) => {
          const Icon = offer.icon;

          return (
            <SwiperSlide key={offer.id}>
              <div className="bg-success-light border border-primary-light/30 rounded-lg p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-text-on-primary flex-shrink-0">
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-primary tracking-wider uppercase mb-0.5">
                    {offer.label}
                  </p>

                  <h3 className="text-sm font-bold text-text-primary mb-0.5">
                    {offer.title}
                  </h3>

                  <p className="text-xs text-text-secondary">
                    {offer.description}
                  </p>
                </div>

                <ChevronRight
                  size={20}
                  className="text-primary flex-shrink-0"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Attach ref to the custom pagination element */}
      <div 
        ref={(node) => setPaginationEl(node)} 
        className="offer-pagination flex justify-center items-center gap-1.5 mt-1.5 min-h-[12px]" 
      />
    </section>
  );
}