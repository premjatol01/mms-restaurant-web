"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import CtaTrialModal from "@/components/CtaTrialModal";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isCtaOpen, setIsCtaOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err === "inactive") {
        setError("Your account or restaurant is currently inactive. Please contact administrator.");
      } else if (err === "token_expired") {
        setError("Your session has expired (12-hour limit reached). Please sign in again.");
      } else if (err === "session_expired") {
        setError("Your session has expired. Please sign in again.");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (data.success) {
        // Store locally on web client
        localStorage.setItem("restaurant_token", data.data.token);
        localStorage.setItem("restaurant_user", JSON.stringify(data.data.user));
        if (data.data.refreshToken) {
          localStorage.setItem("restaurant_refresh_token", data.data.refreshToken);
        } else {
          localStorage.removeItem("restaurant_refresh_token");
        }
        localStorage.setItem("restaurant_remember", rememberMe ? "true" : "false");

        // Redirect to the restaurant-admin panel (running on port 3002)
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002";
        const queryParams = new URLSearchParams({
          token: data.data.token,
          remember: rememberMe ? "1" : "0",
        });
        if (data.data.refreshToken) {
          queryParams.set("refreshToken", data.data.refreshToken);
        }

        window.location.href = `${adminUrl}?${queryParams.toString()}`;
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] flex">
      {/* Left side - Tablly Branding & Features Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#c93b07] via-[#d9480f] to-[#f76707] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-400 opacity-15 blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">Tablly</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 tracking-wider">
                  Cloud
                </span>
              </div>
              <span className="text-[11px] text-white/80 font-medium">Smart Restaurant OS</span>
            </div>
          </Link>
        </div>

        {/* Middle Feature Content */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Restaurant Partner Console</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white tracking-tight">
            Seamless Floor, Kitchen & Billing Operations
          </h1>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed">
            Sign in to access your live table sessions, instant kitchen KOT stream, customized QR standees, and daily revenue settlements.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/95">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Live Table Sessions & 1-Click Bill Settlement</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/95">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Real-Time Kitchen Order Tickets (KOT)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/95">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Contactless QR Ordering & Branded Web Menu</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/20 text-xs text-white/85">
            <div className="flex -space-x-2">
              {["UG", "SM", "RD", "KC"].map((initial, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#d9480f] bg-white text-[#d9480f] flex items-center justify-center text-[10px] font-bold shadow-xs"
                >
                  {initial}
                </div>
              ))}
            </div>
            <span>Trusted by <strong>1,200+ restaurants</strong> across India</span>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/70">
          &copy; {new Date().getFullYear()} Tablly Technologies. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#ede4dc]">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="lg:hidden flex justify-center mb-3">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d9480f] text-white flex items-center justify-center shadow-md">
                  <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl text-[#2b2118]">Tablly</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#d9480f]/10 text-[#d9480f] border border-[#d9480f]/20">
                    Cloud
                  </span>
                </div>
              </Link>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2b2118] tracking-tight mb-1">
              Restaurant Partner Login
            </h2>
            <p className="text-xs sm:text-sm text-[#786154]">
              Enter your registered credentials to access your restaurant dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-[#2b2118]">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#786154]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-[#ede4dc] rounded-lg bg-[#fffaf5] text-[#2b2118] text-sm focus:ring-2 focus:ring-[#d9480f]/30 focus:border-[#d9480f] outline-none transition-colors"
                  placeholder="admin@yourrestaurant.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold text-[#2b2118]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#786154]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2.5 border border-[#ede4dc] rounded-lg bg-[#fffaf5] text-[#2b2118] text-sm focus:ring-2 focus:ring-[#d9480f]/30 focus:border-[#d9480f] outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#786154] hover:text-[#d9480f] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[#d9480f] rounded border-gray-300 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-[#786154] cursor-pointer">
                  Remember me (Stay logged in)
                </label>
              </div>

              <div className="text-xs">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-[#d9480f] hover:text-[#c93b07] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-[#d9480f]/20 text-sm font-bold text-white bg-[#d9480f] hover:bg-[#c93b07] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d9480f] transition-all gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? "Signing In..." : "Sign In to Dashboard"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Connect to Us */}
          <div className="mt-6 pt-5 border-t border-[#ede4dc] text-center text-xs text-[#786154]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setIsCtaOpen(true)}
              className="font-bold text-[#d9480f] hover:text-[#c93b07] transition-colors cursor-pointer hover:underline inline-flex items-center gap-1"
            >
              Connect to us
            </button>
          </div>
        </div>
      </div>

      <CtaTrialModal
        isOpen={isCtaOpen}
        onClose={() => setIsCtaOpen(false)}
      />
    </div>
  );
}
