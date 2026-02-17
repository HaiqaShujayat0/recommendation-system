import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Brain, ChevronRight, Pill } from 'lucide-react';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';

/**
 * Medications Form Component with Validation
 *
 * VALIDATION RULES:
 * - All medications optional
 * - If entered, must be within specified ranges
 */

const MEDICATIONS = [
  { key: 'metformin', label: 'Metformin', class: 'Biguanide', range: '500-2000mg', type: 'slider', min: 0, max: 2000, step: 250 },
  { key: 'glimepiride', label: 'Glimepiride', class: 'Sulfonylurea', range: '1-4mg', type: 'select', options: [0, 1, 2, 3, 4] },
  { key: 'tradjenta', label: 'Tradjenta', class: 'DPP-4i', range: '5mg', type: 'toggle' },
  { key: 'farxiga', label: 'Farxiga', class: 'SGLT2i', range: '5-10mg', type: 'select', options: [0, 5, 10] },
  { key: 'semaglutide', label: 'Semaglutide (Ozempic)', class: 'GLP-1 RA', range: '0.25-2mg', type: 'slider', min: 0, max: 2, step: 0.25 },
  { key: 'glargine', label: 'Glargine (Before Dinner)', class: 'Basal Insulin', range: '4-100 units', type: 'number', min: 0, max: 100 },
  { key: 'lispro_breakfast', label: 'Lispro (Before Breakfast)', class: 'Bolus Insulin', range: '4-100 units', type: 'number', min: 0, max: 100 },
  { key: 'lispro_lunch', label: 'Lispro (Before Lunch)', class: 'Bolus Insulin', range: '4-100 units', type: 'number', min: 0, max: 100 },
  { key: 'lispro_dinner', label: 'Lispro (Before Dinner)', class: 'Bolus Insulin', range: '4-100 units', type: 'number', min: 0, max: 100 },
  { key: 'repaglinide_breakfast', label: 'Repaglinide (Before Breakfast)', class: 'Meglitinide', range: '0.5-2mg', type: 'select', options: [0, 0.5, 1, 1.5, 2] },
  { key: 'repaglinide_lunch', label: 'Repaglinide (Before Lunch)', class: 'Meglitinide', range: '0.5-2mg', type: 'select', options: [0, 0.5, 1, 1.5, 2] },
  { key: 'repaglinide_dinner', label: 'Repaglinide (Before Dinner)', class: 'Meglitinide', range: '0.5-2mg', type: 'select', options: [0, 0.5, 1, 1.5, 2] },
];

export default function MedicationsForm({ data, setData, onNext }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: data.medications,
    mode: 'onChange',
  });

  // Sync form → parent via watch subscription (optimized)
  useEffect(() => {
    const subscription = watch((formValues) => {
      setData((prev) => ({ ...prev, medications: formValues }));
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  const update = useCallback((key, value) => {
    setValue(key, value);
  }, [setValue]);

  const clearAll = useCallback(() => {
    MEDICATIONS.forEach(({ key }) => setValue(key, 0));
  }, [setValue]);

  const renderMedicationInput = (med) => {
    const { key, type, options, min, max, step } = med;
    const value = watch(key);
    const error = errors[key];

    switch (type) {
      case 'toggle':
        return (
          <div>
            <button
              type="button"
              onClick={() => update(key, !value)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${value
                ? 'bg-primary-600 shadow-md shadow-primary-500/20'
                : 'bg-slate-200'
                }`}
              aria-label={`${med.label} ${value ? 'on' : 'off'}`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${value ? 'left-[30px]' : 'left-0.5'
                  }`}
              />
            </button>
            <input type="hidden" {...register(key)} value={value ? 1 : 0} />
          </div>
        );

      case 'select':
        return (
          <div>
            <select
              {...register(key, {
                valueAsNumber: true,
              })}
              className="px-3 py-2 border-2 border-slate-200 rounded-xl text-sm flex-shrink-0 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15 bg-white transition-all duration-200 hover:border-slate-300 font-medium"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 0 ? 'None' : `${opt}mg`}
                </option>
              ))}
            </select>
            {error && (
              <p className="text-xs text-red-600 mt-1 font-medium">{error.message}</p>
            )}
          </div>
        );

      case 'slider':
        return (
          <div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                {...register(key, {
                  valueAsNumber: true,
                })}
                className="w-24"
              />
              <span className="w-16 text-right text-xs font-bold font-mono text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                {value || 0}{key === 'semaglutide' ? 'mg' : 'mg'}
              </span>
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-1 font-medium">{error.message}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <input
                type="number"
                min={min}
                max={max}
                {...register(key, {
                  min: { value: min, message: `Minimum: ${min} units` },
                  max: { value: max, message: `Maximum: ${max} units` },
                  valueAsNumber: true,
                })}
                className="w-18 px-2.5 py-1.5 border-2 border-slate-200 rounded-xl text-sm text-right focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15 bg-white transition-all duration-200 font-medium"
                placeholder="0"
              />
              <span className="text-xs text-slate-500 font-semibold">u</span>
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-1 font-medium">{error.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmit = (formData) => {
    setData((prev) => ({ ...prev, medications: formData }));
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormCard
        title="Current Medications"
        subtitle="Document all current diabetes agents and insulin doses."
        accentColor="primary"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Card header */}
          <div className="px-4 py-3.5 -mx-5 -mt-5 md:-mx-6 md:-mt-6 mb-5 bg-primary-50 border-b border-primary-100 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary-600" />
              <h3 className="text-base md:text-lg font-bold text-primary-900">
                Medication Regimen
              </h3>
            </div>
            <p className="text-xs md:text-sm text-primary-600/70 ml-7">
              Adjust doses and combinations based on current regimen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
            {MEDICATIONS.map((med) => (
              <div
                key={med.key}
                className="p-3.5 border-2 border-slate-200 rounded-xl bg-white hover:border-primary-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-primary-700 transition-colors">
                      {med.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="text-primary-600/70 font-medium">{med.class}</span>{' '}
                      • {med.range}
                    </p>
                  </div>
                  {renderMedicationInput(med)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-slate-500">
              Tip: Leave a field at{' '}
              <span className="font-bold text-slate-600">0</span> or{' '}
              <span className="font-bold text-slate-600">None</span> if the
              patient is not on that medication.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                Clear All
              </Button>
              <Button
                type="submit"
                icon={<Brain className="w-4 h-4" />}
              >
                Get AI Recommendations
              </Button>
            </div>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
