import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LogIn, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

/**
 * Login form — Email and Password.
 * Uses react-hook-form for validation with the project's existing Input & Button components.
 */
export default function LoginForm({ onLogin, onSwitchToSignUp }) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    // Simulate a slight delay for UX
    await new Promise((r) => setTimeout(r, 600));
    onLogin(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-100 mb-4">
          <LogIn className="w-6 h-6 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-slate-500 text-sm mt-1.5">
          Sign in to your GLYERAL account to continue.
        </p>
      </div>

      {/* Email */}
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

      {/* Password with toggle */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="login-password"
          >
            Password <span className="text-red-400 ml-1">*</span>
          </label>
          <button
            type="button"
            className="text-xs text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className={`w-full px-3.5 py-2.5 pr-11 border-2 rounded-xl focus:outline-none text-sm transition-all duration-200 placeholder:text-slate-400 bg-white ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/40'
                : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 hover:border-slate-300'
            }`}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
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
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          id="remember"
          className="w-4 h-4 rounded border-2 border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer accent-primary-600"
        />
        <label
          htmlFor="remember"
          className="text-sm text-slate-600 font-medium cursor-pointer select-none"
        >
          Keep me signed in
        </label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={!isValid}
        className="w-full"
        size="lg"
        icon={<ArrowRight className="w-4 h-4" />}
      >
        Sign In
      </Button>

      {/* Switch to sign up */}
      <p className="text-center text-sm text-slate-500">
        {"Don't have an account?"}{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
