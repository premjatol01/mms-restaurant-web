"use client";

import React, { useState } from "react";
import {
  Send,
  LoaderCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function InquiryForm({
  subdomain,
  content = {},
  restaurantName,
  contactInfo = {},
}) {
  const fields = content?.fields || {
    name: { enabled: true, required: true },
    mobile: { enabled: true, required: true },
    email: { enabled: true, required: false },
    purpose: { enabled: true, required: false },
    message: { enabled: true, required: true },
  };

  const purposeOptions =
    content?.purposeOptions && content.purposeOptions.length > 0
      ? content.purposeOptions
      : [
          "General Inquiry",
          "Table Reservation",
          "Group Booking",
          "Catering / Events",
          "Feedback",
          "Other",
        ];

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    purpose: purposeOptions[0] || "General Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (fields.name?.enabled && fields.name?.required && !formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (fields.mobile?.enabled) {
      if (fields.mobile?.required && !formData.mobile.trim()) {
        newErrors.mobile = "Please enter your mobile number";
      } else if (
        formData.mobile.trim() &&
        !/^[6-9]\d{9}$/.test(formData.mobile.replace(/\D/g, ""))
      ) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
      }
    }

    if (fields.email?.enabled) {
      if (fields.email?.required && !formData.email.trim()) {
        newErrors.email = "Please enter your email address";
      } else if (
        formData.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (fields.message?.enabled && fields.message?.required && !formData.message.trim()) {
      newErrors.message = "Please write your message or question";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/restaurant/website/public/inquiry/${subdomain}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          email: formData.email.trim(),
          purpose: fields.purpose?.enabled ? formData.purpose : undefined,
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setServerError(data.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      purpose: purposeOptions[0] || "General Inquiry",
      message: "",
    });
    setErrors({});
    setServerError("");
    setIsSubmitted(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Direct Contact & Information Card */}
      <div
        style={{
          backgroundColor: "var(--theme-surface)",
          borderColor: "var(--theme-border)",
        }}
        className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border shadow-sm space-y-6"
      >
        <div>
          <span
            style={{
              backgroundColor: "var(--theme-primary-soft)",
              color: "var(--theme-primary)",
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>We're Here to Help</span>
          </span>
          <h4
            style={{ color: "var(--theme-text)" }}
            className="text-xl sm:text-2xl font-bold"
          >
            {content?.title || "Get in Touch"}
          </h4>
          <p
            style={{ color: "var(--theme-text-muted)" }}
            className="text-xs sm:text-sm mt-2 leading-relaxed"
          >
            {content?.description ||
              "Whether you want to reserve a table, plan an event, or have a question about our menu, drop us a line and our team will get back to you promptly."}
          </p>
        </div>

        <div className="space-y-4 pt-2 border-t" style={{ borderColor: "var(--theme-border)" }}>
          {contactInfo.phone && (
            <div className="flex items-start gap-3">
              <div
                style={{
                  backgroundColor: "var(--theme-primary-soft)",
                  color: "var(--theme-primary)",
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              >
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted" style={{ color: "var(--theme-text-muted)" }}>
                  Call or WhatsApp
                </p>
                <a
                  href={`tel:${contactInfo.phone}`}
                  style={{ color: "var(--theme-text)" }}
                  className="text-sm font-semibold hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>
          )}

          {contactInfo.email && (
            <div className="flex items-start gap-3">
              <div
                style={{
                  backgroundColor: "var(--theme-primary-soft)",
                  color: "var(--theme-primary)",
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              >
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted" style={{ color: "var(--theme-text-muted)" }}>
                  Email Address
                </p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  style={{ color: "var(--theme-text)" }}
                  className="text-sm font-semibold hover:underline break-all"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          )}

          {contactInfo.address && (
            <div className="flex items-start gap-3">
              <div
                style={{
                  backgroundColor: "var(--theme-primary-soft)",
                  color: "var(--theme-primary)",
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted" style={{ color: "var(--theme-text-muted)" }}>
                  Visit Us At
                </p>
                <p
                  style={{ color: "var(--theme-text)" }}
                  className="text-sm font-medium leading-snug"
                >
                  {contactInfo.address}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            backgroundColor: "var(--theme-surface-soft)",
            borderColor: "var(--theme-border)",
          }}
          className="p-4 rounded-xl border flex items-center gap-3"
        >
          <MessageSquare
            className="w-5 h-5 shrink-0"
            style={{ color: "var(--theme-primary)" }}
          />
          <p
            style={{ color: "var(--theme-text-muted)" }}
            className="text-xs leading-relaxed"
          >
            Direct inquiries are forwarded immediately to the manager on duty.
          </p>
        </div>
      </div>

      {/* Right Column: Inquiry Form or Submission Success */}
      <div
        style={{
          backgroundColor: "var(--theme-surface)",
          borderColor: "var(--theme-border)",
        }}
        className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border shadow-sm"
      >
        {isSubmitted ? (
          <div className="py-12 text-center space-y-5 animate-in fade-in zoom-in duration-300">
            <div
              style={{
                backgroundColor: "color-mix(in srgb, #10b981 15%, transparent)",
                color: "#10b981",
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h4
                style={{ color: "var(--theme-text)" }}
                className="text-xl sm:text-2xl font-bold"
              >
                Thank You!
              </h4>
              <p
                style={{ color: "var(--theme-text-muted)" }}
                className="text-sm max-w-md mx-auto"
              >
                Your inquiry has been delivered directly to {restaurantName || "our team"}. We will contact you at{" "}
                <span className="font-semibold" style={{ color: "var(--theme-text)" }}>
                  {formData.mobile}
                </span>{" "}
                shortly.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text)",
              }}
              className="px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4
              style={{ color: "var(--theme-text)" }}
              className="text-lg font-bold pb-1"
            >
              Send a Message
            </h4>

            {serverError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name Field */}
              {fields.name?.enabled && (
                <div>
                  <label
                    style={{ color: "var(--theme-text)" }}
                    className="block text-xs font-semibold mb-1.5"
                  >
                    Your Name {fields.name.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    style={{
                      backgroundColor: "var(--theme-background)",
                      borderColor: errors.name ? "#ef4444" : "var(--theme-border)",
                      color: "var(--theme-text)",
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Mobile Field */}
              {fields.mobile?.enabled && (
                <div>
                  <label
                    style={{ color: "var(--theme-text)" }}
                    className="block text-xs font-semibold mb-1.5"
                  >
                    Mobile Number {fields.mobile.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    style={{
                      backgroundColor: "var(--theme-background)",
                      borderColor: errors.mobile ? "#ef4444" : "var(--theme-border)",
                      color: "var(--theme-text)",
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.mobile}</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Field */}
              {fields.email?.enabled && (
                <div>
                  <label
                    style={{ color: "var(--theme-text)" }}
                    className="block text-xs font-semibold mb-1.5"
                  >
                    Email Address {fields.email.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rahul@example.com"
                    style={{
                      backgroundColor: "var(--theme-background)",
                      borderColor: errors.email ? "#ef4444" : "var(--theme-border)",
                      color: "var(--theme-text)",
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
                  )}
                </div>
              )}

              {/* Purpose Field */}
              {fields.purpose?.enabled && (
                <div>
                  <label
                    style={{ color: "var(--theme-text)" }}
                    className="block text-xs font-semibold mb-1.5"
                  >
                    Purpose of Inquiry {fields.purpose.required && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    style={{
                      backgroundColor: "var(--theme-background)",
                      borderColor: "var(--theme-border)",
                      color: "var(--theme-text)",
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    {purposeOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Message Field */}
            {fields.message?.enabled && (
              <div>
                <label
                  style={{ color: "var(--theme-text)" }}
                  className="block text-xs font-semibold mb-1.5"
                >
                  Message / Special Request {fields.message.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="How can we help you? e.g. Book a table for 4 guests this Sunday at 8 PM..."
                  style={{
                    backgroundColor: "var(--theme-background)",
                    borderColor: errors.message ? "#ef4444" : "var(--theme-border)",
                    color: "var(--theme-text)",
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.message}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "var(--theme-primary)",
                  color: "var(--theme-primary-text)",
                  boxShadow:
                    "0 4px 14px 0 color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
