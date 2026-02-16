import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * Placeholder for Demographics, Conditions, Labs, Glucose, Medications.
 * Shows section title and short description; real forms can replace this later.
 */
export default function PatientDetailPlaceholder({ title, description, onNext, nextLabel }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800 font-display">{title}</h2>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
        <p className="text-slate-500 mb-6">
          Form components for this section can be added here. Data is in <code className="bg-slate-100 px-1 rounded">patientData</code>.
        </p>
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 text-sm font-medium mx-auto"
          >
            {nextLabel || 'Next'} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
