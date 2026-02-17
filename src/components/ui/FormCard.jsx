import React from 'react';

/**
 * Clean card wrapper for form pages — solid white with purple accent bar.
 */
export default function FormCard({
    title,
    subtitle,
    children,
    className = '',
    accentColor = 'primary',
    headerSlot,
}) {
    const accentGradients = {
        primary: 'from-primary-500 to-primary-600',
        accent: 'from-accent-500 to-accent-600',
        amber: 'from-amber-400 to-orange-400',
        secondary: 'from-secondary-500 to-secondary-600',
    };

    const gradient = accentGradients[accentColor] || accentGradients.primary;

    return (
        <div className={`animate-fade-in ${className}`}>
            {/* Section header card */}
            <div className="card px-5 py-4 mb-4 relative overflow-hidden">
                {/* Gradient accent bar */}
                <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
                />
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
                        )}
                    </div>
                    {headerSlot}
                </div>
            </div>

            {/* Content card */}
            <div className="card-elevated p-5 md:p-6 relative overflow-hidden animate-slide-up">
                {children}
            </div>
        </div>
    );
}
