import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

/**
 * Conditions Form Component with Validation
 * 
 * VALIDATION RULES:
 * - DM (Diabetes Mellitus) must always be checked (required)
 * - Other conditions are optional
 * - At least DM must be selected (enforced by default value)
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
  const { watch, setValue, handleSubmit, formState: { isValid } } = useForm({
    defaultValues: data.healthIssues,
    mode: 'onChange',
  });

  // Sync form data with parent state
  const watchedData = watch();
  useEffect(() => {
    setData({ ...data, healthIssues: watchedData });
  }, [watchedData]);

  // Ensure DM is always checked
  useEffect(() => {
    if (!watchedData.dm) {
      setValue('dm', true);
    }
  }, [watchedData.dm, setValue]);

  const toggle = (key) => {
    if (key === 'dm') return; // DM cannot be unchecked
    setValue(key, !watchedData[key]);
  };

  const onSubmit = (formData) => {
    setData({ ...data, healthIssues: formData });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800 font-display">Health Issues & Conditions</h2>
        <p className="text-slate-500 text-sm">Select all applicable conditions</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="space-y-2">
            {CONDITIONS.map(({ key, label, desc, required, warning }) => {
              const isChecked = watch(key);
              return (
                <div
                  key={key}
                  onClick={() => toggle(key)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    isChecked
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${required ? 'cursor-not-allowed opacity-75' : ''}`}
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
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isChecked ? 'border-primary-500 bg-primary-500' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {required && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full font-medium">
                        Required
                      </span>
                    )}
                    {warning && isChecked && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full flex items-center gap-1 font-medium">
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
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 text-sm font-medium transition-colors"
            >
              Next: Lab Values <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
