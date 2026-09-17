import React from "react";
import {
  ChevronRight,
  History,
  Plus,
  Minus,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { useMenuOrder } from "@/context/Menuordercontext";

// Reusable Quantity Selector Component
const QuantitySelector = ({ quantity }) => (
  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white mt-3 w-fit">
    <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors">
      <Minus size={14} />
    </button>
    <span className="px-3 py-1 text-sm font-semibold text-gray-900">
      {quantity}
    </span>
    <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors">
      <Plus size={14} />
    </button>
  </div>
);

// Reusable Order Item Component
const OrderItem = ({ title, description, price, quantity, imageSrc }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
    {/* Food Image */}
    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100 p-2">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-contain"
      />
    </div>

    {/* Details */}
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <span className="text-sm font-bold text-gray-900">{price}</span>
      </div>
      <p className="text-[11px] text-gray-500 mt-1 leading-snug pr-4">
        {description}
      </p>

      {/* Quantity Selector */}
      <QuantitySelector quantity={quantity} />
    </div>
  </div>
);

const Cart = () => {
  const { setActiveTab } = useMenuOrder();

  return (
    <div className="min-h-screen bg-[#f4f6f5] p-4 font-sans text-gray-900 flex justify-center">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between px-1 py-2">
          <h1 className="text-xl font-medium text-gray-800">Your Order</h1>
          <span className="text-xs font-bold text-[#1b5e41]">Table 05</span>
        </div>

        {/* Order History Banner */}
        <div
          onClick={() => setActiveTab("History")}
          className="bg-[#e8f5ee] border border-emerald-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-1.5 mr-3 shadow-sm border border-emerald-50">
              <History size={18} className="text-[#1b5e41]" />
            </div>
            <div>
              <h3 className="text-[#1b5e41] font-bold text-sm">
                Order History
              </h3>
              <p className="text-[#1b5e41]/80 text-[11px] mt-0.5">
                View your previous orders
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#1b5e41]" />
        </div>

        {/* Order Items */}
        <OrderItem
          title="Smoked Paneer Tikka"
          description="₹420 · Charred paneer, kasundi & pickled onion"
          price="₹420"
          quantity={1}
          // Placeholder for the paneer image
          imageSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f59e0b'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/%3E%3C/svg%3E"
        />
        <OrderItem
          title="Truffle Dal Makhani"
          description="₹390 · Slow-cooked black lentils, smoked butter"
          price="₹390"
          quantity={1}
          // Placeholder for the dal image
          imageSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ea580c'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/%3E%3C/svg%3E"
        />

        {/* Applied Offer */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle size={18} className="text-[#1b5e41] mr-2" />
            <div>
              <span className="text-xs font-bold text-[#1b5e41] mr-2">
                10% offer applied
              </span>
              <span className="text-[10px] text-gray-500">
                You are saving ₹10 on this order
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#1b5e41]">-₹10</span>
        </div>

        {/* Mobile Number Input Section */}
        <div className="bg-[#f0f9f4] border border-[#d1e7dd] rounded-2xl p-4">
          <div className="flex items-center mb-3">
            <MessageCircle size={16} className="text-[#1b5e41] mr-2" />
            <h3 className="text-xs font-bold text-[#1b5e41]">
              Mobile number required for this offer
            </h3>
          </div>

          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="10-digit mobile number"
              className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4a9b6d] focus:ring-1 focus:ring-[#4a9b6d] transition-all placeholder:text-gray-400"
            />
            <button className="bg-[#72b28d] hover:bg-[#609b78] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
              Send OTP
            </button>
          </div>
          <p className="text-[10px] text-[#1b5e41]/70 mt-2">
            We'll send a one-time code on WhatsApp.
          </p>
        </div>

        {/* Bill Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹810</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Offer discount</span>
              <span className="font-medium text-gray-900">-₹10</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">
                Total to pay
              </span>
              <span className="text-base font-bold text-gray-900">₹810</span>
            </div>
          </div>

          {/* Final Actions */}
          <div className="space-y-3">
            <input
              type="tel"
              placeholder="Mobile number (required above)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#4a9b6d] focus:ring-1 focus:ring-[#4a9b6d] transition-all placeholder:text-gray-400"
            />

            <div className="bg-[#f0f9f4] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#1b5e41]">
                Payment is collected manually by the restaurant after your table
                order.
              </p>
            </div>

            <button className="w-full bg-[#72b28d] hover:bg-[#609b78] text-white font-bold rounded-xl py-4 flex items-center justify-center transition-colors">
              Verify WhatsApp to place order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
