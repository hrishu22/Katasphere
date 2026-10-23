"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import {
  Crown,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock,
  Building2,
  HelpCircle,
  X,
} from "lucide-react";

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/companies";

  const { user, isLoading: authLoading, upgradeToPremium, togglePremium } = useAuth();
  const isUserPremium = Boolean(user && (user.isPremium || user.role === "PREMIUM" || user.role === "ADMIN"));

  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "instant">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txnId, setTxnId] = useState("");

  // Card form state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [cardName, setCardName] = useState(user?.name || "Katasphere Member");

  // UPI state
  const [upiId, setUpiId] = useState("coder@okaxis");

  const price = billingCycle === "annual" ? 8 : 14;
  const billedTotal = billingCycle === "annual" ? 96 : 14;

  const handleOpenCheckout = () => {
    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }
    setShowCheckout(true);
    setPaymentSuccess(false);
  };

  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);
      // Simulate realistic payment gateway interaction
      await new Promise((resolve) => setTimeout(resolve, 1400));
      
      // Perform backend upgrade
      await upgradeToPremium();

      const generatedTxn = "TXN-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      setTxnId(generatedTxn);
      setPaymentSuccess(true);
    } catch (err) {
      alert("Payment simulation failed. Please ensure you are logged in.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleDemo = async () => {
    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }
    try {
      setIsProcessing(true);
      await togglePremium();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-xs font-bold">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>Katasphere Pro Membership</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Accelerate Your SDE Career & Ace Tech Interviews
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlock real verified interview question sets from Google, Amazon, Meta, and Microsoft. Practice with round-by-round breakdowns, frequency statistics, and optimal editorial solutions.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-2 flex items-center justify-center">
            <div className="p-1 rounded-xl bg-surface border border-surface-border inline-flex items-center space-x-1 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  billingCycle === "monthly"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-foreground"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  billingCycle === "annual"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-foreground"
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/20 text-white uppercase font-black">
                  Save 40%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Free Tier Card */}
          <div className="p-8 rounded-3xl bg-surface border border-surface-border flex flex-col justify-between space-y-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Free Starter</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Ideal for learning coding fundamentals and solving standard DSA.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-bold text-slate-500">
                  Standard
                </span>
              </div>

              <div>
                <span className="text-4xl font-black text-foreground">$0</span>
                <span className="text-xs text-slate-400 font-medium ml-1">/ forever</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-surface-border text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Access to standard catalog problems</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>2 free preview questions per company track</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Isolated sandbox code runner (Java, Python, C++, TS)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Standard execution and testcase feedback</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-400">
                  <X className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Full company question banks (Google, Amazon, Meta)</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-400">
                  <X className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Round-by-round breakdown (OA vs Phone vs Onsite)</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {!isUserPremium ? (
                <div className="w-full py-3 px-4 rounded-xl bg-surface-subtle border border-surface-border text-center text-xs font-bold text-slate-500">
                  Your Current Plan
                </div>
              ) : (
                <button
                  onClick={handleToggleDemo}
                  className="w-full py-3 px-4 rounded-xl bg-surface-subtle hover:bg-surface-muted border border-surface-border text-center text-xs font-semibold text-slate-600 dark:text-slate-300 transition"
                >
                  Downgrade to Free (Demo Mode)
                </button>
              )}
            </div>
          </div>

          {/* Pro Tier Card (Highlighted) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-surface via-surface to-amber-500/5 border-2 border-amber-500 shadow-xl relative flex flex-col justify-between space-y-8 overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[11px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider shadow-sm flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Recommended</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-black text-foreground">Katasphere Pro</h3>
                    <Crown className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Everything you need to land top tech offers at FAANG & Tier-1 companies.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-black text-foreground">${price}</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                  {billingCycle === "annual"
                    ? `Billed annually at $${billedTotal}/year (Save $72)`
                    : "Billed monthly, cancel anytime"}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-surface-border text-xs text-foreground font-medium">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>All Company Interview Sets Unlocked</strong> (Google, Amazon, Meta, Microsoft, Apple, Uber)
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Round-by-round categorization (OA, Phone Screen, Onsite DSA)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Interview frequency rankings & verified 2026 recency</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Curated multi-language editorial solutions & complexity proofs</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Priority isolated sandbox execution with zero wait time</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Early access to new SDE-1 & SDE-2 interview sheets</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              {isUserPremium ? (
                <div className="w-full py-3.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-xs font-bold text-amber-500 flex items-center justify-center space-x-2">
                  <Crown className="h-4 w-4" />
                  <span>Your Current Plan — Pro Member</span>
                </div>
              ) : (
                <button
                  onClick={handleOpenCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-extrabold shadow-lg shadow-amber-500/25 transition flex items-center justify-center space-x-2"
                >
                  <Crown className="h-4 w-4" />
                  <span>Upgrade to Katasphere Pro</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <p className="text-[11px] text-center text-slate-400">
                🔒 30-day money-back guarantee • Instant access • Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid Breakdown */}
        <div className="p-8 rounded-3xl bg-surface border border-surface-border max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-foreground">Why Top Candidates Choose Katasphere Pro</h3>
            <p className="text-xs text-slate-500">Built specifically to remove guesswork from algorithmic interview preparation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-surface-subtle border border-surface-border space-y-2">
              <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Targeted Company Tracks</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter questions specifically by company. Spend time practicing the actual problems asked in Google OA and Meta phone screens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-subtle border border-surface-border space-y-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Real Frequency Stats</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every problem displays its frequency percentage so you can prioritize top 90%+ questions before lower-priority patterns.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-subtle border border-surface-border space-y-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Zero Ads & Priority Sandboxes</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enjoy lightning-fast isolated code compilation without waiting in queues or dealing with distracting banner ads.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-surface border border-surface-border shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-foreground hover:bg-surface-subtle transition"
              >
                <X className="h-5 w-5" />
              </button>

              {!paymentSuccess ? (
                <>
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
                      <Crown className="h-3.5 w-3.5" />
                      <span>Secure Checkout</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Complete Your Katasphere Pro Subscription</h3>
                    <p className="text-xs text-slate-500">
                      Billed {billingCycle === "annual" ? "annually" : "monthly"}. Instant access to all company questions.
                    </p>
                  </div>

                  {/* Order Summary Pill */}
                  <div className="p-4 rounded-2xl bg-surface-subtle border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-foreground block">
                        Katasphere Pro ({billingCycle === "annual" ? "1-Year Access" : "1-Month Access"})
                      </span>
                      <span className="text-[11px] text-slate-400">All company sets & rounds unlocked</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-foreground">${billedTotal}</span>
                      <span className="text-[10px] text-slate-400 block">USD</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition ${
                          paymentMethod === "card"
                            ? "bg-brand-500/10 border-brand-500 text-brand-500 shadow-xs"
                            : "bg-surface-subtle border-surface-border text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Card</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition ${
                          paymentMethod === "upi"
                            ? "bg-brand-500/10 border-brand-500 text-brand-500 shadow-xs"
                            : "bg-surface-subtle border-surface-border text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>UPI / QR</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod("instant")}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition ${
                          paymentMethod === "instant"
                            ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-xs"
                            : "bg-surface-subtle border-surface-border text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <Zap className="h-4 w-4" />
                        <span>1-Click Test</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Form Fields */}
                  {paymentMethod === "card" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-surface-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-surface-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            Expires
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-surface-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            CVC
                          </label>
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-surface-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Virtual Payment Address (VPA / UPI ID)
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-surface-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        A payment request will be simulated to your UPI app (Google Pay, PhonePe, Paytm).
                      </p>
                    </div>
                  )}

                  {paymentMethod === "instant" && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-600 dark:text-amber-400 space-y-1">
                      <span className="font-bold block">1-Click Instant Demo Payment</span>
                      <p className="text-[11px]">
                        Bypasses external card processing for instant evaluation and demonstration. Upgrades your active account to Katasphere Pro immediately.
                      </p>
                    </div>
                  )}

                  {/* Submit Payment Button */}
                  <button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 transition flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Authorizing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Pay ${billedTotal} & Activate Pro</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* Payment Success Celebration State */
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-foreground">Welcome to Katasphere Pro!</h3>
                    <p className="text-xs text-slate-500">
                      Payment confirmed. All company questions and interview tracks are now unlocked.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border text-xs font-mono text-slate-500 inline-block">
                    Receipt: <strong className="text-foreground">{txnId}</strong>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/companies"
                      className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Go to Company Sets</span>
                    </Link>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="py-3 px-4 rounded-xl bg-surface-subtle hover:bg-surface-muted text-foreground font-semibold text-xs transition border border-surface-border"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto" />
            <p className="text-sm text-slate-500 mt-3">Loading Plans...</p>
          </div>
        </AppShell>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
