"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  X,
  CheckCircle2,
  Sparkles,
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
  Layers,
  UtensilsCrossed,
  AlertCircle,
  Loader2,
  Clock,
  Compass,
} from "lucide-react";

const RESTAURANT_TYPES = [
  "Cafe",
  "Casual Dining",
  "Fine Dining",
  "Quick Bites",
  "Fast Food",
  "Hotel Restaurant",
  "Bar & Restaurant",
  "Cloud Kitchen",
  "Bakery",
  "Food Court",
  "Food Truck",
  "Dhaba",
  "Other",
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi NCR",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Chandigarh",
  "Other",
];

const RESTAURANT_TYPE_OPTIONS = RESTAURANT_TYPES.map((type) => ({
  value: type,
  label: type,
}));

const INDIAN_STATE_OPTIONS = INDIAN_STATES.map((state) => ({
  value: state,
  label: state,
}));

const PACKAGE_OPTIONS = [
  { value: "skip", label: "— Skip for now (Decide later) —" },
  { value: "Basic", label: "Basic Plan (Up to 15 Tables)" },
  { value: "Standard", label: "Standard Plan (Up to 50 Tables • Most Popular)" },
  { value: "Premium", label: "Premium Plan (Up to 150 Tables)" },
];

const DURATION_OPTIONS = [
  { value: "skip", label: "— Skip for now (Decide later) —" },
  { value: "1_month", label: "1 Month (30 Days)" },
  { value: "6_months", label: "6 Months (180 Days • Save ~17%)" },
  { value: "12_months", label: "12 Months / 1 Year (Save up to 25%)" },
];

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    height: "40px",
    backgroundColor: "#fffaf5",
    borderColor: state.isFocused ? "#d9480f" : "#ede4dc",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(217, 72, 15, 0.25)" : "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#d9480f",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
    height: "38px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#2b2118",
    fontSize: "0.875rem",
    fontWeight: "500",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#a89488",
    fontSize: "0.875rem",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "#2b2118",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#d9480f" : "#786154",
    padding: "4px 8px",
    "&:hover": {
      color: "#d9480f",
    },
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ede4dc",
    overflow: "hidden",
    zIndex: 99999,
  }),
  menuList: (base) => ({
    ...base,
    padding: "4px",
    maxHeight: "200px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#d9480f"
      : state.isFocused
      ? "#fff4e6"
      : "transparent",
    color: state.isSelected
      ? "#ffffff"
      : state.isFocused
      ? "#d9480f"
      : "#2b2118",
    fontSize: "0.8125rem",
    fontWeight: state.isSelected ? "600" : "500",
    borderRadius: "0.375rem",
    padding: "6px 10px",
    cursor: "pointer",
    margin: "1px 0",
    "&:active": {
      backgroundColor: "#c93b07",
      color: "#ffffff",
    },
  }),
};

export default function CtaTrialModal({
  isOpen,
  onClose,
  preselectedPlan = "",
  preselectedDuration = "1_month",
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    restaurantName: "",
    phone: "",
    email: "",
    city: "",
    state: "Maharashtra",
    restaurantType: "Cafe",
    package: preselectedPlan || "Standard",
    duration: preselectedDuration || "1_month",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        package: preselectedPlan || prev.package || "Standard",
        duration: preselectedDuration || prev.duration || "1_month",
      }));
      setSubmitted(false);
      setErrorMsg("");
    }
  }, [preselectedPlan, preselectedDuration, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile / WhatsApp number.");
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const hasPlan = Boolean(formData.package && formData.package !== "skip");
      const hasDuration = Boolean(formData.duration && formData.duration !== "skip");

      let durationLabel = "Decide later";
      if (formData.duration === "1_month") durationLabel = "1 Month (30 Days)";
      else if (formData.duration === "6_months") durationLabel = "6 Months (180 Days)";
      else if (formData.duration === "12_months") durationLabel = "12 Months / 1 Year";

      const notesParts = [
        "Website CTA Signup",
        hasPlan ? `Package: ${formData.package}` : "Package: Skipped (Decide later)",
        hasDuration ? `Duration: ${durationLabel}` : "Duration: Skipped",
        `Type: ${formData.restaurantType}`,
        `Location: ${formData.city.trim()}, ${formData.state.trim()}`,
      ];

      const payload = {
        restaurantName: formData.restaurantName.trim(),
        contactPerson: formData.fullName.trim(),
        phone: cleanPhone,
        email: formData.email.trim(),
        restaurantType: formData.restaurantType,
        address: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: "India",
        },
        stage: "prospect",
        status: "active",
        notes: notesParts.join(" | "),
        activity: [
          {
            date: new Date(),
            action: `Lead registered via Website CTA as Prospect (${hasPlan ? formData.package : "Package Skipped"}, ${hasDuration ? durationLabel : "Duration Skipped"})`,
          },
        ],
      };

      const res = await fetch(`${apiUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error creating lead from CTA modal:", err);
      setErrorMsg(err.message || "Failed to submit. Please check your network connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ede4dc] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#d9480f] to-[#f76707] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base sm:text-lg">Connect With Us & Start Free Trial</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-extrabold text-[#2b2118]">You're All Set!</h4>
            <p className="text-sm text-[#786154] leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-[#2b2118]">{formData.fullName || "Partner"}</strong>. We’ve registered your details for{" "}
              <strong className="text-[#2b2118]">{formData.restaurantName || "your restaurant"}</strong> in{" "}
              <strong className="text-[#2b2118]">{formData.city}, {formData.state}</strong>.
            </p>
            <div className="p-4 rounded-xl bg-[#fff4e6] border border-[#d9480f]/20 text-xs text-[#786154] text-left space-y-1.5">
              <div className="flex items-center gap-2 text-[#2b2118] font-semibold">
                <span>⚡ What happens next:</span>
              </div>
              <p>• Your restaurant lead is registered under the <strong>Prospect</strong> stage in our admin console.</p>
              <p>• Our restaurant onboarding specialist will WhatsApp or call you at <strong>+91 {formData.phone}</strong>.</p>
              <p>• We will walk you through your digital menu, QR standees, and kitchen display setup within 15 minutes.</p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 max-h-[82vh] overflow-y-auto">
            <p className="text-xs text-[#786154]">
              Fill your restaurant details below to connect with our team and activate your 14-day free trial.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Full Name & Restaurant Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2b2118] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#786154]" /> Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4dc] bg-[#fffaf5] text-[#2b2118] focus:outline-none focus:ring-2 focus:ring-[#d9480f]/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2b2118] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#786154]" /> Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spice Symphony Cafe"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4dc] bg-[#fffaf5] text-[#2b2118] focus:outline-none focus:ring-2 focus:ring-[#d9480f]/40"
                />
              </div>
            </div>

            {/* 2. Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2b2118] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#786154]" /> Mobile / WhatsApp *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-2.5 text-xs bg-[#ede4dc]/50 text-[#786154] border border-r-0 border-[#ede4dc] rounded-l-lg font-mono font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                    className="w-full text-sm px-3 py-2 rounded-r-lg border border-[#ede4dc] bg-[#fffaf5] text-[#2b2118] focus:outline-none focus:ring-2 focus:ring-[#d9480f]/40 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2b2118] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#786154]" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="owner@restaurant.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4dc] bg-[#fffaf5] text-[#2b2118] focus:outline-none focus:ring-2 focus:ring-[#d9480f]/40"
                />
              </div>
            </div>

            {/* 3. City & State (using react-select for state) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2b2118] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#786154]" /> City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai / Jaipur / Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4dc] bg-[#fffaf5] text-[#2b2118] focus:outline-none focus:ring-2 focus:ring-[#d9480f]/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2b2118] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#786154]" /> State *
                </label>
                <Select
                  instanceId="cta-state-select"
                  options={INDIAN_STATE_OPTIONS}
                  value={INDIAN_STATE_OPTIONS.find((opt) => opt.value === formData.state) || null}
                  onChange={(opt) => setFormData({ ...formData, state: opt?.value || "" })}
                  styles={customSelectStyles}
                  menuPortalTarget={isMounted ? document.body : null}
                  menuPosition="fixed"
                  placeholder="Select State..."
                  isSearchable
                />
              </div>
            </div>

            {/* 4. Restaurant Type (using react-select) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2b2118] flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#786154]" /> Restaurant Type *
              </label>
              <Select
                instanceId="cta-type-select"
                options={RESTAURANT_TYPE_OPTIONS}
                value={RESTAURANT_TYPE_OPTIONS.find((opt) => opt.value === formData.restaurantType) || null}
                onChange={(opt) => setFormData({ ...formData, restaurantType: opt?.value || "Cafe" })}
                styles={customSelectStyles}
                menuPortalTarget={isMounted ? document.body : null}
                menuPosition="fixed"
                placeholder="Select Restaurant Type..."
                isSearchable
              />
            </div>

            {/* 5. Package & Duration (using react-select, Optional - User May Skip) */}
            <div className="pt-2 border-t border-[#ede4dc] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2b2118] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#d9480f]" />
                  <span>Package & Duration</span>
                </label>
                <span className="text-[10px] text-[#786154] bg-[#ffe8cc]/60 px-2 py-0.5 rounded-full font-medium">
                  Optional • You may skip this
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Package react-select */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#786154]">Package</label>
                  <Select
                    instanceId="cta-package-select"
                    options={PACKAGE_OPTIONS}
                    value={PACKAGE_OPTIONS.find((opt) => opt.value === formData.package) || PACKAGE_OPTIONS[0]}
                    onChange={(opt) => setFormData({ ...formData, package: opt?.value || "skip" })}
                    styles={customSelectStyles}
                    menuPortalTarget={isMounted ? document.body : null}
                    menuPosition="fixed"
                    placeholder="Select Package..."
                    isSearchable={false}
                  />
                </div>

                {/* Duration react-select */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#786154] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#786154]" /> Duration
                  </label>
                  <Select
                    instanceId="cta-duration-select"
                    options={DURATION_OPTIONS}
                    value={DURATION_OPTIONS.find((opt) => opt.value === formData.duration) || DURATION_OPTIONS[0]}
                    onChange={(opt) => setFormData({ ...formData, duration: opt?.value || "skip" })}
                    styles={customSelectStyles}
                    menuPortalTarget={isMounted ? document.body : null}
                    menuPosition="fixed"
                    placeholder="Select Duration..."
                    isSearchable={false}
                  />
                </div>
              </div>
            </div>

            {/* CTA Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-bold text-sm transition-all shadow-lg shadow-[#d9480f]/25 disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Your Details...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Connect to Us & Start 14-Day Free Trial</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#786154] text-center mt-1.5">
                🔒 Zero spam. We never share your phone number or email with third parties.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
