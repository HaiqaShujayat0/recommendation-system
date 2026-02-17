import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Activity, ChevronRight } from 'lucide-react';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';

/**
 * Labs Form Component with Validation
 *
 * VALIDATION RULES:
 * - HbA1c: Required, 0-20%
 * - eGFR: Required, 0-200 mL/min
 * - Creatinine: Optional, 0-10 mg/dL
 * - LDL: Optional, 0-500 mg/dL
 * - Urine Albumin: Optional, 0-1000 mg/L
 */

const LABS = [
  { key: 'hba1c', label: 'HbA1c', unit: '%', normal: '< 5.7', critical: true },
  { key: 'egfr', label: 'eGFR', unit: 'mL/min', normal: '> 90', critical: true },
  { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL', normal: '0.7-1.3', critical: false },
  { key: 'lipidPanel', label: 'LDL', unit: 'mg/dL', normal: '< 100', critical: false },
  { key: 'urineAlbumin', label: 'Urine Albumin', unit: 'mg/L', normal: '< 30', critical: false },
];

export default function LabsForm({ data, setData, onNext }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: data.labs,
    mode: 'onChange',
  });

  // Sync form → parent via watch subscription (optimized)
  useEffect(() => {
    const subscription = watch((formValues) => {
      setData((prev) => ({ ...prev, labs: formValues }));
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  const getStatusStyle = useCallback((key, value) => {
    if (!value) {
      switch (key) {
        case 'hba1c':
          return 'border-amber-200 bg-amber-50/40';
        case 'egfr':
          return 'border-secondary-200 bg-secondary-50/40';
        case 'creatinine':
          return 'border-sky-200 bg-sky-50/40';
        case 'lipidPanel':
          return 'border-purple-200 bg-purple-50/40';
        case 'urineAlbumin':
          return 'border-violet-200 bg-violet-50/40';
        default:
          return 'border-slate-200 bg-slate-50';
      }
    }

    const v = parseFloat(value);

    if (key === 'hba1c') {
      if (v < 5.7) return 'border-green-400 bg-green-50/50';
      if (v < 7) return 'border-amber-400 bg-amber-50/50';
      return 'border-red-400 bg-red-50/50';
    }

    if (key === 'egfr') {
      if (v >= 90) return 'border-green-400 bg-green-50/50';
      if (v >= 60) return 'border-amber-400 bg-amber-50/50';
      return 'border-red-400 bg-red-50/50';
    }

    return 'border-slate-200 bg-slate-50';
  }, []);

  const getCkdStage = useCallback((egfr) => {
    if (!egfr) return null;
    const v = parseFloat(egfr);
    if (v >= 90) return { stage: '1', label: 'Normal', color: 'bg-green-600 text-white' };
    if (v >= 60) return { stage: '2', label: 'Mild', color: 'bg-amber-500 text-white' };
    if (v >= 30) return { stage: '3', label: 'Moderate', color: 'bg-orange-500 text-white' };
    if (v >= 15) return { stage: '4', label: 'Severe', color: 'bg-red-500 text-white' };
    return { stage: '5', label: 'Failure', color: 'bg-red-700 text-white' };
  }, []);

  const onSubmit = (formData) => {
    setData((prev) => ({ ...prev, labs: formData }));
    onNext();
  };

  const egfr = watch('egfr');
  const ckd = getCkdStage(egfr);

  return (
    <div className="max-w-3xl mx-auto">
      <FormCard
        title="Laboratory Values"
        subtitle="Key labs driving glycemic control and renal safety checks."
        accentColor="secondary"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {LABS.map(({ key, label, unit, normal, critical }) => {
              const value = watch(key);
              const error = errors[key];
              const isRequired = critical;

              return (
                <div key={key}>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                    {label}
                    {critical && (
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] rounded-full font-semibold border border-primary-200">
                        PRIMARY
                      </span>
                    )}
                  </label>
                  <div
                    className={`flex items-center border-2 rounded-xl transition-all duration-300 ${getStatusStyle(
                      key,
                      value
                    )}`}
                  >
                    <input
                      type="number"
                      step="0.1"
                      {...register(key, {
                        required: isRequired ? `${label} is required` : false,
                        min: {
                          value: 0,
                          message: `${label} must be positive`,
                        },
                        max: {
                          value:
                            key === 'hba1c'
                              ? 20
                              : key === 'egfr'
                                ? 200
                                : key === 'creatinine'
                                  ? 10
                                  : key === 'lipidPanel'
                                    ? 500
                                    : 1000,
                          message: `Please enter a valid ${label} value`,
                        },
                        valueAsNumber: true,
                      })}
                      className="flex-1 px-3.5 py-2.5 bg-transparent focus:outline-none text-sm font-medium"
                      placeholder="--"
                    />
                    <span className="px-3 text-slate-400 text-xs font-semibold">
                      {unit}
                    </span>
                  </div>
                  {error && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 animate-fade-in font-medium">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error.message}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    Normal: {normal}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CKD Stage Display */}
          {ckd && (
            <div className="mt-5 p-3.5 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-200 animate-fade-in">
              <div className="w-9 h-9 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-secondary-700" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">CKD Stage</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${ckd.color} shadow-sm`}
                >
                  Stage {ckd.stage}: {ckd.label}
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={!isValid}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Next: Blood Sugar
            </Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
