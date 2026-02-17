import React from 'react';
import { Users, ClipboardList, TrendingUp } from 'lucide-react';
import { DASHBOARD_STATS } from '../../data/dummyData';

const cardConfig = [
  {
    borderColor: 'border-l-primary-500',
    bgTint: 'bg-primary-50/40',
    icon: Users,
    iconColor: 'text-primary-600',
    iconBg: 'bg-primary-100',
    valueColor: 'text-primary-700',
  },
  {
    borderColor: 'border-l-amber-500',
    bgTint: 'bg-amber-50/40',
    icon: ClipboardList,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    valueColor: 'text-amber-700',
  },
  {
    borderColor: 'border-l-emerald-500',
    bgTint: 'bg-emerald-50/40',
    icon: TrendingUp,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    valueColor: 'text-emerald-700',
  },
];

/**
 * NexHR-inspired stat cards: white bg, colored left border, colored icon.
 */
export default function StatsCards({ className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 stagger-children ${className}`}>
      {DASHBOARD_STATS.map((stat, i) => {
        const config = cardConfig[i] || cardConfig[0];
        const Icon = config.icon;
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-xl p-4 bg-white border border-slate-200/80 border-l-4 ${config.borderColor} shadow-card hover:shadow-card-md transition-all duration-300 hover:-translate-y-0.5 cursor-default group`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold leading-tight ${config.valueColor}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
