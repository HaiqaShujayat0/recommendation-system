import React, { useState } from 'react';
import {
    Brain,
    Sparkles,
    ShieldCheck,
    Activity,
    Stethoscope,
} from 'lucide-react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

/**
 * Auth layout — NexHR-inspired centered card with branded left panel.
 * Displayed as a single elevated card floating over a gradient background.
 */
export default function AuthLayout({ onAuthenticated }) {
    const [mode, setMode] = useState('login');

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
        <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 -left-10 w-72 h-72 rounded-full border border-white/[0.04]" />
                <div className="absolute top-40 left-40 w-96 h-96 rounded-full border border-white/[0.03]" />
                <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full border-2 border-white/[0.04]" />
                <div className="absolute bottom-40 right-32 w-56 h-56 rounded-full border border-white/[0.03]" />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl" />
            </div>

            {/* Main card */}
            <div className="relative z-10 w-full max-w-[920px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex min-h-[540px]">
                {/* Left branded panel */}
                <div className="hidden lg:flex w-[380px] flex-shrink-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
                    {/* Subtle pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                    <div className="relative z-10 flex flex-col justify-between p-8 xl:p-10 text-white w-full">
                        {/* Logo */}
                        <div>
                            <div className="flex items-center gap-3 mb-12">
                                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
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

                            {/* Tagline */}
                            <h2 className="text-2xl xl:text-3xl font-bold leading-tight tracking-tight">
                                Intelligent Diabetes
                                <br />
                                Care, Simplified.
                            </h2>
                            <p className="mt-3 text-primary-200/70 text-sm leading-relaxed max-w-xs">
                                Evidence-based medication recommendations powered by clinical
                                guidelines and patient-specific data analysis.
                            </p>
                        </div>

                        {/* Feature list */}
                        <div className="space-y-3.5">
                            {[
                                {
                                    Icon: ShieldCheck,
                                    title: 'Clinical-Grade Security',
                                    desc: 'HIPAA-compliant data handling',
                                },
                                {
                                    Icon: Activity,
                                    title: 'Real-Time Analytics',
                                    desc: 'Track patient outcomes live',
                                },
                                {
                                    Icon: Stethoscope,
                                    title: 'Guideline-Driven',
                                    desc: 'ADA / KDIGO / AHA aligned',
                                },
                            ].map(({ Icon, title, desc }) => (
                                <div key={title} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/5">
                                        <Icon className="w-4 h-4 text-primary-200" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-white/90">
                                            {title}
                                        </p>
                                        <p className="text-[11px] text-primary-300/60">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <p className="text-[10px] text-primary-300/40 font-medium">
                            GLYERAL v1.0 &middot; Physician Decision Support System
                        </p>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="flex-1 flex flex-col">
                    {/* Mobile header */}
                    <div className="lg:hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center border border-white/10">
                                <Brain className="w-4 h-4 text-primary-200" />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                                    GLYERAL
                                    <Sparkles className="w-3 h-3 text-primary-300 opacity-70" />
                                </h1>
                                <p className="text-[10px] text-primary-200/70 -mt-0.5 font-medium">
                                    Healthcare Decision Support
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="flex-1 flex items-center justify-center px-6 py-8 md:px-10">
                        <div className="w-full max-w-sm">
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
                    </div>

                    {/* Security badge */}
                    <div className="px-6 pb-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Protected by enterprise-grade encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
}