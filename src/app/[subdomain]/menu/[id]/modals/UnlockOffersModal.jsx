"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, ChevronRight, ShieldCheck } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

const UnlockOffersModal = ({ onClose }) => {
  const { mobile, setMobileNumber, sendOtp, verifyOtp, skipLogin, offersModalContext } =
    useMenuOrder();

  const [step, setStep] = useState(
    mobile.otpSent && mobile.number ? "otp" : "phone"
  );
  const [otpValue, setOtpValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Prevent background page scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      const result = await sendOtp();
      setSubmitting(false);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      const otpCode = result.otp || result.devCode;
      if (otpCode) {
        toast.success(`Your OTP is: ${otpCode}`, {
          description: "Use this code to verify (Testing Mode)",
          duration: 10000,
        });
        setOtpValue(otpCode); // Auto-fill in test mode for testing speed!
      } else {
        toast.success(result.message || "OTP sent successfully!");
      }
      setResendCooldown(30);
      setStep("otp");
    } catch {
      setSubmitting(false);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || submitting) return;
    await handleContinue();
  };

  const handleVerify = async () => {
    setSubmitting(true);
    try {
      const result = await verifyOtp(otpValue);
      setSubmitting(false);

      if (!result.ok) {
        toast.error(result.error || "Verification failed");
        return;
      }
      const isRepeat = result.data?.customer?.isRepeatCustomer || (result.data?.customer?.totalVisits > 1);
      if (isRepeat) {
        toast.success(`Welcome back! You've visited ${result.data?.customer?.totalVisits} times. Offers unlocked!`);
      } else {
        toast.success("Welcome! Your mobile number is verified.");
      }
      onClose?.();
    } catch {
      setSubmitting(false);
      toast.error("Something went wrong during verification.");
    }
  };

  const handleSkip = () => {
    skipLogin();
    onClose?.();
  };

  const isReviewContext = offersModalContext === "review";

  return (
    // Fixed viewport overlay: pins bottom sheet to screen bottom on mobile and prevents scrolling upside
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleSkip}
    >
      <div
        className="relative w-full max-w-md rounded-t-[32px] bg-surface p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={handleSkip}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary hover:bg-surface-soft rounded-full transition-colors"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {step === "phone" ? (
          <>
            {/* Content Section */}
            <div className="mb-8 pr-8">
              <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">
                {isReviewContext ? "Verify Your Number" : "Unlock Table Offers"}
              </h3>
              <h2 className="text-2xl leading-tight font-medium text-text-primary mb-4">
                {isReviewContext ? "Verify to submit review" : "Get offers made for you"}
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                {isReviewContext
                  ? "Please verify your mobile number on WhatsApp to submit your table review."
                  : "Login with your mobile number to apply offers and get order updates on WhatsApp."}
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
                    setMobileNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
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
                <span className="text-[15px]">{isReviewContext ? "Verify with WhatsApp" : "Continue with WhatsApp"}</span>
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
            <div className="mb-8 pr-8">
              <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">
                Verify your number
              </h3>
              <h2 className="text-2xl leading-tight font-medium text-text-primary mb-4">
                Enter the code we sent
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                We sent a verification code on WhatsApp to{" "}
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
                    setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit code"
                  autoFocus
                  className="flex-1 px-3 py-4 text-sm tracking-[0.25em] text-text-primary placeholder:tracking-normal placeholder:text-text-muted focus:outline-none w-full"
                />
              </div>

              {/* Testing OTP hint badge so the code is always visible */}
              {(mobile.otp || mobile.devCode) && (
                <div 
                  onClick={() => setOtpValue(mobile.otp || mobile.devCode)}
                  className="mt-2 py-1.5 px-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between cursor-pointer hover:bg-primary/15 transition-colors"
                >
                  <span className="text-xs text-text-secondary">
                    Testing OTP: <strong className="text-primary font-mono text-sm tracking-wider">{mobile.otp || mobile.devCode}</strong>
                  </span>
                  <span className="text-[11px] text-primary font-medium">Click to fill</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-2.5">
                <p className="text-[11px] text-text-muted">
                  {mobile.otp || mobile.devCode
                    ? `Testing OTP: ${mobile.otp || mobile.devCode}`
                    : "Check your WhatsApp for the code"}
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || submitting}
                  className={`text-[11px] font-semibold transition-colors ${
                    resendCooldown > 0
                      ? "text-text-muted cursor-not-allowed"
                      : "text-primary hover:underline cursor-pointer"
                  }`}
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>
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
                  onClick={() => {
                    setMobileNumber("");
                    setStep("phone");
                  }}
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
    </div>
  );
};

export default UnlockOffersModal;