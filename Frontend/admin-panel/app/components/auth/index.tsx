"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { authService } from "@/app/service/auth-service";
import { toast } from "@/app/components/ui/toast";

export default function AuthLoginComponent() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: trimmedEmail,
        password,
      });

      const message =
        response.message || "Admin authentication successful!";

      // Show toast notification
      toast.add({
        title: "Login Successful",
        description: message,
        type: "success",
        timeout: 4000,
      });

      setSuccessMessage(
        `${message} Redirecting to console...`
      );

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 700);
    } catch (err: any) {
      const msg =
        err?.message || "Invalid credentials or unauthorized access.";
      setErrorMessage(msg);
      toast.add({
        title: "Login Failed",
        description: msg,
        type: "error",
        timeout: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("pranoynzminds@gmail.com");
    setPassword("Abc@1234");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-100 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Left side: Editorial Brand showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-950 text-white flex-col justify-between p-12 overflow-hidden border-r border-neutral-800">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-neutral-900/60 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-950 shadow-md">
            <Sparkles className="w-5 h-5 fill-neutral-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">
              Pro-Read
            </span>
            <span className="text-xs text-neutral-400 font-mono mt-1">
              Admin & Moderation Console
            </span>
          </div>
        </div>

        {/* Center Content / Value Props */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-medium shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authorized Personnel Only</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
            Curate stories. <br />
            Manage authors. <br />
            Protect the platform.
          </h2>

          <p className="text-sm text-neutral-400 leading-relaxed">
            Welcome to the Pro-Read Administrative workspace. Monitor story
            metrics, moderate user-submitted content, feature highlighted
            masterpieces, and manage writer privileges.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/80">
            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
              <span className="text-xl font-bold text-white tracking-tight">1.2k+</span>
              <p className="text-xs text-neutral-400 mt-0.5">Published Stories</p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
              <span className="text-xl font-bold text-white tracking-tight">99.9%</span>
              <p className="text-xs text-neutral-400 mt-0.5">System Uptime</p>
            </div>
          </div>
        </div>

        {/* Left Footer */}
        <div className="relative z-10 text-xs text-neutral-500 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} Pro-Read Inc.</span>
          <span className="font-mono text-[11px] text-neutral-500">v2.4.0-admin</span>
        </div>
      </div>

      {/* Right side: Clean Admin Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile brand header (shown on < lg) */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-neutral-950 tracking-tight leading-none">
                Pro-Read
              </h1>
              <span className="text-xs text-neutral-500 font-mono">Admin Portal</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-neutral-300 shadow-sm p-8 sm:p-10">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                  Authentication
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100 border border-neutral-250 px-2.5 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Secure Node
                </span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">
                Admin Sign In
              </h2>
              <p className="text-sm text-neutral-600 mt-1.5">
                Enter your administrative credentials to access the console.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs leading-relaxed animate-in fade-in-50">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-6 flex items-start gap-3 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed animate-in fade-in-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-neutral-800 tracking-wide uppercase"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@proread.com"
                    className="pl-9.5 pr-3 h-10 border-neutral-300 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/25 text-sm rounded-lg"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-neutral-800 tracking-wide uppercase"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9.5 pr-10 h-10 border-neutral-300 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/25 text-sm rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer transition p-0.5"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 mt-2 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg text-sm font-semibold tracking-wide transition shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Helper */}
            <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-neutral-500">Need test credentials?</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-semibold text-neutral-900 hover:text-black underline underline-offset-2 cursor-pointer transition"
              >
                Fill Default Admin Credentials
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <p className="text-center text-xs text-neutral-500 mt-6 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Protected by end-to-end encrypted session tokens</span>
          </p>
        </div>
      </div>
    </div>
  );
}
