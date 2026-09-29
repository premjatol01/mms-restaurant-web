"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Utensils, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token locally just in case
        localStorage.setItem("restaurant_token", data.data.token);
        localStorage.setItem("restaurant_user", JSON.stringify(data.data.user));
        
        // Redirect to the restaurant-admin panel (running on port 3002)
        // We pass the token in the URL so the admin panel can grab it and log them in
        window.location.href = `http://localhost:3002?token=${data.data.token}`;
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      {/* Left side - Decorative / Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[var(--color-primary-light)] opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-[var(--color-secondary)] opacity-20 blur-3xl"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Utensils className="h-8 w-8" />
            <span>CaféPortal</span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Delicious food, <br />delivered to you
          </h1>
          <p className="text-[var(--color-primary-light)] text-lg mb-8">
            Sign in to access your favorite meals, track your recent orders, and discover new flavors.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-surface-soft)] flex items-center justify-center text-[var(--color-text-primary)] text-xs font-bold">
                  U{i + 1}
                </div>
              ))}
            </div>
            <span>Join 10,000+ happy customers</span>
          </div>
        </div>
        
        <div className="relative z-10 text-sm opacity-80">
          © {new Date().getFullYear()} Café Order Portal. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-[var(--color-surface)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
          <div className="text-center mb-8">
            <div className="lg:hidden flex justify-center mb-4 text-[var(--color-primary)]">
              <div className="p-3 bg-[var(--color-primary-light)]/20 rounded-full">
                <Utensils className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Welcome Back</h2>
            <p className="text-[var(--color-text-muted)]">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors sm:text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
                Password
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--color-text-secondary)] cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="#" className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
