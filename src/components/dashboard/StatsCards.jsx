import React from 'react';
import { DASHBOARD_STATS } from '../../data/dummyData';

const colorMap = {
  primary: 'text-primary-900',
  amber: 'text-amber-500',
  green: 'text-green-600',
};

/**
 * KPI cards for the dashboard (e.g. Patients Today, Pending Reviews, Acceptance Rate).
 */
export default function StatsCards({ className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
      {DASHBOARD_STATS.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"
        >
          <div className={`text-2xl font-bold font-display ${colorMap[stat.color] || 'text-slate-700'}`}>
            {stat.value}
          </div>
          <div className="text-xs text-slate-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
