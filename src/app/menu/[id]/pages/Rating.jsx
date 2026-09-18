"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, ExternalLink, Star } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";

function StarPicker({ value, onChange, size = 28 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex space-x-1">
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
            className="transition-transform hover:scale-110"
          >
            <Star
              size={size}
              className={filled ? "text-warning fill-current" : "text-border"}
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
    <div className="flex space-x-1">
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
    <div className="px-4 pt-4 pb-28 space-y-4">
      <PageHeader title="Reviews" subtitle="Rate your table experience" />

      {/* Overall Rating Card */}
      <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-light flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-text-primary mb-1">
            {average}
          </div>
          <div className="mb-2">
            <StaticStars rating={Math.round(Number(average))} />
          </div>
          <p className="text-xs text-text-muted">
            Based on {total} {total === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="w-1/2 space-y-1.5">
          {distribution.slice(0, 3).map(({ stars, count }) => (
            <div key={stars} className="flex items-center text-xs text-text-muted">
              <span className="w-2 mr-2">{stars}</span>
              <div className="flex-1 bg-surface-soft rounded-full h-1.5">
                <div
                  className="bg-warning h-1.5 rounded-full"
                  style={{
                    width: total ? `${(count / total) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Form */}
      <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-light">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-text-primary">Write a review</h2>
          <span className="text-xs text-text-muted">Share your experience</span>
        </div>

        <div className="mb-4">
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-muted"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you loved..."
            rows={3}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-muted resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full mt-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-text-on-primary font-medium rounded-xl py-3.5 flex items-center justify-center transition-all"
        >
          <Send size={18} className="mr-2" />
          Submit review
        </button>
      </div>

      {/* What Guests Say Section */}
      <div className="pt-1">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-sm font-bold text-text-primary">What guests say</h2>
          <span className="text-xs text-text-muted">
            {total} {total === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-surface rounded-2xl p-4 shadow-sm border border-border-light"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-success-light text-primary flex items-center justify-center font-bold text-sm mr-3 shrink-0">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-sm text-text-primary">
                    {review.name}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted shrink-0">
                  {timeAgo(review.createdAt)}
                </span>
              </div>
              <div className="ml-11">
                <StaticStars rating={review.rating} size={12} />
                {review.comment && (
                  <p className="text-xs text-text-secondary mt-2">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Review Banner */}
      <a
        href="https://www.google.com/search?q=write+a+google+review"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-surface rounded-2xl p-4 shadow-sm border border-border-light flex items-center justify-between hover:bg-surface-soft/60 transition-colors text-left"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-surface border border-border-light flex items-center justify-center mr-3 shadow-sm shrink-0">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">
              Review us on Google
            </h4>
            <p className="text-[10px] text-text-muted mt-0.5">
              Help other guests discover Spice Garden
            </p>
          </div>
        </div>
        <ExternalLink size={16} className="text-text-muted" />
      </a>
    </div>
  );
};

export default Rating;
