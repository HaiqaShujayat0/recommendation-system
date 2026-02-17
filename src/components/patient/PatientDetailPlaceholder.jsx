import React from 'react';
import { ChevronRight } from 'lucide-react';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';

/**
 * Placeholder for sections that don't have full form implementations yet.
 */
export default function PatientDetailPlaceholder({ title, description, onNext, nextLabel }) {
  return (
    <div className="max-w-2xl mx-auto">
      <FormCard title={title} subtitle={description} accentColor="secondary">
        <div className="py-8 text-center">
          <p className="text-slate-500 mb-6">
            Form components for this section can be added here. Data is in{' '}
            <code className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded-lg text-xs font-bold">
              patientData
            </code>.
          </p>
          {onNext && (
            <Button
              type="button"
              onClick={onNext}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              {nextLabel || 'Next'}
            </Button>
          )}
        </div>
      </FormCard>
    </div>
  );
}
