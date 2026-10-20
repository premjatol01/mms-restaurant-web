"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  QrCode,
  Smartphone,
  ChefHat,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  Users,
  ChevronDown,
  Star,
  Layers,
  Receipt,
  Coffee,
  Menu,
  X,
  Flame,
  Check,
  TrendingUp,
  CreditCard,
  Building2,
} from "lucide-react";

export default function MarketingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("guest");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#2b2118] selection:bg-[#d9480f] selection:text-white font-sans antialiased">
      {/* ───────────────── TOP ANNOUNCEMENT BAR ───────────────── */}
      <div className="bg-gradient-to-r from-[#c93b07] via-[#d9480f] to-[#f76707] text-white text-xs md:text-sm font-medium py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
          New
        </span>
        <span>Introducing Tablly 2.0: Instant Table-Side Ordering & Real-Time Kitchen Sync</span>
        <a href="#demo" className="underline underline-offset-2 hover:opacity-90 font-semibold ml-1">
          Explore Demo &rarr;
        </a>
      </div>

      {/* ───────────────── NAVIGATION BAR ───────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fffaf5]/90 border-b border-[#ede4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f76707] to-[#d9480f] flex items-center justify-center shadow-lg shadow-[#d9480f]/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#2b2118] flex items-center gap-1.5">
                Tablly
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#d9480f]/10 text-[#ff922b] border border-[#d9480f]/25">
                  Cloud
                </span>
              </span>
              <span className="text-[11px] text-[#786154] -mt-1 hidden sm:block">Smart Restaurant OS</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#786154]">
            <a href="#features" className="hover:text-[#d9480f] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#d9480f] transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-[#d9480f] transition-colors">
              Interactive Preview
            </a>
            <a href="#pricing" className="hover:text-[#d9480f] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#d9480f] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#786154] hover:text-[#2b2118] px-3.5 py-2 rounded-lg hover:bg-[#ffe8cc]/50 transition-all"
            >
              Restaurant Login
            </Link>
            <a
              href="#pricing"
              className="text-sm font-semibold bg-[#d9480f] hover:bg-[#c93b07] text-white px-4 py-2 rounded-lg shadow-lg shadow-[#d9480f]/25 transition-all hover:shadow-[#d9480f]/40 hover:-translate-y-0.5 cursor-pointer"
            >
              Get Started Free
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#786154] hover:text-[#2b2118] hover:bg-[#ffe8cc]/50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#ede4dc] bg-[#fffaf5] px-4 pt-3 pb-6 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#786154] hover:text-[#d9480f] font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#786154] hover:text-[#d9480f] font-medium"
            >
              How It Works
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#786154] hover:text-[#d9480f] font-medium"
            >
              Interactive Preview
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#786154] hover:text-[#d9480f] font-medium"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#786154] hover:text-[#d9480f] font-medium"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-[#ede4dc] flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-lg border border-[#d9480f]/30 bg-white text-[#d9480f] font-semibold hover:bg-[#ffe8cc]/40 transition-colors"
              >
                Restaurant Login
              </Link>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-[#d9480f] font-semibold text-white shadow-md shadow-[#d9480f]/20"
              >
                Get Started Free
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ───────────────── HERO SECTION ───────────────── */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ffe8cc]/80 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-[#ffd8a8]/60 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d9480f]/20 bg-[#ffe8cc]/70 text-[#d9480f] text-xs sm:text-sm font-medium">
              <Sparkles className="w-4 h-4 text-[#d9480f] animate-pulse" />
              <span>Next-Generation Restaurant Table Commerce</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#2b2118] leading-[1.12]">
              Turn Every Table Into a <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#d9480f] via-[#f76707] to-[#d9480f] bg-clip-text text-transparent">
                High-Revenue Digital Counter
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg md:text-xl text-[#786154] leading-relaxed font-normal">
              Empower your diners to scan, browse delicious visual menus, order, and pay right from their phone with
              <span className="text-[#2b2118] font-semibold"> zero apps to install</span>. Instant kitchen KOT sync, 35% faster table turnover, and happy repeat guests.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-bold text-base shadow-xl shadow-[#d9480f]/25 transition-all hover:shadow-[#d9480f]/40 hover:-translate-y-0.5"
              >
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#d9480f]/35 bg-white hover:bg-[#ffe8cc]/40 text-[#d9480f] font-semibold shadow-sm text-base transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#d9480f]" />
                <span>Try Live Demo</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#786154]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d9480f]" />
                <span>No Credit Card Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d9480f]" />
                <span>Works on iOS & Android</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d9480f]" />
                <span>Ready in 5 Minutes</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-2 sm:p-4 bg-white border border-[#ede4dc] shadow-2xl shadow-[#d9480f]/5">
              {/* Browser/Window Header */}
              <div className="flex items-center justify-between pb-3 px-3 border-b border-[#ede4dc] text-xs text-[#786154]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#d9480f]/80 inline-block" />
                  <span className="ml-3 font-mono text-[11px] text-[#786154] hidden sm:inline">
                    https://urbancafe.tablly.com/menu/TBL-04
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#d9480f] bg-[#ffe8cc]/70 px-2 py-0.5 rounded border border-[#d9480f]/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9480f] animate-ping" />
                    Table 04 Active
                  </span>
                </div>
              </div>

              {/* Showcase Grid inside mock */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 bg-[#fffaf5] rounded-xl mt-3 border border-[#ede4dc]">
                {/* Left Card: QR Standee preview */}
                <div className="md:col-span-4 flex flex-col justify-between p-5 rounded-xl bg-white border border-[#ede4dc] text-center shadow-sm">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffe8cc]/70 border border-[#d9480f]/25 text-[#d9480f] text-xs font-semibold mb-3">
                      <QrCode className="w-3.5 h-3.5" />
                      Tabletop Standee
                    </div>
                    <h3 className="text-lg font-bold text-[#2b2118]">Urban Green Bistro</h3>
                    <p className="text-xs text-[#786154] mt-1">Table #04 • Dine-in Session</p>
                  </div>

                  {/* Simulated QR Code */}
                  <div className="my-5 p-4 bg-white rounded-xl mx-auto w-44 h-44 flex flex-col items-center justify-center shadow-xl">
                    <div className="w-36 h-36 border-4 border-[#2b2118] rounded-lg p-2 flex flex-col items-center justify-center relative bg-[#fff4e6]">
                      <QrCode className="w-24 h-24 text-[#2b2118]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-[#d9480f] text-white rounded p-1 shadow">
                          <UtensilsCrossed className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#786154] leading-snug">
                    Scan with any phone camera to view menu, order food & split the bill.
                  </p>
                </div>

                {/* Right Card: Interactive Phone Interface preview */}
                <div className="md:col-span-8 flex flex-col rounded-xl bg-white border border-[#ede4dc] p-5 space-y-4 shadow-sm">
                  {/* Menu Top bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#ede4dc]">
                    <div>
                      <h4 className="font-bold text-[#2b2118] text-base">Popular Dishes</h4>
                      <p className="text-xs text-[#786154]">Fresh from our kitchen</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-[#fff4e6] px-2.5 py-1 rounded-full text-[#786154] font-medium">
                        ⚡ Prep: ~12 mins
                      </span>
                    </div>
                  </div>

                  {/* Menu Items demo list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Item 1 */}
                    <div className="p-3 rounded-lg bg-[#fffaf5] border border-[#ede4dc] hover:border-[#d9480f]/40 transition-colors flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-[#ffe8cc] border border-[#d9480f]/25 flex items-center justify-center text-[#d9480f] shrink-0">
                        <Flame className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-sm text-[#2b2118] truncate">Truffle Wild Burger</h5>
                          <span className="text-xs font-bold text-[#d9480f]">$14.50</span>
                        </div>
                        <p className="text-[11px] text-[#786154] line-clamp-1 mt-0.5">Brioche, garlic aioli & aged cheddar</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] bg-[#ffe8cc] text-[#d9480f] px-1.5 py-0.5 rounded font-medium">
                            Bestseller
                          </span>
                          <span className="text-xs font-medium text-[#d9480f] bg-[#ffe8cc] font-semibold px-2 py-0.5 rounded cursor-pointer hover:bg-[#d9480f] hover:text-white transition-colors">
                            + Add
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3 rounded-lg bg-[#fffaf5] border border-[#ede4dc] hover:border-[#d9480f]/40 transition-colors flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-[#ffe8cc] border border-[#d9480f]/25 flex items-center justify-center text-[#d9480f] shrink-0">
                        <Coffee className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-sm text-[#2b2118] truncate">Iced Matcha Latte</h5>
                          <span className="text-xs font-bold text-[#d9480f]">$6.20</span>
                        </div>
                        <p className="text-[11px] text-[#786154] line-clamp-1 mt-0.5">Oat milk, ceremonial grade green tea</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] bg-[#ffe8cc] text-[#d9480f] px-1.5 py-0.5 rounded font-medium">
                            Organic
                          </span>
                          <span className="text-xs font-medium text-[#d9480f] bg-[#ffe8cc] font-semibold px-2 py-0.5 rounded cursor-pointer hover:bg-[#d9480f] hover:text-white transition-colors">
                            + Add
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Instant Checkout Bar Mock */}
                  <div className="mt-auto pt-3 border-t border-[#ede4dc] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ffe8cc] text-[#d9480f] flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#2b2118]">2 items selected</div>
                        <div className="text-[11px] text-[#786154]">Subtotal: $20.70</div>
                      </div>
                    </div>
                    <button className="bg-[#d9480f] hover:bg-[#c93b07] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-[#d9480f]/20">
                      <span>Place Table Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── STATS & SOCIAL PROOF ───────────────── */}
      <section className="py-12 border-y border-[#ede4dc] bg-[#fff4e6]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2b2118]">
                <span className="text-[#d9480f]">35</span>%
              </div>
              <p className="text-xs sm:text-sm text-[#786154] font-medium">Faster Table Turnover</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2b2118]">
                <span className="text-[#d9480f]">+24</span>%
              </div>
              <p className="text-xs sm:text-sm text-[#786154] font-medium">Average Order Value (AOV)</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2b2118]">
                <span className="text-[#d9480f]">0</span> sec
              </div>
              <p className="text-xs sm:text-sm text-[#786154] font-medium">Wait Time For Menus</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2b2118]">
                <span className="text-[#d9480f]">99.9</span>%
              </div>
              <p className="text-xs sm:text-sm text-[#786154] font-medium">Platform Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── KEY FEATURES GRID ───────────────── */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Everything Your Restaurant Needs
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              Built to Solve Real Floor & Kitchen Bottlenecks
            </h3>
            <p className="text-[#786154] text-sm sm:text-base">
              Say goodbye to printed menus that get dirty, understaffed lunch rushes, and order mistakes. Tablly streamlines the full dining lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#ffe8cc] border border-[#d9480f]/25 text-[#d9480f] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Unique Table QR Codes</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Generate high-resolution printable QR codes per table with automatic session identification. Diners scan and order without creating an account.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#ffe8cc] border border-[#d9480f]/25 text-[#d9480f] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Live Kitchen Display (KOT)</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Orders instantly fire directly to your kitchen screen or thermal printer. Chefs see dish modifications, allergies, and table numbers with zero delays.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Smart Upselling & Combos</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Intelligently suggest drink pairings, sides, and desserts when diners add main courses. Automatic deals and promotions trigger at checkout.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Flexible Bill & Payments</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Guests can request the check, pay online via UPI, card, Apple Pay, or choose cash-at-counter. Split bills effortlessly among table members.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Real-Time Floor Analytics</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Track revenue, peak hour velocity, best-selling dishes, and staff fulfillment times from any browser, tablet, or smartphone.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Multi-Outlet Management</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Run single cafes or a chain of 50 franchise restaurants from one unified Super Admin console with customized pricing and stock controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS (STEP-BY-STEP) ───────────────── */}
      <section id="how-it-works" className="py-24 bg-[#fff4e6]/40 border-y border-[#ede4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#ff922b] uppercase">
              Effortless Simplicity
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              How Tablly Works in 4 Steps
            </h3>
            <p className="text-[#786154] text-sm sm:text-base">
              No technical expertise needed. You can set up your entire digital restaurant in under 15 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] relative shadow-sm">
              <span className="text-4xl font-extrabold text-[#d9480f]/15 absolute top-4 right-5">01</span>
              <div className="w-10 h-10 rounded-lg bg-[#ffe8cc] text-[#d9480f] flex items-center justify-center font-bold mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2b2118] mb-2">Table QR Placement</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                Print and place custom QR stands on each table. Each QR code is uniquely tied to that table number.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] relative shadow-sm">
              <span className="text-4xl font-extrabold text-[#d9480f]/15 absolute top-4 right-5">02</span>
              <div className="w-10 h-10 rounded-lg bg-[#ffe8cc] text-[#d9480f] flex items-center justify-center font-bold mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2b2118] mb-2">Instant Guest Scan</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                Customers scan with their phone camera. The rich digital menu opens instantly without downloading any app.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] relative shadow-sm">
              <span className="text-4xl font-extrabold text-[#d9480f]/15 absolute top-4 right-5">03</span>
              <div className="w-10 h-10 rounded-lg bg-[#ffe8cc] text-[#d9480f] flex items-center justify-center font-bold mb-4">
                <ChefHat className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2b2118] mb-2">Live Kitchen Ticket</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                The order immediately appears on the kitchen display system (KOT) with dish details, table #, and special cooking notes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] relative shadow-sm">
              <span className="text-4xl font-extrabold text-[#d9480f]/15 absolute top-4 right-5">04</span>
              <div className="w-10 h-10 rounded-lg bg-[#ffe8cc] text-[#d9480f] flex items-center justify-center font-bold mb-4">
                <Receipt className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2b2118] mb-2">Quick Pay & Feedback</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                Guests easily request the final bill, settle payment, review their meal, and vacate the table faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── INTERACTIVE DEMO PREVIEW SECTION ───────────────── */}
      <section id="demo" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              See Tablly In Action
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              One Unified System, Multiple Perspectives
            </h3>
            <p className="text-[#786154] text-sm sm:text-base">
              Experience the workflow from both your customer&apos;s eyes and your management staff.
            </p>

            {/* View Switcher Tabs */}
            <div className="inline-flex p-1.5 rounded-xl bg-white border border-[#ede4dc] gap-1.5 mt-4 shadow-sm">
              <button
                onClick={() => setActiveTab("guest")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "guest"
                    ? "bg-[#d9480f] text-white shadow-md"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                📱 Guest Table Menu
              </button>
              <button
                onClick={() => setActiveTab("kitchen")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "kitchen"
                    ? "bg-[#d9480f] text-white shadow-md"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                🍳 Kitchen KOT Screen
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-[#d9480f] text-white shadow-md"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                📊 Manager Dashboard
              </button>
            </div>
          </div>

          {/* Interactive Screen Container */}
          <div className="max-w-4xl mx-auto rounded-2xl border border-[#ede4dc] bg-white p-6 sm:p-8 shadow-xl">
            {activeTab === "guest" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#ede4dc] pb-4">
                  <div>
                    <span className="text-xs text-[#d9480f] font-semibold tracking-wide uppercase">
                      Guest Mobile Interface
                    </span>
                    <h4 className="text-lg font-bold text-[#2b2118]">Table #04 • Dine-In Guest View</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#ffe8cc] text-[#d9480f] text-xs font-semibold border border-[#d9480f]/25">
                    App-free Web App
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Categories</div>
                    <div className="font-bold text-[#2b2118] text-base mt-1">Appetizers, Mains, Drinks</div>
                    <p className="text-xs text-[#786154] mt-2">Filter by Vegan, Gluten-Free, Chef Special</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Order Add-Ons</div>
                    <div className="font-bold text-[#2b2118] text-base mt-1">Custom Spice & Extras</div>
                    <p className="text-xs text-[#786154] mt-2">Special preparation instructions field included</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Table Session</div>
                    <div className="font-bold text-[#2b2118] text-base mt-1">Shared Bill & Re-Ordering</div>
                    <p className="text-xs text-[#786154] mt-2">Order round 2 of drinks with 1 click</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#fff4e6] border border-[#d9480f]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d9480f]/20 text-[#ff922b] flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[#2b2118]">Experience it right now</h5>
                      <p className="text-xs text-[#786154]">
                        Check out an active demo restaurant menu route right in this deployment.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/restaurant/demo/menu/TBL-1"
                    className="px-4 py-2 rounded-lg bg-[#d9480f] hover:bg-[#c93b07] text-white text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Open Menu View &rarr;
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "kitchen" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#ede4dc] pb-4">
                  <div>
                    <span className="text-xs text-[#d9480f] font-semibold tracking-wide uppercase">
                      Kitchen Order Ticket (KOT)
                    </span>
                    <h4 className="text-lg font-bold text-[#2b2118]">Live Kitchen Display System</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                    Auto-Refreshes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ticket 1 */}
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-amber-500/30 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-400">Table 04 • KOT #1042</span>
                      <span className="text-[#786154]">Ordered 3 min ago</span>
                    </div>
                    <div className="space-y-1 text-sm font-medium">
                      <div className="text-[#2b2118] flex justify-between">
                        <span>1x Truffle Wild Burger</span>
                        <span className="text-xs text-[#786154]">Medium Rare</span>
                      </div>
                      <div className="text-[#2b2118] flex justify-between">
                        <span>1x Garlic Parmesan Fries</span>
                        <span className="text-xs text-[#786154]">Extra Crispy</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#ede4dc] flex justify-between items-center">
                      <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                        In Preparation
                      </span>
                      <button className="text-xs bg-[#d9480f] text-white font-bold px-3 py-1 rounded">
                        Mark Ready
                      </button>
                    </div>
                  </div>

                  {/* Ticket 2 */}
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-[#d9480f]/25 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#ff922b]">Table 09 • KOT #1041</span>
                      <span className="text-[#786154]">Ordered 8 min ago</span>
                    </div>
                    <div className="space-y-1 text-sm font-medium">
                      <div className="text-[#2b2118] flex justify-between">
                        <span>2x Iced Matcha Latte</span>
                        <span className="text-xs text-[#786154]">Oat milk</span>
                      </div>
                      <div className="text-[#2b2118] flex justify-between">
                        <span>1x Avocado Toast</span>
                        <span className="text-xs text-[#786154]">No chilli flakes</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#ede4dc] flex justify-between items-center">
                      <span className="text-[11px] bg-[#ffe8cc] text-[#d9480f] font-semibold px-2 py-0.5 rounded">
                        Ready to Serve
                      </span>
                      <button className="text-xs bg-[#ede4dc] text-[#786154] hover:bg-[#d9480f] hover:text-white transition-colors font-bold px-3 py-1 rounded">
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#ede4dc] pb-4">
                  <div>
                    <span className="text-xs text-[#d9480f] font-semibold tracking-wide uppercase">
                      Manager Portal
                    </span>
                    <h4 className="text-lg font-bold text-[#2b2118]">Live Floor Status & Revenue</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                    Live Sync
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Total Tables</div>
                    <div className="text-xl font-bold text-[#2b2118] mt-1">18 Tables</div>
                    <div className="text-[11px] text-[#d9480f] font-semibold mt-1">14 Occupied (78%)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Today&apos;s Revenue</div>
                    <div className="text-xl font-bold text-[#2b2118] mt-1">$3,420</div>
                    <div className="text-[11px] text-[#ff922b] mt-1">+18% vs yesterday</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Avg Prep Time</div>
                    <div className="text-xl font-bold text-[#2b2118] mt-1">11.4 min</div>
                    <div className="text-[11px] text-[#ff922b] mt-1">3.2 min faster</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Customer Rating</div>
                    <div className="text-xl font-bold text-[#2b2118] mt-1">4.9 / 5.0</div>
                    <div className="text-[11px] text-amber-400 mt-1">★ 94 reviews</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#fffaf5] border border-[#ede4dc] flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#2b2118]">Want to manage your restaurant panel?</h5>
                    <p className="text-xs text-[#786154]">Sign in to add food items, adjust prices, and monitor staff.</p>
                  </div>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg bg-[#d9480f] hover:bg-[#c93b07] text-white text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Go To Admin Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────────────── PRICING PLANS ───────────────── */}
      <section id="pricing" className="py-24 bg-[#fff4e6]/40 border-y border-[#ede4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Transparent Pricing
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              Pick the Right Plan for Your Restaurant
            </h3>
            <p className="text-[#786154] text-sm sm:text-base">
              No hidden fees, no hardware locking. Start your 14-day free trial now.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full bg-white border border-[#ede4dc] mt-4 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#d9480f] text-white"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-[#d9480f] text-white"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] bg-[#ffe8cc] text-[#d9480f] px-1.5 py-0.2 rounded font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Plan 1: Starter */}
            <div className="p-8 rounded-2xl bg-white border border-[#ede4dc] flex flex-col justify-between hover:border-[#d9480f]/40 hover:shadow-md transition-all shadow-sm">
              <div>
                <h4 className="text-xl font-bold text-[#2b2118]">Starter</h4>
                <p className="text-xs text-[#786154] mt-1">Perfect for cafes, food trucks, and small bakeries.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-[#2b2118]">
                    {billingCycle === "monthly" ? "$29" : "$24"}
                  </span>
                  <span className="text-xs text-[#786154]"> / month</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-[#4a3b32]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Up to 12 Restaurant Tables</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Printable Table QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Real-Time Digital Menu</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Basic Kitchen Order Display</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Email & Community Support</span>
                  </li>
                </ul>
              </div>
              <a
                href="#signup"
                className="mt-8 block text-center py-3 rounded-xl border border-[#d9480f] bg-white text-[#d9480f] font-semibold text-sm hover:bg-[#d9480f] hover:text-white transition-colors shadow-sm"
              >
                Start Starter Trial
              </a>
            </div>

            {/* Plan 2: Growth (Featured) */}
            <div className="p-8 rounded-2xl bg-white border-2 border-[#d9480f] flex flex-col justify-between relative shadow-xl shadow-[#d9480f]/10 scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d9480f] text-white text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#2b2118]">Growth & Bistro</h4>
                <p className="text-xs text-[#786154] mt-1">For busy dining restaurants and cocktail bars.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-[#2b2118]">
                    {billingCycle === "monthly" ? "$69" : "$55"}
                  </span>
                  <span className="text-xs text-[#786154]"> / month</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-[#4a3b32]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Unlimited Tables & Sessions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Full Multi-Screen KOT Display</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Automated Smart Upselling Engine</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Split Bills & Online Payment Gateway</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Advanced Floor Analytics & POS Sync</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Priority WhatsApp & Phone Support</span>
                  </li>
                </ul>
              </div>
              <a
                href="#signup"
                className="mt-8 block text-center py-3 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-bold text-sm shadow-lg shadow-[#d9480f]/30 transition-all hover:-translate-y-0.5"
              >
                Start 14-Day Free Trial
              </a>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="p-8 rounded-2xl bg-white border border-[#ede4dc] flex flex-col justify-between hover:border-[#d9480f]/40 hover:shadow-md transition-all shadow-sm">
              <div>
                <h4 className="text-xl font-bold text-[#2b2118]">Franchise & Enterprise</h4>
                <p className="text-xs text-[#786154] mt-1">Multi-location restaurant groups and hotel dining.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-[#2b2118]">Custom</span>
                  <span className="text-xs text-[#786154]"> / tailored quote</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-[#4a3b32]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Unlimited Outlets & Super Admin</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Custom White-Label Subdomains</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Custom POS & ERP Integrations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Dedicated Technical Account Manager</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>99.99% SLA Uptime Guarantee</span>
                  </li>
                </ul>
              </div>
              <a
                href="mailto:contact@tablly.com"
                className="mt-8 block text-center py-3 rounded-xl border border-[#d9480f] bg-white text-[#d9480f] font-semibold text-sm hover:bg-[#d9480f] hover:text-white transition-colors shadow-sm"
              >
                Contact Sales Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── TESTIMONIALS ───────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Loved By Restaurateurs
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              What Restaurant Owners Are Saying
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] space-y-4 shadow-sm">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#4a3b32] leading-relaxed italic">
                &ldquo;Tablly reduced our weekend rush chaos by 80%. Guests sit down, order immediately, and we save at least 15 minutes per table. Our servers can finally focus on hospitality.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#ede4dc] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ffe8cc] text-[#d9480f] font-bold flex items-center justify-center text-xs">
                  MJ
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2b2118]">Marco Rossi</div>
                  <div className="text-[11px] text-[#786154]">Head Chef & Owner, Bella Cucina</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] space-y-4 shadow-sm">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#4a3b32] leading-relaxed italic">
                &ldquo;The smart combo recommendations alone increased our dessert and beverage sales by 28%. Diners love seeing actual high-res photos before choosing their food.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#ede4dc] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ffe8cc] text-[#d9480f] font-bold flex items-center justify-center text-xs">
                  SL
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2b2118]">Sarah Lin</div>
                  <div className="text-[11px] text-[#786154]">General Manager, Urban Garden Cafe</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] space-y-4 shadow-sm">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#4a3b32] leading-relaxed italic">
                &ldquo;Zero app download was the main reason we switched to Tablly. Customers open their camera, point at the QR code, and that&apos;s it. Outstanding support as well!&rdquo;
              </p>
              <div className="pt-2 border-t border-[#ede4dc] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ffe8cc] text-[#d9480f] font-bold flex items-center justify-center text-xs">
                  DK
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2b2118]">David Kapoor</div>
                  <div className="text-[11px] text-[#786154]">Founder, Spice & Barrel Lounge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FREQUENTLY ASKED QUESTIONS (FAQ) ───────────────── */}
      <section id="faq" className="py-24 bg-[#fff4e6]/40 border-y border-[#ede4dc]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Got Questions?
            </h2>
            <h3 className="text-3xl font-extrabold text-[#2b2118]">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do diners have to download an app or register an account?",
                a: "No! Tablly works seamlessly inside any standard mobile web browser (Safari, Chrome, etc.). Diners simply point their camera at the table QR code and the menu opens in under a second.",
              },
              {
                q: "How do orders reach the kitchen?",
                a: "As soon as a guest presses 'Place Order', it sends a live ticket directly to your Kitchen Display System (KDS) and POS dashboard with the table number, items, and preparation notes. You can also connect standard thermal ESC/POS receipt printers.",
              },
              {
                q: "Can I update food prices, items, or 86 out-of-stock dishes during service?",
                a: "Yes! Changes made in your admin panel update instantaneously across all guest phones without requiring page refreshes.",
              },
              {
                q: "How long does it take to onboard my restaurant?",
                a: "Most restaurants go live within 15 to 30 minutes. You can upload your menu categories and items, generate table QR codes, print them, and start accepting orders immediately.",
              },
              {
                q: "Can guests split bills or pay cash if they prefer?",
                a: "Yes! Tablly supports full digital payments (cards, Apple Pay, UPI) as well as a 'Pay at Counter / Cash' option so you accommodate every dining preference.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-[#ede4dc] rounded-xl bg-white overflow-hidden transition-colors hover:border-[#d9480f]/40 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm sm:text-base text-[#2b2118] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#d9480f] transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#786154] leading-relaxed border-t border-[#ede4dc] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CALL TO ACTION BANNER ───────────────── */}
      <section id="signup" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ffe8cc]/30 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#fff4e6] via-white to-[#fff4e6] border border-[#ede4dc] text-center space-y-6 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#ffe8cc] border border-[#d9480f]/25 text-[#d9480f] flex items-center justify-center mx-auto shadow-sm">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2b2118] tracking-tight">
              Ready to modernise your dining experience?
            </h3>
            <p className="text-[#786154] text-sm sm:text-base max-w-xl mx-auto">
              Join forward-thinking restaurants and cafes that use Tablly to serve faster, boost ticket sizes, and delight their guests.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-bold text-base shadow-xl shadow-[#d9480f]/30 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#d9480f]/40 bg-white hover:bg-[#ffe8cc]/40 text-[#d9480f] font-semibold text-base transition-colors shadow-sm"
              >
                <span>Restaurant Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="border-t border-[#ede4dc] bg-[#fffaf5] py-12 text-[#786154] text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#ede4dc]">
            {/* Col 1: Brand */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d9480f] flex items-center justify-center text-white font-bold">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-[#2b2118]">Tablly</span>
              </div>
              <p className="text-xs text-[#786154] max-w-sm">
                Next-generation restaurant table commerce platform. QR menus, real-time KOT kitchen sync, and unified management.
              </p>
              <p className="text-xs text-[#9c887e]">
                Designed for modern bistros, cafes, fine dining & multi-outlet chains.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2.5">
              <div className="font-semibold text-[#2b2118] text-xs uppercase tracking-wider">Product</div>
              <ul className="space-y-1.5 text-xs text-[#786154]">
                <li><a href="#features" className="hover:text-[#d9480f]">QR Ordering</a></li>
                <li><a href="#features" className="hover:text-[#d9480f]">Kitchen Display (KOT)</a></li>
                <li><a href="#features" className="hover:text-[#d9480f]">Table Management</a></li>
                <li><a href="#features" className="hover:text-[#d9480f]">Analytics & Insights</a></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-2.5">
              <div className="font-semibold text-[#2b2118] text-xs uppercase tracking-wider">Resources</div>
              <ul className="space-y-1.5 text-xs text-[#786154]">
                <li><a href="#how-it-works" className="hover:text-[#d9480f]">How It Works</a></li>
                <li><a href="#demo" className="hover:text-[#d9480f]">Live Demo</a></li>
                <li><a href="#pricing" className="hover:text-[#d9480f]">Pricing</a></li>
                <li><a href="#faq" className="hover:text-[#d9480f]">FAQ</a></li>
              </ul>
            </div>

            {/* Col 4: Portals */}
            <div className="space-y-2.5">
              <div className="font-semibold text-[#2b2118] text-xs uppercase tracking-wider">Portals</div>
              <ul className="space-y-1.5 text-xs text-[#786154]">
                <li><Link href="/login" className="hover:text-[#d9480f]">Restaurant Admin</Link></li>
                <li><a href="http://localhost:3002" className="hover:text-[#d9480f]">Admin Dashboard</a></li>
                <li><a href="http://localhost:5000" className="hover:text-[#d9480f]">API Backend</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9c887e]">
            <div>
              &copy; {new Date().getFullYear()} Tablly Technologies. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#2b2118]">Privacy Policy</a>
              <a href="#" className="hover:text-[#2b2118]">Terms of Service</a>
              <a href="#" className="hover:text-[#2b2118]">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
