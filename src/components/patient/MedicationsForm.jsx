import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Brain, ChevronRight } from 'lucide-react';

/**
 * Medications Form Component with Validation
 * 
 * VALIDATION RULES:
 * - All medications optional (patient may not be on all meds)
 * - If entered, must be within specified ranges:
 *   - Metformin: 0-2000mg (slider)
 *   - Glimepiride: 0-4mg (select)
 *   - Tradjenta: toggle (on/off)
 *   - Farxiga: 0, 5, or 10mg (select)
 *   - Semaglutide: 0-2mg (slider)
 *   - Insulins: 0-100 units (number)
 *   - Repaglinide: 0, 0.5, 1, 1.5, or 2mg (select)
 */

const MEDICATIONS = [
  {
    key: 'metformin',
    label: 'Metformin',
    class: 'Biguanide',
    range: '500-2000mg',
    type: 'slider',
    min: 0,
    max: 2000,
    step: 250,
  },
  {
    key: 'glimepiride',
    label: 'Glimepiride',
    class: 'Sulfonylurea',
    range: '1-4mg',
    type: 'select',
    options: [0, 1, 2, 3, 4],
  },
  {
    key: 'tradjenta',
    label: 'Tradjenta',
    class: 'DPP-4i',
    range: '5mg',
    type: 'toggle',
  },
  {
    key: 'farxiga',
    label: 'Farxiga',
    class: 'SGLT2i',
    range: '5-10mg',
    type: 'select',
    options: [0, 5, 10],
  },
  {
    key: 'semaglutide',
    label: 'Semaglutide (Ozempic)',
    class: 'GLP-1 RA',
    range: '0.25-2mg',
    type: 'slider',
    min: 0,
    max: 2,
    step: 0.25,
  },
  {
    key: 'glargine',
    label: 'Glargine (Before Dinner)',
    class: 'Basal Insulin',
    range: '4-100 units',
    type: 'number',
    min: 0,
    max: 100,
  },
  {
    key: 'lispro_breakfast',
    label: 'Lispro (Before Breakfast)',
    class: 'Bolus Insulin',
    range: '4-100 units',
    type: 'number',
    min: 0,
    max: 100,
  },
  {
    key: 'lispro_lunch',
    label: 'Lispro (Before Lunch)',
    class: 'Bolus Insulin',
    range: '4-100 units',
    type: 'number',
    min: 0,
    max: 100,
  },
  {
    key: 'lispro_dinner',
    label: 'Lispro (Before Dinner)',
    class: 'Bolus Insulin',
    range: '4-100 units',
    type: 'number',
    min: 0,
    max: 100,
  },
  {
    key: 'repaglinide_breakfast',
    label: 'Repaglinide (Before Breakfast)',
    class: 'Meglitinide',
    range: '0.5-2mg',
    type: 'select',
    options: [0, 0.5, 1, 1.5, 2],
  },
  {
    key: 'repaglinide_lunch',
    label: 'Repaglinide (Before Lunch)',
    class: 'Meglitinide',
    range: '0.5-2mg',
    type: 'select',
    options: [0, 0.5, 1, 1.5, 2],
  },
  {
    key: 'repaglinide_dinner',
    label: 'Repaglinide (Before Dinner)',
    class: 'Meglitinide',
    range: '0.5-2mg',
    type: 'select',
    options: [0, 0.5, 1, 1.5, 2],
  },
];

export default function MedicationsForm({ data, setData, onNext }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: data.medications,
    mode: 'onChange',
  });

  // Sync form data with parent state
  const watchedData = watch();
  useEffect(() => {
    setData({ ...data, medications: watchedData });
  }, [watchedData]);

  const update = (key, value) => {
    setValue(key, value);
  };

  const renderMedicationInput = (med) => {
    const { key, label, range, type, options, min, max, step } = med;
    const value = watch(key);
    const error = errors[key];

    switch (type) {
      case 'toggle':
        return (
          <div>
            <button
              type="button"
              onClick={() => update(key, !value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition flex-shrink-0 ${
                value ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {value ? 'ON' : 'OFF'}
            </button>
            <input type="hidden" {...register(key)} value={value} />
          </div>
        );

      case 'select':
        return (
          <div>
            <select
              {...register(key, {
                min: { value: 0, message: 'Invalid value' },
                valueAsNumber: true,
              })}
              className="px-2 py-1 border border-slate-200 rounded text-sm flex-shrink-0 focus:border-primary-500 focus:outline-none"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 0 ? 'None' : `${opt}${key.includes('repaglinide') ? 'mg' : 'mg'}`}
                </option>
              ))}
            </select>
            {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
          </div>
        );

      case 'slider':
        return (
          <div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                {...register(key, {
                  min: { value: min, message: `Minimum: ${min}mg` },
                  max: { value: max, message: `Maximum: ${max}mg` },
                  valueAsNumber: true,
                })}
                className="w-20"
              />
              <span className="w-14 text-right text-xs font-mono text-slate-700">{value}mg</span>
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
          </div>
        );

      case 'number':
        return (
          <div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <input
                type="number"
                min={min}
                max={max}
                {...register(key, {
                  min: { value: min, message: `Minimum: ${min} units` },
                  max: { value: max, message: `Maximum: ${max} units` },
                  valueAsNumber: true,
                })}
                className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-right focus:border-primary-500 focus:outline-none"
                placeholder="0"
              />
              <span className="text-xs text-slate-500">u</span>
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmit = (formData) => {
    setData({ ...data, medications: formData });
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800 font-display">Current Medications</h2>
        <p className="text-slate-500 text-sm">Enter current diabetes medications</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MEDICATIONS.map((med) => (
              <div
                key={med.key}
                className="p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 text-sm truncate">{med.label}</p>
                    <p className="text-xs text-slate-500">{med.range}</p>
                  </div>
                  {renderMedicationInput(med)}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
            >
              <Brain className="w-4 h-4" />
              Get AI Recommendations
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
