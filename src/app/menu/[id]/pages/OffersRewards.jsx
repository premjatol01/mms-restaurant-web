import React from "react";
import { ChevronRight, Tag, CheckCircle } from "lucide-react";

const OffersRewards = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900 flex justify-center">
      <div className="w-full max-w-md space-y-4">
        {/* Header Section */}
        <div>
          <h1 className="text-xl font-medium text-gray-800 mb-1">
            Offers & Rewards
          </h1>
          <p className="text-gray-500 text-sm">
            Offers are checked automatically against your order.
          </p>
        </div>

        {/* Login to Unlock Banner */}
        <div className="bg-[#eef8f3] border border-emerald-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-colors">
          <div className="flex items-center">
            {/* Chat Icon Circle */}
            <div className="bg-white rounded-full p-2 mr-3 shadow-sm border border-emerald-50">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-800"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-emerald-900 font-semibold text-sm">
                Login to unlock offers
              </h3>
              <p className="text-emerald-700/80 text-xs mt-0.5">
                Use your mobile number to apply discounts
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-emerald-800" />
        </div>

        {/* Offer Card 1: Applied */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-[#fff4e5] text-[#b45309] text-[10px] font-bold px-2 py-1 rounded">
              WELCOME10
            </span>
            <Tag size={20} className="text-gray-800" />
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-1">
            10% off your first order
          </h2>
          <p className="text-gray-500 text-xs mb-4">
            Valid on orders above ₹1,000.
          </p>

          {/* Success State Box */}
          <div className="bg-[#eef8f3] border border-emerald-100 rounded-xl p-3 flex items-center">
            <div className="bg-emerald-800 rounded-full p-1 mr-3 flex-shrink-0">
              <CheckCircle size={16} className="text-white" />
            </div>
            <div>
              <h4 className="text-emerald-900 font-bold text-sm">
                Offer applied
              </h4>
              <p className="text-emerald-700 text-xs mt-0.5">
                10% discount is active
              </p>
            </div>
          </div>
        </div>

        {/* Offer Card 2: Progress */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-[#fff4e5] text-[#b45309] text-[10px] font-bold px-2 py-1 rounded">
              NEXT UNLOCK
            </span>
            <span className="text-gray-900 font-medium text-sm">15% OFF</span>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Add ₹540 more to unlock
          </h2>
          <p className="text-gray-500 text-xs mb-4">
            Reach ₹2,000 in this table session.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div
              className="bg-emerald-800 h-2 rounded-full"
              style={{ width: "73%" }} // Calculated 1460/2000
            ></div>
          </div>

          <p className="text-sm text-gray-900">
            <span className="font-bold">₹1,460</span>{" "}
            <span className="text-gray-500">/ ₹2,000</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OffersRewards;
