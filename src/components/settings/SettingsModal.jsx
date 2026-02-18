import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Settings, Shield, X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { fetchUserProfile, updatePassword, updateUserProfile } from '../../services/authService';

export default function SettingsModal({ open, onClose }) {
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveOk, setSaveOk] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ mode: 'onChange' });

  const newPassword = watch('new_password', '');

  const canClose = useMemo(() => !isSubmitting, [isSubmitting]);

  useEffect(() => {
    if (!open) return;
    let alive = true;

    const run = async () => {
      setSaveError('');
      setSaveOk('');
      setProfileError('');
      setLoadingProfile(true);

      const result = await fetchUserProfile();
      if (!alive) return;

      setLoadingProfile(false);
      if (!result.success) {
        setProfileError(result.error || 'Unable to load profile.');
        // still open with empty fields so user can proceed once backend works
        reset({
          first_name: '',
          last_name: '',
          email: '',
          org_id: '',
          current_password: '',
          new_password: '',
          confirm_new_password: '',
        });
        return;
      }

      const p = result.profile || {};

      reset({
        first_name: p.first_name ?? '',
        last_name: p.last_name ?? '',
        email: p.email ?? '',
        org_id: p.org_id ?? '',
        current_password: '',
        new_password: '',
        confirm_new_password: '',
      });
    };

    run();
    return () => {
      alive = false;
    };
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && canClose) onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, canClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const onSubmit = async (data) => {
    setSaveError('');
    setSaveOk('');

    const profileRes = await updateUserProfile({
      first_name: data.first_name?.trim(),
      last_name: data.last_name?.trim(),
      email: data.email?.trim(),
      org_id: data.org_id?.toString().trim() || null,
    });

    if (!profileRes.success) {
      setSaveError(profileRes.error || 'Unable to save profile changes.');
      return;
    }

    if (data.new_password?.trim()) {
      const pwRes = await updatePassword({
        current_password: data.current_password?.trim() || undefined,
        new_password: data.new_password?.trim(),
      });
      if (!pwRes.success) {
        setSaveError(pwRes.error || 'Password update failed.');
        return;
      }
    }

    setSaveOk('Changes saved.');
    reset(
      {
        ...data,
        current_password: '',
        new_password: '',
        confirm_new_password: '',
      },
      { keepDirty: false }
    );
  };

  const overlayMouseDown = (e) => {
    if (e.target === e.currentTarget && canClose) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4 overflow-hidden"
      onMouseDown={overlayMouseDown}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[calc(100vh-2rem)] flex flex-col relative animate-scale-in overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-t-2xl" />

        {/* Fixed header */}
        <div className="flex items-start justify-between flex-shrink-0 px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Profile</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                This information is used for your account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => canClose && onClose?.()}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canClose}
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body with visible scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-5">
          {profileError && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {profileError}
            </div>
          )}
          {saveError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {saveError}
            </div>
          )}
          {saveOk && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {saveOk}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" id="settings-form">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-bold text-slate-900">Profile</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  This information is used for your account.
                </p>
              </div>
              {loadingProfile && (
                <div className="text-xs font-medium text-slate-500">Loading…</div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Jane"
                {...register('first_name', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'At least 2 characters' },
                  pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
                })}
                error={errors.first_name?.message}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                {...register('last_name', {
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'At least 2 characters' },
                  pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
                })}
                error={errors.last_name?.message}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
              <Input
                label="Organization ID (optional)"
                placeholder="e.g. 42"
                {...register('org_id')}
                error={errors.org_id?.message}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-slate-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Password</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Leave blank if you don’t want to change it.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="current_password">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current_password"
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full px-3.5 py-2.5 pr-11 border-2 rounded-xl focus:outline-none text-sm transition-all duration-200 placeholder:text-slate-400 bg-white ${errors.current_password
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/40'
                      : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 hover:border-slate-300'
                      }`}
                    {...register('current_password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showCurrent ? 'Hide password' : 'Show password'}
                  >
                    {showCurrent ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="new_password">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new_password"
                    type={showNew ? 'text' : 'password'}
                    placeholder="New password"
                    className={`w-full px-3.5 py-2.5 pr-11 border-2 rounded-xl focus:outline-none text-sm transition-all duration-200 placeholder:text-slate-400 bg-white ${errors.new_password
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/40'
                      : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 hover:border-slate-300'
                      }`}
                    {...register('new_password', {
                      validate: (value) => {
                        if (!value) return true;
                        if (value.length < 8) return 'At least 8 characters';
                        if (!/[A-Z]/.test(value)) return 'One uppercase letter required';
                        if (!/[a-z]/.test(value)) return 'One lowercase letter required';
                        if (!/\d/.test(value)) return 'One number required';
                        return true;
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                  >
                    {showNew ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 animate-fade-in font-medium">
                    <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                    {errors.new_password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="confirm_new_password">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm_new_password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`w-full px-3.5 py-2.5 pr-11 border-2 rounded-xl focus:outline-none text-sm transition-all duration-200 placeholder:text-slate-400 bg-white ${errors.confirm_new_password
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/40'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 hover:border-slate-300'
                    }`}
                  {...register('confirm_new_password', {
                    validate: (value) => {
                      if (!newPassword) return true;
                      return value === newPassword || 'Passwords do not match';
                    },
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
              {errors.confirm_new_password && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 animate-fade-in font-medium">
                  {errors.confirm_new_password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-500">
              {isDirty ? 'You have unsaved changes.' : ' '}
            </p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => canClose && onClose?.()}
                disabled={!canClose}
              >
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={isSubmitting}
                icon={<Shield className="w-4 h-4" />}
              >
                Save changes
              </Button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

