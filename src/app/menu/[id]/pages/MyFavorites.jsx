import React from 'react';
import { ChevronRight, Heart, UtensilsCrossed } from 'lucide-react';

const MyFavorites = () => {
  return (
    <div className="bg-[#f4f6f5] p-6 font-sans text-gray-900 flex justify-center">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 px-1">
          <h1 className="text-xl font-medium text-gray-800">My Favorites</h1>
          <button className="flex items-center text-sm font-bold text-[#1b5e41] tracking-wide hover:text-[#144630] transition-colors">
            0 saved
            <ChevronRight size={16} className="ml-0.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Empty State Card */}
        <div className="bg-[#fcfcfc] border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center min-h-[420px]">
          
          {/* Heart Icon Container */}
          <div className="bg-[#fef2f2] p-5 rounded-full mb-6 flex items-center justify-center">
            <Heart 
              size={32} 
              className="text-[#ef4444]" 
              strokeWidth={2} 
            />
          </div>

          {/* Text Content */}
          <h2 className="text-[22px] font-medium text-gray-800 mb-3">
            No favorites yet
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed max-w-[260px] mb-8">
            Tap the heart on any dish to save it here for your next order.
          </p>

          {/* Action Button */}
          <button className="bg-[#1b5e41] hover:bg-[#144630] text-white font-bold rounded-2xl py-3.5 px-6 flex items-center justify-center transition-colors shadow-sm">
            <UtensilsCrossed size={20} className="mr-2" />
            <span className="text-[15px]">Explore menu</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default MyFavorites;