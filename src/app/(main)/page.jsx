"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Tag,
  MessageSquare,
  Globe,
} from "lucide-react";
import CtaTrialModal from "../../components/CtaTrialModal";
import ChatbotWidget from "../../components/ChatbotWidget";
import AutomatedDemoModal from "../../components/AutomatedDemoModal";
import MaintenanceScreen from "../../components/MaintenanceScreen";

export default function MarketingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("guest");
  const [billingCycle, setBillingCycle] = useState("1_month"); // "1_month" | "6_months" | "12_months"
  const [openFaq, setOpenFaq] = useState(null);
  const [maintenanceState, setMaintenanceState] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    fetch(`${apiUrl}/platform-settings`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        const data = json?.data || json;
        if (data?.maintenanceEnabled || data?.platformStatus === "Maintenance") {
          setMaintenanceState(data);
        }
      })
      .catch(() => {});
  }, []);

  // Modals state
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [trialPlan, setTrialPlan] = useState("Standard");
  const [trialDuration, setTrialDuration] = useState("1_month");
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Keep refs in sync for timer callbacks
  const isTrialOpenRef = useRef(isTrialOpen);
  const isDemoOpenRef = useRef(isDemoOpen);
  const billingCycleRef = useRef(billingCycle);

  useEffect(() => {
    isTrialOpenRef.current = isTrialOpen;
  }, [isTrialOpen]);

  useEffect(() => {
    isDemoOpenRef.current = isDemoOpen;
  }, [isDemoOpen]);

  useEffect(() => {
    billingCycleRef.current = billingCycle;
  }, [billingCycle]);

  // Automatically open CTA form after 10s on website, then recurring every 50s
  useEffect(() => {
    let recurringInterval = null;

    const initialTimer = setTimeout(() => {
      // Open if CTA modal is not already open and user is not currently in Automated Demo modal
      if (!isTrialOpenRef.current && !isDemoOpenRef.current) {
        setTrialPlan("Standard");
        setTrialDuration(billingCycleRef.current || "1_month");
        setIsTrialOpen(true);
      }

      // After 10s initial trigger, start recurring every 50 seconds
      recurringInterval = setInterval(() => {
        if (!isTrialOpenRef.current && !isDemoOpenRef.current) {
          setTrialPlan("Standard");
          setTrialDuration(billingCycleRef.current || "1_month");
          setIsTrialOpen(true);
        }
      }, 50000); // 50 seconds
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(initialTimer);
      if (recurringInterval) clearInterval(recurringInterval);
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleOpenTrial = (planName = "Standard", duration = billingCycle) => {
    setTrialPlan(planName);
    setTrialDuration(duration);
    setIsTrialOpen(true);
  };

  if (maintenanceState) {
    return (
      <MaintenanceScreen
        message={maintenanceState.maintenanceMessage}
        platformName={maintenanceState.platformName}
        logoUrl={maintenanceState.logoUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#2b2118] selection:bg-[#d9480f] selection:text-white font-sans antialiased relative">
      {/* ───────────────── TOP ANNOUNCEMENT BAR ───────────────── */}
      <div className="bg-gradient-to-r from-[#c93b07] via-[#d9480f] to-[#f76707] text-white text-xs md:text-sm font-medium py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
          Live
        </span>
        <span>Introducing Tablly 2.0: Instant Table-Side Ordering & Real-Time Kitchen Sync</span>
        <button
          onClick={() => setIsDemoOpen(true)}
          className="underline underline-offset-2 hover:opacity-90 font-semibold ml-1 cursor-pointer"
        >
          Watch Automated Demo &rarr;
        </button>
      </div>

      {/* ───────────────── NAVIGATION BAR ───────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#fffaf5]/90 border-b border-[#ede4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f76707] to-[#d9480f] flex items-center justify-center shadow-lg shadow-[#d9480f]/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#2b2118] flex items-center gap-1.5">
                Tablly
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#d9480f]/10 text-[#d9480f] border border-[#d9480f]/25">
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
            <button
              onClick={() => handleOpenTrial("Standard")}
              className="text-sm font-semibold bg-[#d9480f] hover:bg-[#c93b07] text-white px-4 py-2 rounded-lg shadow-lg shadow-[#d9480f]/25 transition-all hover:shadow-[#d9480f]/40 hover:-translate-y-0.5 cursor-pointer"
            >
              Start Free 14-Day Trial
            </button>
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
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenTrial("Standard");
                }}
                className="w-full text-center py-2.5 rounded-lg bg-[#d9480f] font-semibold text-white shadow-md shadow-[#d9480f]/20 cursor-pointer"
              >
                Start Free 14-Day Trial
              </button>
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
              Empower diners to scan, browse delicious visual menus, order, and pay right from their phone with
              <span className="text-[#2b2118] font-semibold"> zero apps to install</span>. Instant kitchen KOT sync, 35% faster table turnover, and happy repeat guests.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => handleOpenTrial("Standard")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-bold text-base shadow-xl shadow-[#d9480f]/25 transition-all hover:shadow-[#d9480f]/40 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#d9480f]/35 bg-white hover:bg-[#ffe8cc]/40 text-[#d9480f] font-semibold shadow-sm text-base transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#d9480f]" />
                <span>Open Menu View &rarr;</span>
              </button>
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
                <span>Ready in 15 Minutes</span>
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
                    https://urbangreen.tablly.com/menu/Table 04
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
                    Scan with any phone camera to view menu, order food & get discounts.
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

                  {/* Interactive Item Row */}
                  <div className="p-3.5 rounded-xl border border-[#ede4dc] bg-[#fffaf5] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#ffd8a8] flex items-center justify-center text-xl shrink-0">
                        🍔
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-[#2b2118]">Truffle Paneer Burger</h5>
                          <span className="text-[10px] bg-amber-500/20 text-amber-700 px-1.5 py-0.2 rounded font-semibold">
                            Bestseller
                          </span>
                        </div>
                        <p className="text-xs text-[#786154]">Herb patty, truffle mayo, brioche bun</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#2b2118]">₹299</span>
                      <button
                        onClick={() => setIsDemoOpen(true)}
                        className="mt-1 block text-xs bg-[#d9480f] text-white px-3 py-1 rounded-md font-semibold hover:bg-[#c93b07] transition-colors cursor-pointer"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#ede4dc] bg-[#fffaf5] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#ffd8a8] flex items-center justify-center text-xl shrink-0">
                        ☕
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-[#2b2118]">Hazelnut Iced Latte</h5>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                            50% Off Code
                          </span>
                        </div>
                        <p className="text-xs text-[#786154]">Cold brewed espresso with hazelnut syrup</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#2b2118]">₹180</span>
                      <button
                        onClick={() => setIsDemoOpen(true)}
                        className="mt-1 block text-xs bg-[#d9480f] text-white px-3 py-1 rounded-md font-semibold hover:bg-[#c93b07] transition-colors cursor-pointer"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>

                  {/* Bottom bar preview */}
                  <div className="pt-2 border-t border-[#ede4dc] flex items-center justify-between text-xs">
                    <span className="text-[#786154]">
                      Current Table Bill: <strong className="text-[#2b2118]">₹479</strong> (2 items)
                    </span>
                    <button
                      onClick={() => setIsDemoOpen(true)}
                      className="px-3 py-1.5 bg-[#d9480f] hover:bg-[#c93b07] text-white rounded-lg font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                    >
                      <span>Simulate Order & Payment</span> &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── TRUSTED BY RESTAURANTS ───────────────── */}
      <section className="py-12 border-y border-[#ede4dc] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-[#786154] tracking-wider uppercase mb-8">
            Powering over 1,200+ Cafes, Bistros & Dining Venues Across India
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75">
            {[
              "The Urban Bistro",
              "Copper Spoon Cafe",
              "Chai & Co. Lounge",
              "Barbeque Craft",
              "Green Fork Kitchen",
              "Spice Heritage",
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-2 font-bold text-sm sm:text-base text-[#4a3b32]">
                <UtensilsCrossed className="w-4 h-4 text-[#d9480f]" />
                <span>{name}</span>
              </div>
            ))}
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-[#ede4dc]/60">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#d9480f]">1,200+</div>
              <p className="text-xs sm:text-sm text-[#786154] font-medium mt-1">Live Restaurants</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2b2118]">4.8M+</div>
              <p className="text-xs sm:text-sm text-[#786154] font-medium mt-1">Orders Processed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#d9480f]">35%</div>
              <p className="text-xs sm:text-sm text-[#786154] font-medium mt-1">Faster Table Turnover</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2b2118]">99.98%</div>
              <p className="text-xs sm:text-sm text-[#786154] font-medium mt-1">Platform Uptime SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── KEY FEATURES GRID ───────────────── */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Core Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              Built to Solve Real Floor, Kitchen & Billing Bottlenecks
            </h3>
            <p className="text-[#786154] text-sm sm:text-base">
              Say goodbye to printed menus that get dirty, understaffed rush hours, and missed billing items. Tablly powers the full restaurant operations lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: QR Generator */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#ffe8cc] border border-[#d9480f]/25 text-[#d9480f] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Smart QR Codes & Standee Designs</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Generate high-resolution printable QR codes per table with automatic table session tracking. Diners scan and order without creating an account or downloading an app.
              </p>
            </div>

            {/* Feature 2: Live KOT */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#ffe8cc] border border-[#d9480f]/25 text-[#d9480f] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Live Kitchen Display (KOT)</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Orders instantly fire directly to your kitchen screen. Chefs see dish customizations, cooking notes, and table numbers with live status progression from Pending to Delivered.
              </p>
            </div>

            {/* Feature 3: Offers & Promos */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Tag className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Offers & Discount Coupons</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Run targeted percentage or flat discounts (e.g. WELCOME50, HAPPYHOUR). Diners apply promo codes directly at their table before settling the bill.
              </p>
            </div>

            {/* Feature 4: Active Sessions & Settle Bill */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Active Sessions & Instant Settlement</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Track live orders per table, 5% GST computation, and settle bills with 1-click counter payment (Cash, UPI/QR, Card). Tables are freed automatically for the next guest.
              </p>
            </div>

            {/* Feature 5: Website Builder */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Branded Restaurant Website</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Every restaurant gets its own live public website (yourname.tablly.com) with hero cover, live digital menu, contact & address details, and customer inquiry lead capture.
              </p>
            </div>

            {/* Feature 6: Google Review Booster */}
            <div className="p-7 rounded-2xl bg-white border border-[#ede4dc] hover:border-[#d9480f]/50 hover:shadow-md transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#2b2118] mb-2">Google Review Booster</h4>
              <p className="text-sm text-[#786154] leading-relaxed">
                Automatically prompt satisfied guests to leave a 5-star Google Review on their phone right after settling their meal. Skyrocket your local SEO and footfall.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS (STEP-BY-STEP) ───────────────── */}
      <section id="how-it-works" className="py-24 bg-[#fff4e6]/40 border-y border-[#ede4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Simple 4-Step Flow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              From Scan to Kitchen in 30 Seconds
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
                Print and place designer QR stands on each table. Each code is uniquely assigned to that table.
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
                Customers scan with their phone camera. The visual menu opens in under a second with zero app installs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] relative shadow-sm">
              <span className="text-4xl font-extrabold text-[#d9480f]/15 absolute top-4 right-5">03</span>
              <div className="w-10 h-10 rounded-lg bg-[#ffe8cc] text-[#d9480f] flex items-center justify-center font-bold mb-4">
                <ChefHat className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2b2118] mb-2">Live Kitchen KOT Ticket</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                The order instantly appears on the kitchen display system (KOT) with dish details, table #, and special cooking notes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] relative shadow-sm">
              <span className="text-4xl font-extrabold text-[#d9480f]/15 absolute top-4 right-5">04</span>
              <div className="w-10 h-10 rounded-lg bg-[#ffe8cc] text-[#d9480f] flex items-center justify-center font-bold mb-4">
                <Receipt className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2b2118] mb-2">Settle Bill & Free Table</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                Diners request the bill, cashier marks payment with 1-click (Cash / UPI / Card), and the table is freed instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── INTERACTIVE DEMO PREVIEW SECTION ───────────────── */}
      <section id="demo" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Interactive Preview
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              Experience the Guest & Kitchen Flow
            </h3>
            <p className="text-[#786154] text-sm sm:text-base">
              See how smooth the table ordering experience feels from both the diner's and kitchen's perspective.
            </p>

            {/* Tab switch */}
            <div className="inline-flex p-1 rounded-full bg-white border border-[#ede4dc] shadow-sm">
              <button
                onClick={() => setActiveTab("guest")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "guest"
                    ? "bg-[#d9480f] text-white shadow-sm"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                Guest Mobile Experience
              </button>
              <button
                onClick={() => setActiveTab("kitchen")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "kitchen"
                    ? "bg-[#d9480f] text-white shadow-sm"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                Kitchen KOT Display
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-[#ede4dc] p-6 sm:p-10 shadow-xl">
            {activeTab === "guest" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#ede4dc] pb-4 gap-2">
                  <div>
                    <span className="text-xs text-[#d9480f] font-semibold tracking-wide uppercase">
                      Guest Viewpoint
                    </span>
                    <h4 className="text-lg font-bold text-[#2b2118]">Diner Table-Side Menu Experience</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20">
                    Zero App Installation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Ordering Speed</div>
                    <div className="font-bold text-[#2b2118] text-base mt-1">Under 45 Seconds</div>
                    <p className="text-xs text-[#786154] mt-2">Browse categories, view photos & add items</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Order Add-Ons</div>
                    <div className="font-bold text-[#2b2118] text-base mt-1">Custom Notes & Extras</div>
                    <p className="text-xs text-[#786154] mt-2">Special cooking instructions included</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-[#ede4dc]">
                    <div className="text-xs text-[#786154]">Table Session</div>
                    <div className="font-bold text-[#2b2118] text-base mt-1">Offers & Re-Ordering</div>
                    <p className="text-xs text-[#786154] mt-2">Apply promo coupons with 1 click</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#fff4e6] border border-[#d9480f]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d9480f]/20 text-[#d9480f] flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[#2b2118]">Experience the full customer journey</h5>
                      <p className="text-xs text-[#786154]">
                        Watch an automated simulated walkthrough of ordering, coupons, kitchen KOT, and counter payment.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDemoOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white text-xs font-bold transition-all shadow-md shadow-[#d9480f]/25 whitespace-nowrap cursor-pointer flex items-center gap-2 hover:-translate-y-0.5"
                  >
                    <span>Open Menu View</span> &rarr;
                  </button>
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
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold border border-amber-500/20">
                    Real-Time Sync
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ticket 1 */}
                  <div className="p-4 rounded-xl bg-[#fffaf5] border border-amber-500/30 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-700">Table 04 • KOT #1042</span>
                      <span className="text-[#786154]">Ordered 3 min ago</span>
                    </div>
                    <div className="space-y-1 text-sm font-medium">
                      <div className="text-[#2b2118] flex justify-between">
                        <span>1x Truffle Paneer Burger</span>
                        <span className="text-xs text-[#786154]">Extra crispy</span>
                      </div>
                      <div className="text-[#2b2118] flex justify-between">
                        <span>1x Hazelnut Iced Latte</span>
                        <span className="text-xs text-[#786154]">Less sweet</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#ede4dc] text-xs">
                      <span className="text-amber-700 font-semibold">Cooking in Kitchen 🍳</span>
                      <span className="text-xs font-bold text-[#d9480f]">Est: 9m</span>
                    </div>
                  </div>

                  {/* Ticket 2 */}
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-700">Table 02 • KOT #1041</span>
                      <span className="text-[#786154]">Served 8 min ago</span>
                    </div>
                    <div className="space-y-1 text-sm font-medium">
                      <div className="text-[#2b2118] flex justify-between">
                        <span>2x Wood-Fired Margherita Pizza</span>
                        <span className="text-xs text-[#786154]">Thin crust</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#ede4dc] text-xs">
                      <span className="text-emerald-700 font-semibold">Delivered to Table ✓</span>
                      <span className="text-xs font-bold text-emerald-700">Ready for Bill</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────────────── PRICING PLANS (UPDATED BACKEND PACKAGES) ───────────────── */}
      <section id="pricing" className="py-24 bg-[#fff4e6]/40 border-y border-[#ede4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Transparent Pricing Plans
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              Pick the Perfect Plan for Your Restaurant
            </h3>
            <p className="text-[#786154] text-sm sm:text-base">
              No hidden fees, no costly hardware locking. Start with a 14-day free trial on any plan.
            </p>

            {/* Billing Duration Switcher: 1 Month | 6 Months | 12 Months */}
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-[#ede4dc] mt-4 shadow-sm max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setBillingCycle("1_month")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  billingCycle === "1_month"
                    ? "bg-[#d9480f] text-white shadow-xs"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                1 Month
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("6_months")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  billingCycle === "6_months"
                    ? "bg-[#d9480f] text-white shadow-xs"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                <span>6 Months</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  billingCycle === "6_months" ? "bg-white/20 text-white" : "bg-[#ffe8cc] text-[#d9480f]"
                }`}>
                  Save ~17%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("12_months")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  billingCycle === "12_months"
                    ? "bg-[#d9480f] text-white shadow-xs"
                    : "text-[#786154] hover:text-[#2b2118]"
                }`}
              >
                <span>12 Months / 1 Year</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  billingCycle === "12_months" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                }`}>
                  Save up to 25% ✨
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Plan 1: Basic */}
            <div className="p-8 rounded-2xl bg-white border border-[#ede4dc] flex flex-col justify-between hover:border-[#d9480f]/40 hover:shadow-md transition-all shadow-sm">
              <div>
                <h4 className="text-xl font-bold text-[#2b2118]">Basic Plan</h4>
                <p className="text-xs text-[#786154] mt-1">Ideal for cafes, small bakeries, and quick-serve outlets.</p>
                
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-[#2b2118]">
                    {billingCycle === "1_month" ? "₹999" : billingCycle === "6_months" ? "₹833" : "₹750"}
                  </span>
                  <span className="text-xs text-[#786154]"> / month</span>
                  {billingCycle === "1_month" && (
                    <p className="text-[11px] text-[#786154] font-medium mt-1">
                      Billed monthly at ₹999
                    </p>
                  )}
                  {billingCycle === "6_months" && (
                    <p className="text-[11px] text-amber-700 font-semibold mt-1">
                      Billed ₹4,999 for 6 months (Save ₹995)
                    </p>
                  )}
                  {billingCycle === "12_months" && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      Billed annually at ₹8,999 (Save ₹2,989)
                    </p>
                  )}
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#4a3b32]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Up to <strong>15 Restaurant Tables</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Printable Table QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Contactless Digital Menu & Ordering</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Active Table Sessions & Bill Management</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Branded Restaurant Portfolio Website</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Standard Email Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenTrial("Basic", billingCycle)}
                className="mt-8 block w-full text-center py-3 rounded-xl border-2 border-[#d9480f] bg-white text-[#d9480f] font-bold text-sm hover:bg-[#d9480f] hover:text-white transition-colors shadow-sm cursor-pointer"
              >
                Choose Basic Plan
              </button>
            </div>

            {/* Plan 2: Standard (Most Popular) */}
            <div className="p-8 rounded-2xl bg-white border-2 border-[#d9480f] flex flex-col justify-between relative shadow-xl shadow-[#d9480f]/15 scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d9480f] text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-full shadow-md">
                Most Popular
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#2b2118]">Standard Plan</h4>
                <p className="text-xs text-[#786154] mt-1">For busy dining restaurants, bistros, and cocktail lounges.</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-[#2b2118]">
                    {billingCycle === "1_month" ? "₹2,499" : billingCycle === "6_months" ? "₹2,083" : "₹1,916"}
                  </span>
                  <span className="text-xs text-[#786154]"> / month</span>
                  {billingCycle === "1_month" && (
                    <p className="text-[11px] text-[#786154] font-medium mt-1">
                      Billed monthly at ₹2,499
                    </p>
                  )}
                  {billingCycle === "6_months" && (
                    <p className="text-[11px] text-amber-700 font-semibold mt-1">
                      Billed ₹12,499 for 6 months (Save ₹2,495)
                    </p>
                  )}
                  {billingCycle === "12_months" && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      Billed annually at ₹22,999 (Save ₹6,989)
                    </p>
                  )}
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#4a3b32]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Up to <strong>50 Restaurant Tables</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Premium Designer QR Standee Templates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Live Kitchen Display System (KOT)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Promotional Offers & Coupon Engine</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Customer Google Review Booster</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Customer Inquiry Lead Capture</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Priority WhatsApp & Phone Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenTrial("Standard", billingCycle)}
                className="mt-8 block w-full text-center py-3.5 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-extrabold text-sm shadow-lg shadow-[#d9480f]/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Choose Standard Plan
              </button>
            </div>

            {/* Plan 3: Premium */}
            <div className="p-8 rounded-2xl bg-white border border-[#ede4dc] flex flex-col justify-between hover:border-[#d9480f]/40 hover:shadow-md transition-all shadow-sm">
              <div>
                <h4 className="text-xl font-bold text-[#2b2118]">Premium Plan</h4>
                <p className="text-xs text-[#786154] mt-1">For multi-floor dining venues, large resorts & high-volume spaces.</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-[#2b2118]">
                    {billingCycle === "1_month" ? "₹4,999" : billingCycle === "6_months" ? "₹4,166" : "₹3,750"}
                  </span>
                  <span className="text-xs text-[#786154]"> / month</span>
                  {billingCycle === "1_month" && (
                    <p className="text-[11px] text-[#786154] font-medium mt-1">
                      Billed monthly at ₹4,999
                    </p>
                  )}
                  {billingCycle === "6_months" && (
                    <p className="text-[11px] text-amber-700 font-semibold mt-1">
                      Billed ₹24,999 for 6 months (Save ₹4,995)
                    </p>
                  )}
                  {billingCycle === "12_months" && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      Billed annually at ₹44,999 (Save ₹14,989)
                    </p>
                  )}
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#4a3b32]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Up to <strong>150 Restaurant Tables</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Unlimited Additional Custom QR Standees</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Multi-Floor / Multi-Section Management</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Customer Visit & Lifetime Spend CRM</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Advanced Floor, GST & Revenue Reports</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9480f] shrink-0" />
                    <span>Dedicated Onboarding Manager & 24/7 SLA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenTrial("Premium", billingCycle)}
                className="mt-8 block w-full text-center py-3 rounded-xl border-2 border-[#d9480f] bg-white text-[#d9480f] font-bold text-sm hover:bg-[#d9480f] hover:text-white transition-colors shadow-sm cursor-pointer"
              >
                Choose Premium Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── TESTIMONIALS ───────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#d9480f] uppercase">
              Proven Social Proof
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2b2118] tracking-tight">
              Trusted by 1,200+ Restaurateurs Nationwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] space-y-4 shadow-sm">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#4a3b32] leading-relaxed italic">
                &ldquo;Tablly eliminated weekend billing chaos completely. Diners scan and order right away, saving us 15 minutes per table. Our servers now focus on genuine hospitality instead of running around with paper notepads.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#ede4dc] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ffe8cc] text-[#d9480f] font-bold flex items-center justify-center text-xs">
                  RM
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2b2118]">Rajiv Menon</div>
                  <div className="text-[11px] text-[#786154]">Co-Founder, The Urban Green Bistro (Mumbai)</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] space-y-4 shadow-sm">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#4a3b32] leading-relaxed italic">
                &ldquo;The promotional coupon engine and Google review booster delivered huge ROI. In our first 60 days on the Standard plan, our dessert sales jumped 26% and we gained over 140 genuine 5-star Google reviews.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#ede4dc] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ffe8cc] text-[#d9480f] font-bold flex items-center justify-center text-xs">
                  AR
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2b2118]">Ananya Roy</div>
                  <div className="text-[11px] text-[#786154]">Operations Head, Copper Spoon Cafe & Roastery (Bengaluru)</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#ede4dc] space-y-4 shadow-sm">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#4a3b32] leading-relaxed italic">
                &ldquo;The zero-app-download feature is a game changer. Guests point their phone camera, point and click their dishes, and orders sync straight into our live kitchen display (KOT). Unbelievable speed!&rdquo;
              </p>
              <div className="pt-2 border-t border-[#ede4dc] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ffe8cc] text-[#d9480f] font-bold flex items-center justify-center text-xs">
                  VS
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2b2118]">Vikram Sehgal</div>
                  <div className="text-[11px] text-[#786154]">General Manager, Barbeque Craft & Lounge (Delhi NCR)</div>
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
                q: "Do diners have to download any mobile app to place orders?",
                a: "No! Tablly works seamlessly inside any standard mobile web browser (Chrome, Safari, Firefox). Guests simply scan the table QR code and the full visual menu opens instantly in under a second.",
              },
              {
                q: "How do orders reach the kitchen from the table?",
                a: "The moment a guest taps 'Place Order', it sends a live ticket directly to your Kitchen Display System (KDS) screen with table number, items, and special cooking instructions.",
              },
              {
                q: "Can I update item prices, add daily specials, or mark dishes out-of-stock?",
                a: "Yes! Any modification made in your Restaurant Admin panel immediately reflects on all diners' phones in real time without refreshing.",
              },
              {
                q: "How long does onboarding and QR standee setup take?",
                a: "Most restaurants go live within 15 to 30 minutes. You can import your menu items, generate table QR codes, print them, and begin accepting table orders immediately.",
              },
              {
                q: "How does bill settlement work at the end of a meal?",
                a: "When diners finish eating, they request the bill. The cashier verifies the table's active session in the admin panel and marks payment as Cash, UPI/QR, or Card. Once paid, the table is freed automatically for the next guest.",
              },
              {
                q: "Can I manage multiple outlets or franchises?",
                a: "Yes! The Tablly Super Admin console provides complete multi-restaurant oversight, chain-wide analytics, package management, and centralized controls.",
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
              Ready to modernize your dining floor?
            </h3>
            <p className="text-[#786154] text-sm sm:text-base max-w-xl mx-auto">
              Join over 1,200 forward-thinking restaurants and cafes that use Tablly to serve faster, boost ticket sizes, and delight their guests.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleOpenTrial("Standard")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-bold text-base shadow-xl shadow-[#d9480f]/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
                <span className="text-lg font-bold text-[#2b2118]">Tablly Cloud</span>
              </div>
              <p className="text-xs text-[#786154] max-w-sm">
                Next-generation restaurant table commerce platform. QR menus, real-time KOT kitchen sync, active sessions, and unified restaurant website builder.
              </p>
              <p className="text-xs text-[#9c887e]">
                Designed for modern Indian bistros, cafes, fine dining & multi-outlet chains.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2.5">
              <div className="font-semibold text-[#2b2118] text-xs uppercase tracking-wider">Product</div>
              <ul className="space-y-1.5 text-xs text-[#786154]">
                <li><a href="#features" className="hover:text-[#d9480f]">QR Ordering</a></li>
                <li><a href="#features" className="hover:text-[#d9480f]">Kitchen Display (KOT)</a></li>
                <li><a href="#features" className="hover:text-[#d9480f]">Active Table Sessions</a></li>
                <li><a href="#features" className="hover:text-[#d9480f]">Website Builder</a></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-2.5">
              <div className="font-semibold text-[#2b2118] text-xs uppercase tracking-wider">Resources</div>
              <ul className="space-y-1.5 text-xs text-[#786154]">
                <li><a href="#how-it-works" className="hover:text-[#d9480f]">How It Works</a></li>
                <li><button onClick={() => setIsDemoOpen(true)} className="hover:text-[#d9480f] cursor-pointer">Live Demo</button></li>
                <li><a href="#pricing" className="hover:text-[#d9480f]">Pricing</a></li>
                <li><a href="#faq" className="hover:text-[#d9480f]">FAQ</a></li>
              </ul>
            </div>

            {/* Col 4: Portals */}
            <div className="space-y-2.5">
              <div className="font-semibold text-[#2b2118] text-xs uppercase tracking-wider">Portals</div>
              <ul className="space-y-1.5 text-xs text-[#786154]">
                <li><Link href="/login" className="hover:text-[#d9480f]">Restaurant Login</Link></li>
                <li><button onClick={() => handleOpenTrial("Standard")} className="hover:text-[#d9480f] cursor-pointer">Start Free Trial</button></li>
                <li><a href="http://localhost:3002" className="hover:text-[#d9480f]">Admin Panel</a></li>
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

      {/* ───────────────── MODALS & WIDGETS ───────────────── */}
      <CtaTrialModal
        isOpen={isTrialOpen}
        onClose={() => setIsTrialOpen(false)}
        preselectedPlan={trialPlan}
        preselectedDuration={trialDuration}
      />

      <AutomatedDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      <ChatbotWidget
        onOpenTrial={() => handleOpenTrial("Standard")}
      />
    </div>
  );
}
