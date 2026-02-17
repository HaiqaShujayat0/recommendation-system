import React, { useState } from 'react';
import { Brain, Sparkles, ShieldCheck, Activity, Stethoscope } from 'lucide-react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

/**
 * Full-page auth layout: left branded panel + right form panel.
 * Matches the GLYERAL medical portal aesthetic — purple gradients, Inter font, clean cards.
 */
export default function AuthLayout({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  const handleLogin = (data) => {
    onAuthenticated({ ...data, name: data.email.split('@')[0] });
  };

  const handleSignUp = (data) => {
    onAuthenticated({
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f3ff] flex">
      {/* ── Left branded panel ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-20 -left-10 w-72 h-72 rounded-full border-2 border-white" />
          <div className="absolute top-40 left-20 w-96 h-96 rounded-full border border-white" />
          <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full border-2 border-white" />
          <div className="absolute bottom-40 right-20 w-56 h-56 rounded-full border border-white" />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 text-white w-full">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center border border-white/10">
                <Brain className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                  GLYERAL
                  <Sparkles className="w-3.5 h-3.5 text-primary-300 opacity-70" />
                </h1>
                <p className="text-[11px] text-primary-200/70 -mt-0.5 font-medium">
                  Healthcare Decision Support
                </p>
              </div>
            </div>

            {/* Hero text */}
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-balance">
              Intelligent Diabetes
              <br />
              Care, Simplified.
            </h2>
            <p className="mt-4 text-primary-200/80 text-sm leading-relaxed max-w-sm">
              Evidence-based medication recommendations powered by clinical
              guidelines and patient-specific data analysis.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/5">
                <ShieldCheck className="w-4.5 h-4.5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">
                  Clinical-Grade Security
                </p>
                <p className="text-xs text-primary-300/70 mt-0.5">
                  HIPAA-compliant data handling and encryption.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/5">
                <Activity className="w-4.5 h-4.5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">
                  Real-Time Analytics
                </p>
                <p className="text-xs text-primary-300/70 mt-0.5">
                  Track patient outcomes and treatment efficacy.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/5">
                <Stethoscope className="w-4.5 h-4.5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">
                  Guideline-Driven
                </p>
                <p className="text-xs text-primary-300/70 mt-0.5">
                  ADA/EASD-aligned recommendation engine.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-[11px] text-primary-300/50 font-medium">
            GLYERAL v1.0 &middot; Physician Decision Support System
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative">
        {/* Mobile brand header (visible < lg) */}
        <div className="absolute top-0 left-0 right-0 lg:hidden">
          <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/10">
                <Brain className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  GLYERAL
                  <Sparkles className="w-3.5 h-3.5 text-primary-300 opacity-70" />
                </h1>
                <p className="text-[11px] text-primary-200/70 -mt-0.5 font-medium">
                  Healthcare Decision Support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md">
          <div className="card-elevated p-7 md:p-8 animate-fade-in">
            {mode === 'login' ? (
              <LoginForm
                onLogin={handleLogin}
                onSwitchToSignUp={() => setMode('signup')}
              />
            ) : (
              <SignUpForm
                onSignUp={handleSignUp}
                onSwitchToLogin={() => setMode('login')}
              />
            )}
          </div>

          {/* Trust badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protected by enterprise-grade encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
