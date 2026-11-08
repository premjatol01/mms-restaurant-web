"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, ChevronDown, CheckCheck } from "lucide-react";

const QUICK_PROMPTS = [
  {
    q: "How does QR ordering work?",
    a: "Diners scan the unique QR code placed on their table using any mobile camera. It instantly opens your digital menu in their browser with zero app installs. They customize items, place the order, and the kitchen gets an instant KOT ticket!",
  },
  {
    q: "What are your pricing plans?",
    a: "Tablly offers 3 flexible plans: Basic (₹999/mo for up to 15 tables), Standard (₹2,499/mo for up to 50 tables, with offers & Google reviews), and Premium (₹4,999/mo for up to 150 tables). You can also save up to 25% with annual billing!",
  },
  {
    q: "Can I customize with our logo & branding?",
    a: "Yes! Tablly gives you full branding control: upload your logo, cover banner, brand colors, and even get your own custom website at yoursubdomain.tablly.com with designer printable QR templates.",
  },
  {
    q: "How long does setup take?",
    a: "Under 15 minutes! You can upload your existing menu categories and items, configure table numbers, and print your QR standees immediately.",
  },
];

export default function ChatbotWidget({ onOpenTrial }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! Welcome to Tablly. I'm your digital restaurant assistant. Ask me anything about table QR ordering, kitchen display, or pricing!",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend = input) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Look for matching prompt
    const matched = QUICK_PROMPTS.find(
      (p) => p.q.toLowerCase() === text.toLowerCase()
    );

    setTimeout(() => {
      let replyText = "";
      if (matched) {
        replyText = matched.a;
      } else if (text.toLowerCase().includes("price") || text.toLowerCase().includes("cost") || text.toLowerCase().includes("plan")) {
        replyText = "Our plans start at ₹999/month for up to 15 tables with a 14-day free trial! You can view full pricing in the Pricing section or click 'Start Free Trial'.";
      } else if (text.toLowerCase().includes("demo") || text.toLowerCase().includes("trial")) {
        replyText = "You can activate your 14-day free trial right now by clicking the trial button, or try our automated interactive menu walkthrough in the Interactive Preview section!";
      } else {
        replyText = "Thanks for your question! A Tablly restaurant specialist can also help answer specific questions or set up a live onboarding call. You can click 'Start Free 14-Day Trial' above to get started!";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 450);
  };

  return (
    <aside aria-label="Customer Support Chat" className="fixed bottom-5 right-5 z-40">
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="relative group">
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2b2118] text-white text-xs font-medium shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span>Chat with Tablly AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#d9480f] to-[#f76707] text-white shadow-xl shadow-[#d9480f]/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer relative"
            aria-label="Open chat assistant"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </button>
        </div>
      )}

      {/* Chat Popup Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-[#ede4dc] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#d9480f] to-[#f76707] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  Tablly Support AI
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                </h4>
                <p className="text-[11px] text-white/80">Online • Typically replies instantly</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fffaf5]/50 text-xs sm:text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-[#d9480f] text-white rounded-tr-xs"
                      : "bg-white text-[#2b2118] border border-[#ede4dc] rounded-tl-xs shadow-xs"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[10px] text-[#786154]/70 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-[#ede4dc] bg-white">
            <div className="text-[11px] font-semibold text-[#786154] mb-1.5 px-1">
              Suggested questions:
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt.q)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-[#fff4e6] text-[#d9480f] border border-[#d9480f]/20 rounded-full hover:bg-[#ffe8cc] transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  {prompt.q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#ede4dc] bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#ede4dc] bg-[#fffaf5] text-[#2b2118] focus:outline-none focus:ring-1 focus:ring-[#d9480f]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white disabled:opacity-40 transition-colors cursor-pointer"
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
