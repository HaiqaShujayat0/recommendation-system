import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';

/**
 * Conditions Form Component with Validation
 *
 * VALIDATION RULES:
 * - DM (Diabetes Mellitus) must always be checked (required)
 * - Other conditions are optional
 */

const CONDITIONS = [
  {
    key: 'dm',
    label: 'Diabetes Mellitus',
    desc: 'Primary condition - always checked',
    required: true,
  },
  {
    key: 'ckd',
    label: 'Chronic Kidney Disease',
    desc: 'Affects Metformin dosing',
  },
  {
    key: 'cad',
    label: 'Coronary Artery Disease',
    desc: 'Favors SGLT2i/GLP-1 RA',
  },
  {
    key: 'hypertension',
    label: 'Hypertension',
    desc: 'CV risk factor',
  },
  {
    key: 'pregnancy',
    label: 'Pregnancy',
    desc: 'BLOCKS oral medications',
    warning: true,
  },
  {
    key: 'neuropathy',
    label: 'Neuropathy',
    desc: 'DM complication',
  },
  {
    key: 'retinopathy',
    label: 'Retinopathy',
    desc: 'DM complication',
  },
  {
    key: 'obesity',
    label: 'Obesity',
    desc: 'BMI > 30 or clinical diagnosis',
  },
];

export default function ConditionsForm({ data, setData, onNext }) {
  const {
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: data.healthIssues,
    mode: 'onChange',
  });

  // Sync form → parent via watch subscription (optimized)
  useEffect(() => {
    const subscription = watch((formValues) => {
      setData((prev) => ({ ...prev, healthIssues: formValues }));
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  // Ensure DM is always checked
  const dmValue = watch('dm');
  useEffect(() => {
    if (!dmValue) {
      setValue('dm', true);
    }
  }, [dmValue, setValue]);

  const toggle = useCallback((key) => {
    if (key === 'dm') return;
    setValue(key, !watch(key));
  }, [setValue, watch]);

  const onSubmit = (formData) => {
    setData((prev) => ({ ...prev, healthIssues: formData }));
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <FormCard
        title="Health Issues &amp; Conditions"
        subtitle="Capture comorbidities that influence medication choice and dosing."
        accentColor="secondary"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2.5 stagger-children">
            {CONDITIONS.map(({ key, label, desc, required, warning }) => {
              const isChecked = watch(key);
              return (
                <div
                  key={key}
                  onClick={() => toggle(key)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 group ${isChecked
                    ? 'border-primary-400 bg-primary-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-primary-200 hover:bg-primary-50/20'
                    } ${required ? 'cursor-not-allowed' : ''}`}
                  role="button"
                  tabIndex={required ? -1 : 0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !required) {
                      e.preventDefault();
                      toggle(key);
                    }
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isChecked
                      ? 'border-primary-500 bg-primary-600 shadow-sm'
                      : 'border-slate-300 bg-white group-hover:border-primary-300'
                      }`}
                  >
                    {isChecked && (
                      <CheckCircle className="w-3 h-3 text-white animate-check-bounce" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {required && (
                      <span className="px-2.5 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full font-semibold border border-red-200">
                        Required
                      </span>
                    )}
                    {warning && isChecked && (
                      <span className="px-2.5 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full flex items-center gap-1 font-semibold border border-red-200">
                        <AlertTriangle className="w-3 h-3" />
                        Blocks Oral
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Next: Lab Values
            </Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
