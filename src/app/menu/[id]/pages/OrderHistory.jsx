import React from 'react';
import { ChevronLeft, Receipt, Plus } from 'lucide-react';

// Reusable Order Card Component
const OrderCard = ({ orderNumber, date, price, items }) => {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100/80 mb-4 last:mb-0">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center">
          {/* Receipt Icon */}
          <div className="bg-[#eaf5ef] p-3 rounded-2xl flex items-center justify-center">
            <Receipt size={22} className="text-[#166534]" strokeWidth={1.5} />
          </div>
          
          {/* Order Details */}
          <div>
            <h3 className="text-[17px] font-bold text-gray-900 mb-0.5">
              Order #{orderNumber}
            </h3>
            <p className="text-[13px] text-gray-500 font-medium">
              {date}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="text-[19px] font-bold text-gray-900 mt-1">
          ₹{price}
        </div>
      </div>

      {/* Items Summary */}
      <div className="pb-4 border-b border-gray-100">
        <p className="text-[14px] text-gray-500 line-clamp-1">
          {items}
        </p>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center pt-4">
        
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#166534]"></div>
          <span className="text-[13px] font-bold text-[#166534]">
            Completed
          </span>
        </div>

        {/* Reorder Button */}
        <button className="bg-[#eaf5ef] hover:bg-[#d5eadf] text-[#166534] text-[14px] font-bold py-2 px-4 rounded-[12px] flex items-center gap-1.5 transition-colors">
          Reorder
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
};

const OrderHistory = () => {
  // Mock data matching the design
  const orders = [
    {
      id: '1021',
      date: '12 Sep 2026 · 8:42 PM',
      price: '1260',
      items: 'Paneer Tikka, Dal Makhani + 2 more',
    },
    {
      id: '1014',
      date: '04 Sep 2026 · 7:18 PM',
      price: '760',
      items: 'Tandoori Paneer Pizza + 1 more',
    },
    {
      id: '998',
      date: '28 Aug 2026 · 9:05 PM',
      price: '920',
      items: 'Lamb Rogan Josh, Kulfi',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 font-sans text-gray-900 flex justify-center">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center py-4 mb-2">
          <button className="p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors mr-4">
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-[22px] font-medium text-gray-900 leading-tight">Order History</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Your previous Spice Garden orders</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="mt-4">
          {orders.map((order) => (
            <OrderCard 
              key={order.id}
              orderNumber={order.id}
              date={order.date}
              price={order.price}
              items={order.items}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default OrderHistory;