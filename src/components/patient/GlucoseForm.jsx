import React, { useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AlertTriangle, ChevronRight, Droplets } from 'lucide-react';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';

/**
 * Glucose Form Component with Validation
 *
 * VALIDATION RULES:
 * - All fields optional
 * - If entered, must be valid number: 0-600 mg/dL
 * - Auto-calculates average from non-empty readings
 */

const TIME_SLOTS = [
  { key: 'beforeBreakfast', label: 'Before Breakfast', target: '80-130' },
  { key: 'beforeLunch', label: 'Before Lunch', target: '80-130' },
  { key: 'beforeDinner', label: 'Before Dinner', target: '80-130' },
  { key: 'beforeBed', label: 'Before Bed', target: '100-140' },
];

const SLOT_KEYS = TIME_SLOTS.map((s) => s.key);

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

  const beforeBreakfast = watch('beforeBreakfast');
  const beforeLunch = watch('beforeLunch');
  const beforeDinner = watch('beforeDinner');
  const beforeBed = watch('beforeBed');

  // Auto-calculate average from individual watched fields
  useEffect(() => {
    const readings = [beforeBreakfast, beforeLunch, beforeDinner, beforeBed]
      .filter((v) => v && !isNaN(parseFloat(v)))
      .map((v) => parseFloat(v));

    const average = readings.length
      ? Math.round(readings.reduce((a, b) => a + b, 0) / readings.length)
      : 0;

    setValue('average', average, { shouldValidate: false });
  }, [beforeBreakfast, beforeLunch, beforeDinner, beforeBed, setValue]);

  // Sync form → parent via watch subscription (optimized)
  useEffect(() => {
    const subscription = watch((formValues) => {
      setData((prev) => ({ ...prev, bloodSugar: formValues }));
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  const getColor = useCallback((value) => {
    if (!value) return 'border-slate-200 bg-white';
    const v = parseFloat(value);
    if (v < 70) return 'border-red-400 bg-red-50/50';
    if (v <= 140) return 'border-green-400 bg-green-50/50';
    if (v <= 180) return 'border-amber-400 bg-amber-50/50';
    return 'border-red-400 bg-red-50/50';
  }, []);

  const hasHypo = useMemo(() => {
    return [beforeBreakfast, beforeLunch, beforeDinner, beforeBed].some(
      (v) => v && parseFloat(v) < 70
    );
  }, [beforeBreakfast, beforeLunch, beforeDinner, beforeBed]);

  const getAverageColor = useCallback((average) => {
    if (!average) return 'bg-slate-50';
    if (average <= 154) return 'bg-green-50';
    return 'bg-amber-50';
  }, []);

  const onSubmit = (formData) => {
    setData((prev) => ({ ...prev, bloodSugar: formData }));
    onNext();
  };

  const average = watch('average');

  return (
    <div className="max-w-3xl mx-auto">
      <FormCard
        title="Daily Blood Sugar"
        subtitle="Optional home glucose readings to contextualize lab values."
        accentColor="primary"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Card header */}
          <div className="px-4 py-3.5 -mx-5 -mt-5 md:-mx-6 md:-mt-6 mb-5 bg-primary-50 border-b border-primary-100 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary-600" />
              <h3 className="text-base md:text-lg font-bold text-primary-900">
                Blood Glucose Monitoring
              </h3>
            </div>
            <p className="text-xs md:text-sm text-primary-600/70 ml-7">
              Monitor blood glucose levels and trends across the day.
            </p>
          </div>

          <div className="space-y-3.5 stagger-children">
            {TIME_SLOTS.map(({ key, label, target }) => {
              const value = watch(key);
              const error = errors[key];

              return (
                <div
                  key={key}
                  className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3"
                >
                  <div className="w-full md:w-40 text-sm text-slate-700 font-semibold">
                    {label}
                  </div>
                  <div
                    className={`flex-1 flex items-center border-2 rounded-xl transition-all duration-300 ${getColor(
                      value
                    )}`}
                  >
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
                      className="flex-1 px-3.5 py-2.5 bg-transparent focus:outline-none text-center font-mono text-sm font-medium"
                      placeholder="--"
                    />
                    <span className="px-3 text-slate-400 text-xs font-semibold">
                      mg/dL
                    </span>
                  </div>
                  <div className="w-full md:w-28 text-xs text-slate-400 md:text-right font-medium">
                    Target {target}
                  </div>
                  {error && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600 animate-fade-in font-medium">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error.message}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Status legend */}
            <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 flex flex-wrap gap-4 text-xs border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-semibold text-slate-700">Hypoglycemia</span>
                <span className="text-slate-500">&lt; 70 mg/dL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-semibold text-slate-700">Normal</span>
                <span className="text-slate-500">70-140 mg/dL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-700">Hyperglycemia</span>
                <span className="text-slate-500">&gt; 180 mg/dL</span>
              </div>
            </div>

            {/* Average Display */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
              <div className="w-32 text-sm font-bold text-slate-700">Average</div>
              <div
                className={`flex-1 flex items-center justify-center py-2.5 rounded-xl ${getAverageColor(
                  average
                )} border border-slate-200 transition-all duration-300`}
              >
                <span className="text-xl font-bold font-mono text-slate-800">
                  {average || '--'}
                </span>
                <span className="ml-2 text-slate-500 text-sm">mg/dL</span>
              </div>
              <div className="w-20 text-xs text-slate-400 font-medium">&lt;154</div>
            </div>
          </div>

          {/* Hypoglycemia Warning */}
          {hasHypo && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-red-700 text-sm">
                  Hypoglycemia Detected
                </p>
                <p className="text-xs text-red-600">Reading below 70 mg/dL</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Next: Medications
            </Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
