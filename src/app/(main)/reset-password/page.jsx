"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Utensils, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing. Please request a new password reset link.");
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password.length > 128) {
      setError("Password cannot exceed 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. The link may have expired.");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center flex flex-col items-center">
        <div className="p-3 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Invalid Reset Link</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-6 leading-relaxed">
          The password reset token is missing or malformed. Please request a new password reset link.
        </p>
        <Link
          href="/forgot-password"
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center flex flex-col items-center">
        <div className="p-3 bg-[var(--color-secondary)] rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-[var(--color-primary)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Password Reset Successful!</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-6 leading-relaxed">
          Your password has been successfully updated. You can now use your new password to log in.
        </p>
        <p className="text-xs text-[var(--color-primary)] font-medium mb-6">
          Redirecting to login in a few seconds...
        </p>
        <Link
          href="/login"
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Go to Login Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4 text-[var(--color-primary)]">
          <div className="p-3 bg-[var(--color-secondary)] rounded-full">
            <Utensils className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Reset Password</h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {email ? (
            <>
              Enter a new secure password for <strong className="text-[var(--color-text-primary)]">{email}</strong>
            </>
          ) : (
            "Create a new password for your admin account."
          )}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{error}</span>
            {error.toLowerCase().includes("expired") && (
              <div className="mt-2">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-red-700 underline hover:text-red-800"
                >
                  Request a new reset link &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* New Password */}
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
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="block w-full pl-10 pr-10 py-2.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors sm:text-sm"
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-primary)]">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              className="block w-full pl-10 pr-10 py-2.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors sm:text-sm"
              placeholder="Re-enter password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting Password..." : "Reset Password"}
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
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md bg-[var(--color-surface)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
        <Suspense fallback={<div className="text-center p-10 text-[var(--color-text-muted)]">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
