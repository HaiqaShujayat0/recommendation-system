import React from 'react';
import { User, ChevronRight } from 'lucide-react';

/**
 * Single patient row for the dashboard list.
 * Shows avatar, name, MR#, age, gender, HbA1c; click selects patient.
 */
export default function PatientCard({ patient, onSelect }) {
  const hba1cNum = parseFloat(patient.hba1c);
  const hba1cClass = hba1cNum > 7 ? 'text-red-500' : 'text-green-600';

  return (
    <button
      type="button"
      onClick={() => onSelect(patient)}
      className="w-full px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition text-left rounded-lg focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
    >
      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-primary-900" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 truncate">{patient.name}</p>
        <p className="text-xs text-slate-500">
          {patient.mrNumber} • {patient.age}y • {patient.gender}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-slate-400">HbA1c</p>
        <p className={`text-sm font-bold ${hba1cClass}`}>{patient.hba1c}%</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
    </button>
  );
}
