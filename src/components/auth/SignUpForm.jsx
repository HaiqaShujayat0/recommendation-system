import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const PASSWORD_RULES = [
    { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
    { id: 'lowercase', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
    { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
];

export default function SignUpForm({ onSignUp, onSwitchToLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm({ mode: 'onChange' });

    const passwordValue = watch('password', '');

    const onSubmit = async (data) => {
        await new Promise((r) => setTimeout(r, 600));
        onSignUp(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-100 mb-4">
                    <UserPlus className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Create your account
                </h2>
                <p className="text-slate-500 text-sm mt-1.5">
                    Join GLYERAL to access physician decision support tools.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    placeholder="Jane"
                    {...register('firstName', {
                        required: 'First name is required',
                        minLength: { value: 2, message: 'At least 2 characters' },
                        pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
                    })}
                    error={errors.firstName?.message}
                    required
                />
                <Input
                    label="Last Name"
                    placeholder="Doe"
                    {...register('lastName', {
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'At least 2 characters' },
                        pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
                    })}
                    error={errors.lastName?.message}
                    required
                />
            </div>

            <Input
                label="Email Address"
                type="email"
                placeholder="jane.doe@hospital.org"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address',
                    },
                })}
                error={errors.email?.message}
                required
            />

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                    Password <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className={`w-full px-3.5 py-2.5 pr-11 border-2 rounded-xl focus:outline-none text-sm transition-all duration-200 placeholder:text-slate-400 bg-white ${errors.password
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/40'
                                : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 hover:border-slate-300'
                            }`}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'At least 8 characters' },
                            validate: (value) => {
                                if (!/[A-Z]/.test(value)) return 'Must include an uppercase letter';
                                if (!/[a-z]/.test(value)) return 'Must include a lowercase letter';
                                if (!/\d/.test(value)) return 'Must include a number';
                                return true;
                            },
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 animate-fade-in font-medium">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password.message}
                    </p>
                )}
                {passwordValue.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 animate-fade-in">
                        {PASSWORD_RULES.map((rule) => {
                            const passes = rule.test(passwordValue);
                            return (
                                <div
                                    key={rule.id}
                                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${passes ? 'text-emerald-600' : 'text-slate-400'
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${passes ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                            }`}
                                    >
                                        <Check className="w-2.5 h-2.5" />
                                    </div>
                                    {rule.label}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        className={`w-full px-3.5 py-2.5 pr-11 border-2 rounded-xl focus:outline-none text-sm transition-all duration-200 placeholder:text-slate-400 bg-white ${errors.confirmPassword
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/40'
                                : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 hover:border-slate-300'
                            }`}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) => value === passwordValue || 'Passwords do not match',
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                        {showConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 animate-fade-in font-medium">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <Button type="submit" loading={isSubmitting} disabled={!isValid} className="w-full" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Create Account
            </Button>

            <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button type="button" onClick={onSwitchToLogin} className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors">
                    Sign in
                </button>
            </p>
        </form>
    );
}