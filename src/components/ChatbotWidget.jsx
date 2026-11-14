"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCheck,
  Building2,
  Clock,
  CheckCircle2,
  Zap,
} from "lucide-react";

const FAQ_KNOWLEDGE_BASE = [
  {
    id: "qr-ordering",
    keywords: ["qr", "scan", "camera", "app", "download", "ordering", "table", "mobile"],
    q: "How does QR ordering work?",
    a: "Diners scan the unique QR code on their table using any mobile camera—**no app download required!** 📱\n\n1. It instantly opens your digital menu in their mobile browser\n2. Diners browse photos, select add-ons or spice level, and place orders\n3. Kitchen gets an instant KOT ticket with the exact table number!",
    chips: ["What are your pricing plans?", "How do kitchen KOTs work?", "🚀 Start 1-Month Free Trial"],
    cta: { title: "🚀 Start Free 1-Month Trial", plan: "1 Month Free Trial" }
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "cost", "charge", "plan", "subscription", "fee", "month"],
    q: "What are your pricing plans?",
    a: "Tablly offers transparent, budget-friendly pricing with **zero setup fees**:\n\n• **1 Month Free Trial (₹0)**: 30 days full platform access, table games & QR menu\n• **Starter (₹499/mo)**: Up to 10 tables, digital QR menu, waiter calls & basic analytics\n• **Pro Growth (₹1,499/mo)**: Up to 35 tables, designer QR standees, table games, Google reviews boost & Instagram campaign\n• **Enterprise (₹3,499/mo)**: Up to 100 tables, AI menu engineering, multi-staff & VIP concierge\n\n🎁 **Every new restaurant gets a 1-Month Free Trial** with zero commitment!",
    chips: ["🎁 Claim 1-Month Free Trial", "How fast is setup?", "Can I customize branding?"],
    cta: { title: "🎁 Activate 1-Month Free Trial", plan: "1 Month Free Trial" }
  },
  {
    id: "kot",
    keywords: ["kot", "kitchen", "cook", "chef", "printer", "ticket", "display", "order status"],
    q: "How do kitchen orders (KOT) work?",
    a: "The instant a diner taps 'Place Order', your kitchen receives the KOT in real time 🍳:\n\n• Exact Table number & timestamp\n• Custom cooking notes (e.g. 'less spicy', 'no onions')\n• Itemized order with real-time status updates ('Preparing' ➔ 'Served')\n\nWorks on any tablet, mobile phone, or standard thermal receipt printer!",
    chips: ["Can customers pay online?", "What are your pricing plans?", "🚀 Start Free Trial"],
    cta: { title: "🚀 Try It in 1-Month Free Trial", plan: "1 Month Free Trial" }
  },
  {
    id: "branding",
    keywords: ["brand", "branding", "logo", "color", "theme", "domain", "subdomain", "website", "customize"],
    q: "Can I customize with our logo & branding?",
    a: "Yes, 100%! 🎨 You get full control over your restaurant's digital presence:\n\n• Upload your custom logo & cover banner\n• Choose your brand colors and theme\n• Your own branded link (e.g. `yourcafe.tablly.com`)\n• Designer printable table QR standee templates with your logo.",
    chips: ["How fast is setup?", "What are your pricing plans?", "🚀 Start Free Trial"],
    cta: { title: "🎨 Start Free Trial with Custom Branding", plan: "1 Month Free Trial" }
  },
  {
    id: "setup",
    keywords: ["setup", "time", "how long", "launch", "start", "onboarding", "menu upload"],
    q: "How long does setup take?",
    a: "Less than 15 minutes! ⚡\n\nYou can upload your menu yourself, or simply send our onboarding team your menu PDF/photos and **we will digitize and set up your menu for free**. You can print table QR codes and start taking orders the very same day!",
    chips: ["🚀 Start Free 1-Month Trial", "How does QR ordering work?", "What are your pricing plans?"],
    cta: { title: "⚡ Get Set Up in 15 Mins", plan: "1 Month Free Trial" }
  },
  {
    id: "payment",
    keywords: ["pay", "payment", "online", "upi", "cash", "gpay", "phonepe", "bill", "billing"],
    q: "Can customers pay online or cash?",
    a: "Both! 💳 Diners can pay via UPI (Google Pay, PhonePe, Paytm, BHIM), Cards, or choose 'Pay at Counter / Cash'.\n\nYou decide which payment modes to enable for your restaurant, and payments go straight to your bank account with **0% commission**.",
    chips: ["What are your pricing plans?", "How does QR ordering work?", "🚀 Start Free Trial"],
    cta: { title: "🚀 Start Free 1-Month Trial", plan: "1 Month Free Trial" }
  },
  {
    id: "reviews",
    keywords: ["review", "reviews", "google", "rating", "stars", "feedback"],
    q: "How does Tablly help get Google Reviews?",
    a: "Tablly has a built-in automated review engine ⭐\n\nWhen diners finish their meal, satisfied diners giving 4 or 5 stars are automatically prompted to post directly on your **Google Business profile**. Restaurants using Tablly see a **3x jump in 5-star Google reviews** within the first month!",
    chips: ["🚀 Start 1-Month Free Trial", "What are your pricing plans?"],
    cta: { title: "⭐ Boost Your Google Reviews", plan: "1 Month Free Trial" }
  }
];

const INITIAL_QUICK_PROMPTS = [
  "How does QR ordering work?",
  "What are your pricing plans?",
  "How fast is setup?",
  "Can I customize with our logo?",
  "🚀 Start 1-Month Free Trial"
];

export default function ChatbotWidget({ onOpenTrial }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Hi there! Welcome to **Tablly**.\n\nI'm your digital restaurant advisor. I can help you with table QR ordering, kitchen display, pricing, or getting set up in 15 minutes!",
      time: "Just now",
      chips: INITIAL_QUICK_PROMPTS
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, isTyping]);

  const triggerTrialModal = (plan = "1 Month Free Trial", customConfirmation = null) => {
    // Add user intent message if not already added
    const confirmationText =
      customConfirmation ||
      "Awesome! Opening your 1-Month Free Trial request form now. Our team will have you up and running in no time! 🚀";

    setMessages((prev) => [
      ...prev,
      {
        id: "trial-open-" + Date.now(),
        sender: "bot",
        text: confirmationText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isConfirmation: true
      }
    ]);

    setTimeout(() => {
      if (typeof onOpenTrial === "function") {
        onOpenTrial(plan);
      }
    }, 450);
  };

  const findBestAnswer = (query) => {
    const clean = query.toLowerCase().trim();

    // Check if user specifically asks for trial / demo / contact / sign up
    const trialTriggers = ["trial", "demo", "start", "sign up", "signup", "register", "contact", "call me", "book", "sales", "expert", "talk to human", "human"];
    if (trialTriggers.some((t) => clean.includes(t))) {
      return {
        text: "You can test drive Tablly **100% free for 1 Month (30 Days)** with no credit card required! 🚀\n\nI can open the setup form right now where you can enter your restaurant name and our team will get in touch to assist with free menu digitization.",
        chips: ["🚀 Open Free Trial Form", "What are your pricing plans?", "How does QR ordering work?"],
        cta: { title: "🚀 Open Free Trial Setup Form", plan: "1 Month Free Trial" }
      };
    }

    // Direct match against FAQs
    for (const faq of FAQ_KNOWLEDGE_BASE) {
      if (faq.q.toLowerCase() === clean) {
        return {
          text: faq.a,
          chips: faq.chips,
          cta: faq.cta
        };
      }
    }

    // Keyword score matching
    let bestMatch = null;
    let highestScore = 0;

    for (const faq of FAQ_KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of faq.keywords) {
        if (clean.includes(kw)) score += 2;
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch && highestScore >= 2) {
      return {
        text: bestMatch.a,
        chips: bestMatch.chips,
        cta: bestMatch.cta
      };
    }

    // Realistic fallback
    return {
      text: "Great question! Every restaurant has unique operational needs. 🍽️\n\nOur onboarding specialist can answer this specifically for your restaurant and set you up with a **1-Month Risk-Free Trial**.\n\nWould you like me to open the free trial setup form?",
      chips: ["🚀 Start Free 1-Month Trial", "What are your pricing plans?", "How does QR ordering work?"],
      cta: { title: "🚀 Start Free 1-Month Trial", plan: "1 Month Free Trial" }
    };
  };

  const handleSend = (textToSend = input) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    // Check if user clicked a direct CTA prompt like "🚀 Start 1-Month Free Trial"
    if (
      text.includes("Start 1-Month Free Trial") ||
      text.includes("Start 14-Day Free Trial") ||
      text.includes("Start Free Trial") ||
      text.includes("Claim 1-Month Free Trial") ||
      text.includes("Claim 14-Day Free Trial") ||
      text.includes("Open Free Trial Form")
    ) {
      const userMsg = {
        id: "msg-user-" + Date.now(),
        sender: "user",
        text: "I want to start the 1-month free trial!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        triggerTrialModal("1 Month Free Trial");
      }, 700);
      return;
    }

    const userMsg = {
      id: "msg-user-" + Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Realistic bot typing delay
    const typingDelay = Math.min(1200, Math.max(650, text.length * 20));

    setTimeout(() => {
      const answer = findBestAnswer(text);
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: "msg-bot-" + Date.now(),
          sender: "bot",
          text: answer.text,
          chips: answer.chips,
          cta: answer.cta,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, typingDelay);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-reset-" + Date.now(),
        sender: "bot",
        text: "🔄 Chat reset! How can I assist you with Tablly today?",
        time: "Just now",
        chips: INITIAL_QUICK_PROMPTS
      }
    ]);
  };

  // Helper to render text with bold **text** and bullet lines
  const renderFormattedText = (rawText) => {
    return rawText.split("\n").map((line, lineIdx) => {
      // Split by ** for bold
      const parts = line.split(/(\*\*.*?\*\*)/g);

      return (
        <span key={lineIdx} className="block leading-relaxed min-h-[1.25rem]">
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={partIdx} className="font-semibold text-[#1f160e]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <React.Fragment key={partIdx}>{part}</React.Fragment>;
          })}
        </span>
      );
    });
  };

  return (
    <aside aria-label="Customer Support Chat" className="fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="relative group">
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2b2118] text-white text-xs font-medium shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span>Ask Tablly AI • Free Trial Support</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#d9480f] via-[#f76707] to-[#ff922b] text-white shadow-2xl shadow-[#d9480f]/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
            aria-label="Open chat assistant"
          >
            <MessageSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-md">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Popup Window */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[400px] h-[560px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-[#ede4dc] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#c93b07] via-[#d9480f] to-[#f76707] text-white p-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center relative shadow-inner">
                <Bot className="w-6 h-6 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#d9480f]" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5 text-white">
                  Tablly Restaurant AI
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                </h4>
                <p className="text-[11px] text-white/90 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  Online • Instant Onboarding
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Reset chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Banner inside chat encouraging free trial */}
          <div className="bg-[#fff4e6] border-b border-[#ffe8cc] px-4 py-2 flex items-center justify-between text-xs text-[#d9480f] shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 fill-[#d9480f]" />
              1-Month Free Trial (30 Days) Available
            </span>
            <button
              onClick={() => triggerTrialModal("1 Month Free Trial")}
              className="font-bold underline hover:text-[#b03000] cursor-pointer flex items-center gap-0.5"
            >
              Claim Now <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fffaf5]/70 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-[#d9480f] to-[#f76707] text-white rounded-tr-xs shadow-md shadow-[#d9480f]/20"
                      : m.isConfirmation
                      ? "bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-tl-xs shadow-xs"
                      : "bg-white text-[#2b2118] border border-[#ede4dc] rounded-tl-xs shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{renderFormattedText(m.text)}</div>

                  {/* Embedded CTA Button inside Bot message */}
                  {m.cta && (
                    <div className="mt-3 pt-2.5 border-t border-[#ede4dc]/80">
                      <button
                        type="button"
                        onClick={() => triggerTrialModal(m.cta.plan || "Standard")}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#d9480f] to-[#f76707] hover:from-[#c93b07] hover:to-[#e8590c] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#d9480f]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        <span>{m.cta.title}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-[#786154]/70 mt-1 px-1 flex items-center gap-1">
                  {m.time}
                  {m.sender === "user" && <CheckCheck className="w-3 h-3 text-[#d9480f]" />}
                </span>

                {/* Suggested follow-up chips under the message */}
                {m.chips && m.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.chips.map((chip, chipIdx) => (
                      <button
                        key={chipIdx}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer shadow-xs ${
                          chip.includes("Trial") || chip.includes("🚀") || chip.includes("🎁")
                            ? "bg-[#d9480f] text-white hover:bg-[#c93b07] font-semibold"
                            : "bg-white text-[#d9480f] border border-[#d9480f]/30 hover:bg-[#fff4e6]"
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Realistic Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#d9480f]/10 flex items-center justify-center text-[#d9480f]">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#ede4dc] px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#d9480f] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-[#d9480f] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#d9480f] animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#ede4dc] bg-white flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about QR menus, pricing, setup..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#ede4dc] bg-[#fffaf5] text-[#2b2118] placeholder-[#786154]/50 focus:outline-none focus:ring-2 focus:ring-[#d9480f]/50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-[#d9480f] to-[#f76707] hover:from-[#c93b07] hover:to-[#e8590c] text-white disabled:opacity-40 transition-all shadow-md shadow-[#d9480f]/20 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
