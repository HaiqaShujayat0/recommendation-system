import React from 'react';
import {
  User,
  Activity,
  FlaskConical,
  Droplets,
  Pill,
  Brain,
  FileText,
  ArrowLeft,
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
 * Sidebar shown when a patient is selected.
 * Renders nav items and optional key metrics block.
 */
export default function Sidebar({
  currentScreen,
  onNavigate,
  onBackToSearch,
  patientData,
  open,
}) {
  if (!open) return null;

  return (
    <aside className="w-56 bg-white shadow-lg transition-all duration-300 overflow-hidden flex-shrink-0 border-r border-slate-200">
      <div className="p-3 w-56">
        <button
          type="button"
          onClick={onBackToSearch}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-900 text-sm mb-4 w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </button>

        <nav className="space-y-1" aria-label="Patient sections">
          {NAV_ITEMS.map(({ id, iconId, label }) => {
            const Icon = iconMap[iconId];
            const isActive = currentScreen === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </button>
            );
          })}
        </nav>

        {patientData && (
          <div className="mt-6 p-3 bg-slate-50 rounded-lg">
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Key Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">HbA1c</span>
                <span
                  className={`font-bold ${
                    parseFloat(patientData.labs?.hba1c) > 7 ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {patientData.labs?.hba1c || '--'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">eGFR</span>
                <span
                  className={`font-bold ${
                    parseFloat(patientData.labs?.egfr) < 60 ? 'text-amber-500' : 'text-green-600'
                  }`}
                >
                  {patientData.labs?.egfr || '--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">BMI</span>
                <span
                  className={`font-bold ${
                    patientData.demographics?.bmi > 30
                      ? 'text-red-500'
                      : patientData.demographics?.bmi > 25
                        ? 'text-amber-500'
                        : 'text-green-600'
                  }`}
                >
                  {patientData.demographics?.bmi ?? '--'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
