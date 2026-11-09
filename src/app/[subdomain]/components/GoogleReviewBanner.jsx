import React from "react";
import { Star, ExternalLink, MessageSquareHeart } from "lucide-react";

export default function GoogleReviewBanner({ googleReviewSection, fallbackLink = "" }) {
  const content = googleReviewSection?.content || {};
  const heading = content.heading || "Loved your experience with us?";
  const description =
    content.description ||
    "Help us grow and let others know about your dining experience by leaving a 5-star review on Google.";
  const buttonText = content.buttonText || "Review Us on Google";
  const reviewLink = content.googleReviewLink || fallbackLink || "";

  return (
    <section
      id="google-review-banner"
      style={{
        borderColor: "var(--theme-border)",
      }}
      className="py-14 sm:py-16 border-t relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          style={{
            backgroundColor: "var(--theme-surface)",
            borderColor: "color-mix(in srgb, var(--theme-primary) 30%, var(--theme-border))",
            boxShadow: "0 10px 30px -10px color-mix(in srgb, var(--theme-primary) 15%, transparent)",
          }}
          className="relative rounded-3xl p-6 sm:p-10 lg:p-12 border overflow-hidden transition-all"
        >
          {/* Subtle background glow */}
          <div
            style={{
              background: `radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--theme-primary) 12%, transparent) 0%, transparent 70%)`,
            }}
            className="absolute inset-0 pointer-events-none"
          />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left Content */}
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              {/* Google Reviews Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <span>5-Star Google Reviews</span>
              </div>

              {/* Heading */}
              <h3
                style={{ color: "var(--theme-text)" }}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
              >
                {heading}
              </h3>

              {/* Description */}
              {description && (
                <p
                  style={{ color: "var(--theme-text-muted)" }}
                  className="text-sm sm:text-base leading-relaxed"
                >
                  {description}
                </p>
              )}
            </div>

            {/* Right Action Button */}
            <div className="shrink-0 w-full sm:w-auto flex justify-center">
              {reviewLink ? (
                <a
                  href={reviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "var(--theme-primary)",
                    color: "var(--theme-primary-text)",
                    boxShadow: "0 10px 25px -5px color-mix(in srgb, var(--theme-primary) 35%, transparent)",
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all hover:opacity-90 hover:scale-105 active:scale-95 group"
                >
                  <Star className="w-4 h-4 fill-current transition-transform group-hover:rotate-12" />
                  <span>{buttonText}</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : (
                <div
                  style={{
                    backgroundColor: "var(--theme-primary-soft)",
                    color: "var(--theme-primary)",
                    borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border text-sm font-semibold opacity-80 cursor-default"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>{buttonText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
