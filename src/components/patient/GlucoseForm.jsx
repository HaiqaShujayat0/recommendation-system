import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AlertTriangle, ChevronRight } from 'lucide-react';

/**
 * Glucose Form Component with Validation
 * 
 * VALIDATION RULES:
 * - All fields optional (patient may not have all readings)
 * - If entered, must be valid number: 0-600 mg/dL (reasonable range)
 * - Auto-calculates average from non-empty readings
 */

const TIME_SLOTS = [
  { key: 'beforeBreakfast', label: 'Before Breakfast', target: '80-130' },
  { key: 'beforeLunch', label: 'Before Lunch', target: '80-130' },
  { key: 'beforeDinner', label: 'Before Dinner', target: '80-130' },
  { key: 'beforeBed', label: 'Before Bed', target: '100-140' },
];

export default function GlucoseForm({ data, setData, onNext }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: data.bloodSugar,
    mode: 'onChange',
  });

  const watchedData = watch();

  // Auto-calculate average
  useEffect(() => {
    const readings = [
      watchedData.beforeBreakfast,
      watchedData.beforeLunch,
      watchedData.beforeDinner,
      watchedData.beforeBed,
    ]
      .filter((v) => v && !isNaN(parseFloat(v)))
      .map((v) => parseFloat(v));

    const average = readings.length
      ? Math.round(readings.reduce((a, b) => a + b, 0) / readings.length)
      : 0;

    setValue('average', average, { shouldValidate: false });
  }, [
    watchedData.beforeBreakfast,
    watchedData.beforeLunch,
    watchedData.beforeDinner,
    watchedData.beforeBed,
    setValue,
  ]);

  // Sync form data with parent state
  useEffect(() => {
    setData({ ...data, bloodSugar: watchedData });
  }, [watchedData]);

  const getColor = (value) => {
    if (!value) return 'border-slate-200';
    const v = parseFloat(value);

    if (v < 70) return 'border-red-500 bg-red-50';
    if (v <= 140) return 'border-green-500 bg-green-50';
    if (v <= 180) return 'border-amber-500 bg-amber-50';
    return 'border-red-500 bg-red-50';
  };

  const hasHypo = Object.values(watchedData).some((v) => v && parseFloat(v) < 70);

  const getAverageColor = (average) => {
    if (!average) return 'bg-slate-100';
    if (average <= 154) return 'bg-green-100';
    return 'bg-amber-100';
  };

  const onSubmit = (formData) => {
    setData({ ...data, bloodSugar: formData });
    onNext();
  };

  const average = watch('average');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800 font-display">Daily Blood Sugar</h2>
        <p className="text-slate-500 text-sm">Enter glucose readings in mg/dL</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="space-y-3">
            {TIME_SLOTS.map(({ key, label, target }) => {
              const value = watch(key);
              const error = errors[key];

              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-slate-700 font-medium">{label}</div>
                  <div className={`flex-1 flex items-center border-2 rounded-lg transition-colors ${getColor(value)}`}>
                    <input
                      type="number"
                      {...register(key, {
                        min: {
                          value: 0,
                          message: 'Value must be positive',
                        },
                        max: {
                          value: 600,
                          message: 'Value must be less than 600 mg/dL',
                        },
                        valueAsNumber: true,
                      })}
                      className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-center font-mono text-sm"
                      placeholder="--"
                    />
                    <span className="px-3 text-slate-400 text-xs">mg/dL</span>
                  </div>
                  <div className="w-20 text-xs text-slate-400">{target}</div>
                  {error && (
                    <p className="text-xs text-red-600 absolute mt-8 ml-32">{error.message}</p>
                  )}
                </div>
              );
            })}

            {/* Average Display */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
              <div className="w-32 text-sm font-bold text-slate-700">Average</div>
              <div className={`flex-1 flex items-center justify-center py-2 rounded-lg ${getAverageColor(average)}`}>
                <span className="text-xl font-bold font-mono text-slate-800">{average || '--'}</span>
                <span className="ml-2 text-slate-500 text-sm">mg/dL</span>
              </div>
              <div className="w-20 text-xs text-slate-400">&lt;154</div>
            </div>
          </div>

          {/* Hypoglycemia Warning */}
          {hasHypo && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse flex-shrink-0" />
              <div>
                <p className="font-medium text-red-700 text-sm">Hypoglycemia Detected</p>
                <p className="text-xs text-red-600">Reading below 70 mg/dL</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 text-sm font-medium transition-colors"
            >
              Next: Medications <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
