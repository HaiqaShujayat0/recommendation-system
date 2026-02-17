import React from 'react';
import { User, ChevronRight } from 'lucide-react';

/**
 * Clean patient row — NexHR-inspired list item with avatar initials.
 */
export default function PatientCard({ patient, onSelect }) {
  const hba1cNum = parseFloat(patient.hba1c);
  const statusColor =
    hba1cNum > 9
      ? 'bg-red-500'
      : hba1cNum > 7
        ? 'bg-amber-500'
        : 'bg-emerald-500';
  const hba1cBadge =
    hba1cNum > 7
      ? 'bg-red-50 text-red-600 border border-red-200/60'
      : 'bg-green-50 text-green-700 border border-green-200/60';

  // Get initials
  const initials = patient.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onSelect(patient)}
      className="w-full px-4 py-3.5 hover:bg-primary-50/40 cursor-pointer flex items-center gap-3 transition-all duration-200 text-left focus:bg-primary-50/40 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-inset group relative"
    >
      {/* Status indicator bar */}
      <div
        className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${statusColor} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      {/* Avatar with initials — NexHR style */}
      <div className="w-10 h-10 bg-primary-100 border border-primary-200/60 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-primary-700">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate group-hover:text-primary-700 transition-colors">
          {patient.name}
        </p>
        <p className="text-xs text-slate-500">
          {patient.mrNumber} • {patient.age}y • {patient.gender}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
          HbA1c
        </p>
        <p
          className={`text-sm font-bold px-2 py-0.5 rounded-full ${hba1cBadge}`}
        >
          {patient.hba1c}%
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
