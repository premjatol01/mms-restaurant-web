import React from 'react';
import { ChevronLeft, Send, ExternalLink, Star } from 'lucide-react';

// Reusable component to render star ratings
const StarRating = ({ rating, total = 5, size = 20, activeColor = "text-orange-400", inactiveColor = "text-gray-200" }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(total)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? `${activeColor} fill-current` : inactiveColor}
          strokeWidth={i < rating ? 0 : 2}
        />
      ))}
    </div>
  );
};

const Rating = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900 flex justify-center">
      <div className="w-full max-w-md space-y-4">
        
        {/* Header */}
        <div className="flex items-center py-2">
          <button className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-lg font-medium text-gray-800 ml-2">Reviews</h1>
        </div>

        {/* Overall Rating Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
            <div className="mb-2">
              <StarRating rating={5} size={14} />
            </div>
            <p className="text-xs text-gray-500">Based on 128 reviews</p>
          </div>
          
          {/* Rating Distribution Bars */}
          <div className="w-1/2 space-y-1.5">
            {[5, 4, 3].map((stars) => (
              <div key={stars} className="flex items-center text-xs text-gray-500">
                <span className="w-2 mr-2">{stars}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-orange-400 h-1.5 rounded-full" 
                    style={{ width: stars === 5 ? '85%' : stars === 4 ? '40%' : '15%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Write a Review Form */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">Write a review</h2>
            <span className="text-xs text-gray-500">Share your table experience</span>
          </div>

          <div className="mb-4">
            <StarRating rating={0} size={28} inactiveColor="text-gray-200" />
          </div>

          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Your name" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-gray-400"
            />
            <textarea 
              placeholder="Tell us what you loved..." 
              rows="3"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-gray-400 resize-none"
            ></textarea>
          </div>

          <button className="w-full mt-4 bg-[#166534] hover:bg-[#14532d] text-white font-medium rounded-xl py-3.5 flex items-center justify-center transition-colors">
            <Send size={18} className="mr-2" />
            Submit review
          </button>
        </div>

        {/* What Guests Say Section */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-base font-bold text-gray-900">What guests say</h2>
            <span className="text-xs text-gray-500">128 reviews</span>
          </div>

          <div className="space-y-3">
            {/* Review 1 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm mr-3">
                    A
                  </div>
                  <span className="font-bold text-sm text-gray-900">Aarav Mehta</span>
                </div>
                <span className="text-[10px] text-gray-400">2 days ago</span>
              </div>
              <div className="ml-11">
                <StarRating rating={5} size={12} />
                <p className="text-xs text-gray-600 mt-2">Beautiful flavours and the paneer tikka was outstanding.</p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mr-3">
                    P
                  </div>
                  <span className="font-bold text-sm text-gray-900">Priya S.</span>
                </div>
                <span className="text-[10px] text-gray-400">1 week ago</span>
              </div>
              <div className="ml-11">
                <StarRating rating={4} size={12} />
                <p className="text-xs text-gray-600 mt-2">Lovely table service, generous portions and a warm atmosphere.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Review Banner */}
        <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
          <div className="flex items-center">
            {/* Google G Logo SVG */}
            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Review us on Google</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Help other guests discover Spice Garden</p>
            </div>
          </div>
          <ExternalLink size={16} className="text-gray-400" />
        </button>

      </div>
    </div>
  );
};

export default Rating;