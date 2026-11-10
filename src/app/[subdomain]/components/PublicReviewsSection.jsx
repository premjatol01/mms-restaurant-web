import React from "react";
import { Star, MessageSquareQuote, ShieldCheck } from "lucide-react";
import { formatTableName } from "@/utils/formatTableName";

export default function PublicReviewsSection({
  reviewsSection,
  reviews = [],
  reviewStats = {},
}) {
  const title = reviewsSection?.content?.title || "Customer Reviews";
  const description =
    reviewsSection?.content?.description ||
    "What our guests say about their dining experience";

  const totalReviews = reviewStats.totalReviews || reviews.length;
  const averageRating = reviewStats.averageRating || (
    reviews.length > 0
      ? Number((reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1))
      : 5.0
  );

  return (
    <section
      id="reviews"
      style={{
        backgroundColor: "var(--theme-surface-soft)",
        borderColor: "var(--theme-border)",
      }}
      className="py-16 border-t"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span
              style={{
                backgroundColor: "var(--theme-primary-soft)",
                color: "var(--theme-primary)",
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Guest Experiences</span>
            </span>
            <h3
              style={{ color: "var(--theme-text)" }}
              className="text-2xl sm:text-3xl font-bold"
            >
              {title}
            </h3>
            {description && (
              <p
                style={{ color: "var(--theme-text-muted)" }}
                className="text-xs sm:text-sm mt-1.5 max-w-xl"
              >
                {description}
              </p>
            )}
          </div>

          {/* Aggregate Rating Banner (Display only, no write review button) */}
          {reviews.length > 0 && (
            <div
              style={{
                backgroundColor: "var(--theme-surface)",
                borderColor: "var(--theme-border)",
              }}
              className="p-4 rounded-2xl border shadow-sm flex items-center gap-4 shrink-0"
            >
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <span
                    style={{ color: "var(--theme-text)" }}
                    className="text-3xl font-black leading-none"
                  >
                    {averageRating}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(Number(averageRating))
                            ? "fill-amber-400 text-amber-500"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p
                  style={{ color: "var(--theme-text-muted)" }}
                  className="text-xs mt-1"
                >
                  Based on {totalReviews} verified {totalReviews === 1 ? "diner review" : "diner reviews"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Cards Grid */}
        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r, idx) => {
              const displayName = r.name || r.customerName || "Diner Guest";
              const initials = displayName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0].toUpperCase())
                .join("") || "G";

              return (
                <div
                  key={r.id || r._id || idx}
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    borderColor: "var(--theme-border)",
                  }}
                  className="p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 duration-200"
                >
                  <div className="space-y-3">
                    {/* Header: Avatar, Name, Table info */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          style={{
                            backgroundColor: "var(--theme-primary-soft)",
                            color: "var(--theme-primary)",
                          }}
                          className="w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0 text-sm shadow-inner"
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4
                            style={{ color: "var(--theme-text)" }}
                            className="font-bold text-sm truncate"
                          >
                            {displayName}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>{r.tableName ? `${formatTableName(r.tableName)} • Dine-in` : "Verified Guest"}</span>
                            </span>
                            {r.selectedForPortfolio && (
                              <span
                                style={{
                                  backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                                  color: "var(--theme-primary)",
                                  borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold border"
                              >
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Featured Pick</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= (Number(r.rating) || 5)
                                ? "fill-amber-400 text-amber-500"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Comment */}
                    {r.comment ? (
                      <p
                        style={{ color: "var(--theme-text)" }}
                        className="text-xs sm:text-sm leading-relaxed line-clamp-4 italic"
                      >
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    ) : (
                      <p
                        style={{ color: "var(--theme-text-faint)" }}
                        className="text-xs italic"
                      >
                        Left a {r.rating}-star rating for their dining experience.
                      </p>
                    )}
                  </div>

                  {/* Card Footer: Date */}
                  <div
                    className="pt-3 mt-4 border-t flex items-center justify-between text-[11px]"
                    style={{ borderColor: "var(--theme-border-subtle)" }}
                  >
                    <span style={{ color: "var(--theme-text-muted)" }}>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent visit"}
                    </span>
                    <span
                      style={{ color: "var(--theme-primary)" }}
                      className="font-medium text-[10px] uppercase tracking-wider"
                    >
                      Dine-in Experience
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State - purely informative, no write review button */
          <div
            style={{
              backgroundColor: "var(--theme-surface)",
              borderColor: "var(--theme-border)",
            }}
            className="p-10 rounded-2xl border text-center space-y-4 max-w-lg mx-auto"
          >
            <div
              style={{
                backgroundColor: "var(--theme-primary-soft)",
                color: "var(--theme-primary)",
              }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
            >
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4
                style={{ color: "var(--theme-text)" }}
                className="font-bold text-base"
              >
                No customer reviews yet
              </h4>
              <p
                style={{ color: "var(--theme-text-muted)" }}
                className="text-xs leading-relaxed max-w-sm mx-auto"
              >
                Verified customer reviews submitted by diners from the table menu portal will appear here automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
