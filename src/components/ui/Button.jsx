import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Clean button component with purple primary theme.
 * Supports variant, size, loading, and pill props.
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    pill = true,
    icon,
    children,
    className = '',
    disabled,
    ...rest
}) {
    const baseClasses =
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none select-none';

    const variants = {
        primary:
            'bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg focus-visible:ring-primary-500 active:scale-[0.98]',
        secondary:
            'bg-secondary-600 text-white shadow-md hover:bg-secondary-700 focus-visible:ring-secondary-500 active:scale-[0.98]',
        accent:
            'bg-accent-500 text-white shadow-md hover:bg-accent-600 focus-visible:ring-accent-500 active:scale-[0.98]',
        success:
            'bg-emerald-600 text-white shadow-md hover:bg-emerald-700 focus-visible:ring-emerald-500 active:scale-[0.98]',
        outline:
            'border-2 border-slate-200 text-slate-700 bg-white hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-700 focus-visible:ring-primary-500 active:scale-[0.98]',
        ghost:
            'text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-slate-500',
        danger:
            'bg-red-600 text-white shadow-md hover:bg-red-700 focus-visible:ring-red-500 active:scale-[0.98]',
    };

    const sizes = {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-5 py-2.5',
        lg: 'text-base px-6 py-3',
    };

    const shape = pill ? 'rounded-full' : 'rounded-xl';

    return (
        <button
            className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${shape} ${className}`}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                icon && <span className="flex-shrink-0">{icon}</span>
            )}
            {children}
        </button>
    );
}
