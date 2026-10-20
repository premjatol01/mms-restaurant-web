"use client";

import { useState } from "react";
import Link from "next/link";
import { Utensils, Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: trimmedEmail }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Failed to process request. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md bg-[var(--color-surface)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
        {submitted ? (
          <div className="text-center flex flex-col items-center">
            <div className="p-3 bg-[var(--color-secondary)] rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Check Your Email</h2>
            <p className="text-[var(--color-text-muted)] text-sm mb-6 leading-relaxed">
              If an account exists with <strong className="text-[var(--color-text-primary)]">{email.trim()}</strong>, we have sent a password reset link to it. Please check your inbox and spam folder.
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mb-6">
              The reset link will expire in 30 minutes.
            </p>
            <div className="w-full space-y-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                  setError("");
                }}
                className="w-full py-2.5 px-4 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] transition-colors"
              >
                Send to another email
              </button>
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4 text-[var(--color-primary)]">
                <div className="p-3 bg-[var(--color-secondary)] rounded-full">
                  <Utensils className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Forgot Password</h2>
              <p className="text-[var(--color-text-muted)] text-sm">
                Enter your registered admin email address and we&apos;ll send you a password reset link.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)]">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors sm:text-sm"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
