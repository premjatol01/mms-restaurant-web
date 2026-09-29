"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Utensils, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

function SetupPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/setup-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Invalid Link</h2>
        <p className="text-[var(--color-text-muted)] mb-6">The activation link is missing or invalid.</p>
        <Link href="/" className="text-[var(--color-primary)] hover:underline">Return Home</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center flex flex-col items-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Account Activated!</h2>
        <p className="text-[var(--color-text-muted)] mb-6">Your password has been successfully set. You can now login to your restaurant dashboard.</p>
        <p className="text-sm text-[var(--color-primary)]">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="lg:hidden flex justify-center mb-4 text-[var(--color-primary)]">
          <div className="p-3 bg-[var(--color-primary-light)]/20 rounded-full">
            <Utensils className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Setup Password</h2>
        <p className="text-[var(--color-text-muted)]">Set a secure password for <strong>{email}</strong></p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors sm:text-sm"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-primary)]">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors sm:text-sm"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Activating Account..." : "Set Password & Activate"}
        </button>
      </form>
    </>
  );
}

export default function SetupPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md bg-[var(--color-surface)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
          <SetupPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
