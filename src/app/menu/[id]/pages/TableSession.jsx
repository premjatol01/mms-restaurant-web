import React from "react";
import { Star, ChevronRight } from "lucide-react";
import { useMenuOrder } from "@/context/Menuordercontext";

const TableSession = () => {
  const { setActiveTab } = useMenuOrder();

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900 flex justify-center">
      <div className="w-full max-w-md space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between px-1">
          <h1 className="text-xl font-medium text-gray-800">Table 05</h1>
          <button className="flex items-center text-xs font-bold text-emerald-700 tracking-wide hover:text-emerald-800 transition-colors">
            ACTIVE SESSION
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        {/* Info Alert Box */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-emerald-900/80 text-sm leading-relaxed">
            Everyone ordering from this table QR is combined into one table
            session and one consolidated bill.
          </p>
        </div>

        {/* Main Order Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Current table order
              </h2>
              <p className="text-gray-500 text-sm">2 items</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
                Preparing
              </span>
              <span className="text-xl font-bold text-gray-900">₹810</span>
            </div>
          </div>

          {/* Timeline / Progress Section */}
          <div className="space-y-6 mt-8">
            {/* Step 1: Order Received */}
            <div className="flex items-start">
              <div className="mt-1 mr-4">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
              </div>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-gray-700 text-sm font-medium">
                  Order received
                </span>
                <span className="text-gray-400 text-xs">Just now</span>
              </div>
            </div>

            {/* Step 2: Preparing */}
            <div className="flex items-start">
              <div className="mt-1 mr-4">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
              </div>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-gray-700 text-sm font-medium">
                  Preparing
                </span>
                <span className="text-gray-400 text-xs">Kitchen is on it</span>
              </div>
            </div>

            {/* Step 3: Ready (Inactive) */}
            <div className="flex items-start">
              <div className="mt-1 mr-4">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              </div>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Ready</span>
                <span className="text-gray-400 text-xs">
                  We'll let you know
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Experience Button */}
        <button
          onClick={() => setActiveTab("Rating")}
          className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-center relative hover:bg-gray-50 transition-colors"
        >
          <div className="absolute left-5">
            <Star size={20} className="text-gray-900" />
          </div>
          <span className="font-bold text-gray-900 text-base">
            Rate your experience
          </span>
        </button>
      </div>
    </div>
  );
};

export default TableSession;
