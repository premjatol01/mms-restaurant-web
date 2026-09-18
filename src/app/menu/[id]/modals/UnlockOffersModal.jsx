"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { X, ChevronRight, ShieldCheck } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

const UnlockOffersModal = ({ onClose }) => {
  const { mobile, setMobileNumber, sendOtp, verifyOtp, skipLogin } =
    useMenuOrder();

  const [step, setStep] = useState(mobile.otpSent ? "otp" : "phone");
  const [otpValue, setOtpValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = () => {
    setSubmitting(true);
    const result = sendOtp();
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("OTP sent on WhatsApp");
    setStep("otp");
  };

  const handleVerify = () => {
    setSubmitting(true);
    const result = verifyOtp(otpValue);
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("You're in! Offers unlocked for this table.");
    // The store already closes the modal (offersModalOpen: false) on
    // success, but call onClose too in case a caller wired it separately.
    onClose?.();
  };

  const handleSkip = () => {
    skipLogin();
    onClose?.();
  };

  return (
    <div className="absolute bottom-0 z-99 left-0 bg-surface w-full max-w-md rounded-t-[32px] p-6 pb-8 shadow-lg animate-in slide-in-from-bottom-8 duration-300">
      {/* Top Drag Handle Indicator */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-border rounded-full sm:hidden" />

      {/* Close Button */}
      <button
        onClick={handleSkip}
        aria-label="Close"
        className="absolute -top-3.5 right-5 p-2 text-text-muted hover:text-text-primary hover:bg-surface-soft rounded-full transition-colors bg-surface hover:shadow-md"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      {step === "phone" ? (
        <>
          {/* Content Section */}
          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">
              Unlock Table Offers
            </h3>
            <h2 className="text-2xl leading-tight font-medium text-text-primary mb-4">
              Get offers made for you
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              Login with your mobile number to apply offers and get order
              updates on WhatsApp.
            </p>
          </div>

          {/* Input Field Section */}
          <div className="mb-6">
            <div className="flex items-center border border-primary/40 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all">
              <div className="bg-surface pl-4 pr-3 py-4 text-text-secondary font-medium text-sm">
                +91
              </div>
              <div className="w-px h-6 bg-border" />
              <input
                type="tel"
                value={mobile.number}
                onChange={(e) =>
                  setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="Enter mobile number"
                className="flex-1 px-3 py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-70 text-text-on-primary font-bold rounded-xl py-4 px-6 flex items-center justify-center transition-colors"
            >
              <span className="text-[15px]">Continue with WhatsApp</span>
              <ChevronRight size={18} className="ml-1" strokeWidth={3} />
            </button>

            <button
              onClick={handleSkip}
              className="w-full py-2 text-center text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
            >
              Skip for now
            </button>
          </div>
        </>
      ) : (
        <>
          {/* OTP Step */}
          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">
              Verify your number
            </h3>
            <h2 className="text-2xl leading-tight font-medium text-text-primary mb-4">
              Enter the code we sent
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              We sent a 4-digit code on WhatsApp to{" "}
              <span className="font-semibold text-text-primary">
                +91 {mobile.number}
              </span>
              .
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center border border-primary/40 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all">
              <div className="bg-surface pl-4 pr-3 py-4 text-text-secondary flex items-center">
                <ShieldCheck size={18} />
              </div>
              <div className="w-px h-6 bg-border" />
              <input
                type="tel"
                value={otpValue}
                onChange={(e) =>
                  setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="4-digit code"
                autoFocus
                className="flex-1 px-3 py-4 text-sm tracking-[0.3em] text-text-primary placeholder:tracking-normal placeholder:text-text-muted focus:outline-none w-full"
              />
            </div>
            <p className="text-[11px] text-text-muted mt-2">
              Any 4 digits work in this demo.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleVerify}
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-70 text-text-on-primary font-bold rounded-xl py-4 px-6 flex items-center justify-center transition-colors"
            >
              <span className="text-[15px]">Verify &amp; continue</span>
              <ChevronRight size={18} className="ml-1" strokeWidth={3} />
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("phone")}
                className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
              >
                Change number
              </button>
              <button
                onClick={handleSkip}
                className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UnlockOffersModal;
