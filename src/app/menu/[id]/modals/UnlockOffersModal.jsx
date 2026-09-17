import React from "react";
import { X, ChevronRight } from "lucide-react";

const UnlockOffersModal = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-xs">
      <div className="absolute bg-white w-full max-w-md rounded-t-[32px] sm:rounded-t-[32px] p-6 shadow-lg animate-in slide-in-from-bottom-8 duration-300">
        {/* Top Drag Handle Indicator */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full sm:hidden"></div>

        {/* Header Area: Icon & Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3.5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors bg-white hover:shadow-md border"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Content Section */}
        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-[#1a5c38] uppercase tracking-widest mb-3">
            Unlock Table Offers
          </h3>
          <h2 className="text-[26px] leading-tight font-medium text-gray-800 mb-4">
            Get offers made for you
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Login with your mobile number to apply offers and get order updates
            on WhatsApp.
          </p>
        </div>

        {/* Input Field Section */}
        <div className="mb-6">
          <div className="flex items-center border border-[#4a9b6d] rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#4a9b6d] transition-all">
            <div className="bg-white pl-4 pr-3 py-4 text-gray-700 font-medium text-sm">
              +91
            </div>
            {/* Vertical Divider */}
            <div className="w-px h-6 bg-gray-200"></div>
            <input
              type="tel"
              placeholder="Enter mobile number"
              className="flex-1 px-3 py-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Actions Section */}
        <div className="space-y-4">
          {/* WhatsApp Button */}
          <button className="w-full bg-[#72b28d] hover:bg-[#609b78] text-white font-bold rounded-xl py-4 px-6 flex items-center justify-center transition-colors">
            <span className="text-[15px]">Continue with WhatsApp</span>
            <ChevronRight size={18} className="ml-1" strokeWidth={3} />
          </button>

          {/* Skip Button */}
          <button className="w-full py-2 text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnlockOffersModal;
