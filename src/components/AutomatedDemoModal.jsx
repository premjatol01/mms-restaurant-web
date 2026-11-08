"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ShoppingBag,
  ChefHat,
  CheckCircle2,
  Tag,
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Sparkles,
} from "lucide-react";

const STEPS = [
  { id: 1, shortLabel: "Menu", title: "Select Item", subtitle: "Browsing digital QR menu" },
  { id: 2, shortLabel: "Mobile", title: "Mobile Sync", subtitle: "OTP-less customer sync" },
  { id: 3, shortLabel: "Offer", title: "Apply Offer", subtitle: "Redeeming coupon WELCOME50" },
  { id: 4, shortLabel: "Kitchen", title: "Place Order", subtitle: "Instant KOT sent to kitchen" },
  { id: 5, shortLabel: "Served", title: "Food Served", subtitle: "Delivered & bill requested" },
  { id: 6, shortLabel: "Paid", title: "Counter Paid", subtitle: "Settled & table session freed" },
];

const STEP_DURATION = 3500; // ms per step

export default function AutomatedDemoModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  // Strictly sequential auto-advance: exactly 1 step at a time
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev >= 6 ? 1 : prev + 1));
    }, STEP_DURATION);

    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, currentStep]);

  // Step change handlers
  const handleSelectStep = (stepId) => {
    setCurrentStep(stepId);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev <= 1 ? 6 : prev - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => (prev >= 6 ? 1 : prev + 1));
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl md:max-w-2xl bg-[#fffaf5] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#ede4dc] overflow-hidden flex flex-col my-auto max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="bg-[#2b2118] text-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#d9480f] flex items-center justify-center text-white shrink-0">
              <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-xs sm:text-sm">Automated Live Demo</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Interactive
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/60 hidden sm:block">
                Table-side QR ordering to kitchen KOT walkthrough
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title={isPlaying ? "Pause simulation" : "Play simulation"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Restart from Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Restart</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
              aria-label="Close demo"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Line (animates smoothly for each sequential step) */}
        <div className="w-full h-1 bg-[#ede4dc] overflow-hidden shrink-0">
          <div
            key={`${currentStep}-${isPlaying}`}
            className={`h-full bg-gradient-to-r from-[#d9480f] to-[#f76707] ${
              isPlaying ? "animate-demo-progress" : "w-full"
            }`}
          />
        </div>

        {/* 6 Clickable Step Tabs (Fully Responsive on All Screens) */}
        <div className="bg-white border-b border-[#ede4dc] p-1.5 sm:p-2 shrink-0">
          <div className="grid grid-cols-6 gap-1 sm:gap-1.5 text-center">
            {STEPS.map((step) => {
              const active = currentStep === step.id;
              const completed = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(step.id)}
                  type="button"
                  className={`group relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                    active
                      ? "bg-[#d9480f] text-white shadow-md shadow-[#d9480f]/20 scale-[1.02]"
                      : completed
                      ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70"
                      : "bg-[#fffaf5] text-[#786154] hover:bg-[#ffe8cc]/40"
                  }`}
                  title={`${step.id}. ${step.title}: ${step.subtitle}`}
                >
                  <span
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold mb-0.5 ${
                      active
                        ? "bg-white text-[#d9480f]"
                        : completed
                        ? "bg-emerald-600 text-white"
                        : "bg-[#ede4dc] text-[#786154]"
                    }`}
                  >
                    {completed ? "✓" : step.id}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold leading-tight truncate max-w-full px-0.5">
                    {step.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smartphone Simulation Screen Body */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl border-2 border-[#ede4dc] overflow-hidden select-none relative shrink-0">
            {/* Phone Notch & Status Bar */}
            <div className="bg-[#2b2118] text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-[10px] font-mono">
              <span className="font-semibold">9:41 AM</span>
              <div className="w-16 h-3.5 bg-black rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-emerald-400 font-semibold">100% 🔋</span>
            </div>

            {/* Restaurant Table Header */}
            <div className="px-3 py-2 bg-gradient-to-r from-[#fff4e6] to-[#ffe8cc] border-b border-[#ede4dc] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d9480f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  UG
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2b2118] leading-tight">Urban Green Bistro</h4>
                  <p className="text-[10px] text-[#786154]">Dine-In • Table 04</p>
                </div>
              </div>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#d9480f] border border-[#d9480f]/20 font-bold">
                Session #S-1042
              </span>
            </div>

            {/* Simulated Stages Body */}
            <div className="p-3 sm:p-4 min-h-[310px] sm:min-h-[330px] flex flex-col justify-between">
              {/* STAGE 1: BROWSE & ADD ITEM */}
              {currentStep === 1 && (
                <div className="space-y-2.5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-[#786154] border-b border-[#ede4dc] pb-1.5">
                    <span className="font-bold text-[#2b2118]">Bestsellers</span>
                    <span className="text-[11px]">12 items</span>
                  </div>

                  <div className="p-2.5 rounded-xl border-2 border-[#d9480f] bg-[#fff4e6]/50 shadow-xs flex items-center justify-between gap-2.5 relative">
                    <div className="space-y-0.5">
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded font-bold uppercase">
                        Chef's Special
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-[#2b2118]">
                        Truffle Paneer Burger
                      </h5>
                      <p className="text-[10px] text-[#786154] line-clamp-1">
                        Crispy herb patty, truffle mayo & fresh brioche
                      </p>
                      <div className="font-extrabold text-[#d9480f] text-xs sm:text-sm">₹299</div>
                    </div>

                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-12 h-11 rounded-lg bg-[#ffd8a8] flex items-center justify-center text-lg">
                        🍔
                      </div>
                      <div className="px-2 py-0.5 rounded bg-[#d9480f] text-white text-[10px] font-bold shadow-xs animate-bounce">
                        1 ADDED ✓
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#2b2118] text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-1.5 text-xs">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#d9480f]" />
                      <span>1 Item in Cart • <strong>₹299</strong></span>
                    </div>
                    <span className="text-xs text-[#d9480f] font-bold">View Cart &rarr;</span>
                  </div>
                </div>
              )}

              {/* STAGE 2: ENTER MOBILE NUMBER */}
              {currentStep === 2 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="text-xs font-bold text-[#2b2118] flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#d9480f]" />
                    <span>Customer Details (OTP-less Sync)</span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-[#ede4dc] bg-[#fffaf5] space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#786154]">Mobile Number</label>
                    <div className="flex items-center border border-[#d9480f] bg-white rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#2b2118] shadow-xs">
                      <span className="text-[#786154] mr-1.5">+91</span>
                      <span className="font-bold tracking-wider">98765 43210</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                    </div>
                    <p className="text-[10px] text-emerald-600 font-medium">✓ Phone verified. Order updates sent via WhatsApp/SMS.</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#ede4dc] space-y-1 text-xs">
                    <div className="flex justify-between text-[#786154]">
                      <span>Table Assigned</span>
                      <span className="font-bold text-[#2b2118]">Table 04</span>
                    </div>
                    <div className="flex justify-between text-[#786154]">
                      <span>Selected Dish</span>
                      <span className="font-medium text-[#2b2118]">Truffle Paneer Burger</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: GET OFFER / COUPON */}
              {currentStep === 3 && (
                <div className="space-y-2.5 animate-in fade-in duration-300">
                  <div className="text-xs font-bold text-[#2b2118] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#d9480f]" />
                    <span>Available Table Offers</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500 text-xs space-y-1 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-700 tracking-wider font-mono text-xs">
                        🎁 WELCOME50
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                        APPLIED ✓
                      </span>
                    </div>
                    <p className="text-emerald-800 text-[10px]">Flat 50% discount applied to your table bill!</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#ede4dc] space-y-1 text-xs">
                    <div className="flex justify-between text-[#786154]">
                      <span>Subtotal</span>
                      <span>₹299</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount (50%)</span>
                      <span>-₹150</span>
                    </div>
                    <div className="flex justify-between text-[#786154]">
                      <span>GST (5%)</span>
                      <span>₹7</span>
                    </div>
                    <div className="pt-1.5 border-t border-[#ede4dc] flex justify-between font-extrabold text-xs text-[#2b2118]">
                      <span>Total Payable</span>
                      <span className="text-[#d9480f] text-sm">₹156</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 4: PLACE ORDER TO KITCHEN */}
              {currentStep === 4 && (
                <div className="space-y-3 animate-in fade-in duration-300 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                    <ChefHat className="w-6 h-6 animate-bounce" />
                  </div>

                  <div className="space-y-0.5">
                    <h5 className="font-bold text-sm text-[#2b2118]">Order #1042 Sent to Kitchen!</h5>
                    <p className="text-[11px] text-[#786154]">Instant KOT ticket received on chef display screen</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#fffaf5] border border-amber-300/60 text-xs space-y-1 text-left">
                    <div className="flex justify-between font-semibold text-[#2b2118]">
                      <span>Kitchen Status:</span>
                      <span className="text-amber-600 font-bold animate-pulse">Under Process 🍳</span>
                    </div>
                    <p className="text-[10px] text-[#786154]">1x Truffle Paneer Burger • Est: 8 mins</p>
                  </div>
                </div>
              )}

              {/* STAGE 5: SERVED & BILL REQUEST */}
              {currentStep === 5 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Food Delivered to Table 04!</p>
                      <p className="text-[10px] text-emerald-700">All dishes served hot & fresh</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#ede4dc] text-center space-y-1.5">
                    <p className="text-xs text-[#786154]">Total Table Settle Amount</p>
                    <div className="text-2xl font-extrabold text-[#2b2118]">₹156</div>
                    <div className="py-2 px-3 rounded-lg bg-[#2b2118] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs">
                      <span>Request Bill / Pay at Counter</span> &rarr;
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 6: COUNTER PAYMENT & SESSION END */}
              {currentStep === 6 && (
                <div className="space-y-3 animate-in fade-in duration-300 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div className="space-y-0.5">
                    <h5 className="font-extrabold text-sm text-[#2b2118]">Paid & Session Completed!</h5>
                    <p className="text-[11px] text-emerald-700 font-semibold">Cashier Confirmed (CASH • ₹156)</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-0.5">
                    <p className="font-bold">✨ Table 04 is now Free & Ready for Next Guest</p>
                    <p className="text-[10px] text-emerald-700">Google Review prompt sent to customer phone</p>
                  </div>
                </div>
              )}

              {/* Step Navigation Controls Inside Mockup Footer */}
              <div className="pt-2 border-t border-[#ede4dc] flex items-center justify-between text-xs text-[#786154]">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-2 py-1 rounded bg-[#ede4dc]/50 hover:bg-[#ede4dc] text-[#2b2118] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Prev
                </button>

                <span className="text-[10px] text-[#786154]">
                  Step <strong className="text-[#2b2118]">{currentStep}</strong> of 6
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-2 py-1 rounded bg-[#d9480f] hover:bg-[#c93b07] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  Next <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
