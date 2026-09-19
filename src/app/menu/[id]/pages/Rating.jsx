"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, ExternalLink, Star, MessageSquareQuote } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import { motion, AnimatePresence } from "framer-motion";

function StarPicker({ value, onChange, size = 32 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-center gap-1.5 py-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= (hovered || value);
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            className="transition-transform active:scale-90 hover:scale-110"
          >
            <Star
              size={size}
              className={
                filled ? "text-warning fill-current" : "text-border"
              }
              strokeWidth={filled ? 0 : 2}
            />
          </button>
        );
      })}
    </div>
  );
}

function StaticStars({ rating, total = 5, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(total)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "text-warning fill-current" : "text-border"}
          strokeWidth={i < rating ? 0 : 2}
        />
      ))}
    </div>
  );
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

const Rating = () => {
  const { reviews, submitReview } = useMenuOrder();

  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const { average, total, distribution } = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const distribution = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => r.rating === stars).length,
    }));
    return {
      average: total ? (sum / total).toFixed(1) : "0.0",
      total,
      distribution,
    };
  }, [reviews]);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Pick a star rating first");
      return;
    }
    submitReview({ name, rating, comment });
    toast.success("Thanks for the feedback!");
    setRating(0);
    setName("");
    setComment("");
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      <PageHeader title="Reviews" subtitle="Rate your table experience" />

      {/* Overall Rating Card */}
      <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
        <div className="flex items-center justify-between gap-5">
          {/* Left: Score */}
          <div className="shrink-0">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold text-text-primary tracking-tight">
                {average}
              </span>
              <span className="text-sm text-text-muted font-medium">/ 5</span>
            </div>
            <div className="mb-1.5">
              <StaticStars rating={Math.round(Number(average))} size={13} />
            </div>
            <p className="text-[11px] text-text-muted">
              {total} {total === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Right: Distribution */}
          <div className="flex-1 space-y-1.5">
            {distribution.slice(0, 3).map(({ stars, count }) => (
              <div
                key={stars}
                className="flex items-center gap-2 text-[11px]"
              >
                <span className="w-2 text-text-muted font-medium">
                  {stars}
                </span>
                <Star
                  size={10}
                  className="text-warning fill-current shrink-0"
                  strokeWidth={0}
                />
                <div className="flex-1 bg-surface-soft rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: total
                        ? `${(count / total) * 100}%`
                        : "0%",
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-warning h-full rounded-full"
                  />
                </div>
                <span className="w-4 text-right text-text-muted tabular-nums">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write a Review Form */}
      <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
              <MessageSquareQuote size={16} className="text-warning" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Write a review
              </h2>
              <p className="text-[11px] text-text-muted">
                Share your experience
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <StarPicker value={rating} onChange={setRating} />
          {rating > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs font-semibold text-text-secondary mt-2"
            >
              {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
            </motion.p>
          )}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-surface-soft border border-transparent rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:bg-surface focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you loved..."
            rows={3}
            className="w-full bg-surface-soft border border-transparent rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:bg-surface focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:bg-border disabled:cursor-not-allowed disabled:text-text-muted active:scale-[0.98] text-text-on-primary font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:shadow-none"
        >
          <Send size={16} />
          Submit review
        </button>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
              What guests say
            </h2>
            <span className="text-[11px] font-semibold text-text-muted bg-surface-soft px-2.5 py-1 rounded-full">
              {total} {total === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-hover text-text-on-primary flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-primary/20">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="block font-bold text-sm text-text-primary truncate">
                          {review.name}
                        </span>
                        <StaticStars rating={review.rating} size={11} />
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted shrink-0 mt-0.5">
                      {timeAgo(review.createdAt)}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-xs text-text-secondary leading-relaxed pl-12">
                      {review.comment}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Google Review Banner */}
      <a
        href="https://www.google.com/search?q=write+a+google+review"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-surface rounded-2xl p-4 border border-border-light shadow-sm flex items-center justify-between active:scale-[0.98] hover:bg-surface-soft/60 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border-light flex items-center justify-center shadow-sm shrink-0">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">
              Review us on Google
            </h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              Help others discover Spice Garden
            </p>
          </div>
        </div>
        <ExternalLink size={16} className="text-text-muted shrink-0" />
      </a>
    </div>
  );
};

export default Rating;