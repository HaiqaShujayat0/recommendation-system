import React, { useRef, useEffect, useState } from 'react';
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
 * Clean collapsible sidebar — white background, active states.
 * Collapsed state shows icon-only nav with hover tooltips (like Claude's sidebar).
 * Clinical Snapshot pinned to bottom when expanded.
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
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    if (open && sidebarRef.current) {
      const first = sidebarRef.current.querySelector('button, a, [tabIndex]');
      first?.focus();
    }
  }, [open]);

  return (
    <aside
      ref={sidebarRef}
      className={`bg-white shadow-sidebar flex-shrink-0 border-r border-slate-100 transition-all duration-300 ease-in-out relative ${
        open ? 'w-60 overflow-hidden' : 'w-[52px] overflow-visible'
      }`}
    >
      {/* ─── Expanded state ─── */}
      <div
        className={`absolute inset-0 w-60 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Collapse toggle — expanded */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-3 right-2 z-10 w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Nav content — bottom padding reserves space for the pinned snapshot */}
        <div className="p-4 pb-[160px] space-y-4">
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-500 rounded-r-full" />
                  )}
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-primary-500' : ''
                      }`}
                    />
                  )}
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clinical Snapshot — pinned to bottom of sidebar */}
        {patientData && (
          <div className="absolute bottom-0 left-0 w-60 p-4 bg-white border-t border-slate-100">
            <div className="p-3.5 bg-primary-50 rounded-xl border border-primary-100">
              <h4 className="text-[10px] font-bold text-primary-600 uppercase mb-2.5 flex items-center gap-1.5 tracking-wide">
                <TrendingUp className="w-3 h-3" />
                Clinical Snapshot
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">HbA1c</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                      parseFloat(patientData.labs?.hba1c) > 7
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
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                      parseFloat(patientData.labs?.egfr) < 60
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
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                      patientData.demographics?.bmi > 30
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
          </div>
        )}
      </div>

      {/* ─── Collapsed state: icon rail with tooltips ─── */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          !open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Expand toggle */}
        <div className="flex justify-center pt-3 pb-2">
          <button
            type="button"
            onClick={onToggle}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200"
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-2.5 mb-2 border-t border-slate-100" />

        {/* Icon nav */}
        <nav className="flex flex-col items-center gap-1 px-1.5" aria-label="Patient sections">
          {NAV_ITEMS.map(({ id, iconId, label }) => {
            const Icon = iconMap[iconId];
            const isActive = currentScreen === id;
            const isHovered = hoveredItem === id;

            return (
              <div key={id} className="relative">
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  onMouseEnter={() => setHoveredItem(id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                  aria-label={label}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary-500 rounded-r-full -ml-1.5" />
                  )}
                  {Icon && <Icon className="w-[18px] h-[18px]" />}
                </button>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 pointer-events-none">
                    <div className="relative flex items-center">
                      {/* Arrow */}
                      <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 -mr-[3px] flex-shrink-0" />
                      {/* Label */}
                      <div className="bg-slate-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                        {label}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Back to search — collapsed */}
        <div className="mx-2.5 mt-2 border-t border-slate-100 pt-2 flex justify-center">
          <div className="relative">
            <button
              type="button"
              onClick={onBackToSearch}
              onMouseEnter={() => setHoveredItem('back')}
              onMouseLeave={() => setHoveredItem(null)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
              aria-label="Back to Search"
            >
              <ArrowLeft className="w-[18px] h-[18px]" />
            </button>

            {/* Tooltip */}
            {hoveredItem === 'back' && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 pointer-events-none">
                <div className="relative flex items-center">
                  <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 -mr-[3px] flex-shrink-0" />
                  <div className="bg-slate-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                    Back to Search
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
