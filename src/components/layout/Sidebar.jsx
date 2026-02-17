import React, { useRef, useEffect } from 'react';
import {
  User,
  Activity,
  FlaskConical,
  Droplets,
  Pill,
  Brain,
  FileText,
  ArrowLeft,
  TrendingUp,
  ChevronLeft,
} from 'lucide-react';
import { NAV_ITEMS } from '../../data/dummyData';

const iconMap = {
  User,
  Activity,
  FlaskConical,
  Droplets,
  Pill,
  Brain,
  FileText,
};

/**
 * Clean collapsible sidebar — white background, purple active states.
 * NexHR-inspired: left purple bar on active item, clean icon-only collapsed state.
 */
export default function Sidebar({
  currentScreen,
  onNavigate,
  onBackToSearch,
  patientData,
  open,
  onToggle,
}) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (open && sidebarRef.current) {
      const first = sidebarRef.current.querySelector('button, a, [tabIndex]');
      first?.focus();
    }
  }, [open]);

  return (
    <aside
      ref={sidebarRef}
      className={`bg-white shadow-sidebar flex-shrink-0 border-r border-slate-100 transition-all duration-300 ease-in-out overflow-hidden ${open ? 'w-60' : 'w-14'
        }`}
    >
      <div className="h-full flex flex-col relative">
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-3 right-2 z-10 w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200"
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${open ? '' : 'rotate-180'
              }`}
          />
        </button>

        {/* Sidebar content */}
        <div
          className={`p-4 w-60 h-full flex flex-col gap-4 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          <button
            type="button"
            onClick={onBackToSearch}
            className="flex items-center gap-2 text-slate-400 hover:text-primary-600 text-xs font-semibold w-full transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Search
          </button>

          <div className="text-[10px] font-bold text-slate-400 tracking-[0.14em] uppercase">
            Patient Journey
          </div>

          <nav className="space-y-1 stagger-children" aria-label="Patient sections">
            {NAV_ITEMS.map(({ id, iconId, label }) => {
              const Icon = iconMap[iconId];
              const isActive = currentScreen === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-500 rounded-r-full" />
                  )}
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-500' : ''
                        }`}
                    />
                  )}
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Key Clinical Snapshot */}
          {patientData && (
            <div className="mt-auto p-3.5 bg-primary-50 rounded-xl border border-primary-100">
              <h4 className="text-[10px] font-bold text-primary-600 uppercase mb-2.5 flex items-center gap-1.5 tracking-wide">
                <TrendingUp className="w-3 h-3" />
                Clinical Snapshot
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">HbA1c</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${parseFloat(patientData.labs?.hba1c) > 7
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {patientData.labs?.hba1c || '--'}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">eGFR</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${parseFloat(patientData.labs?.egfr) < 60
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {patientData.labs?.egfr || '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">BMI</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${patientData.demographics?.bmi > 30
                      ? 'bg-red-100 text-red-600'
                      : patientData.demographics?.bmi > 25
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {patientData.demographics?.bmi ?? '--'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collapsed state: show icons only */}
        {!open && (
          <div className="flex flex-col items-center gap-2 pt-14 px-1">
            {NAV_ITEMS.map(({ id, iconId }) => {
              const Icon = iconMap[iconId];
              const isActive = currentScreen === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-primary-600'
                    }`}
                  title={id}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
