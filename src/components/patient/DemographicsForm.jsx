import React, { useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Scale, ChevronRight } from 'lucide-react';
import Input from '../ui/Input';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';

/**
 * Demographics Form Component with Validation
 *
 * VALIDATION RULES:
 * - MR Number: Required, format MR-YYYY-XXX
 * - First Name: Required, min 2 characters
 * - Last Name: Required, min 2 characters
 * - Date of Birth: Required, not in future, reasonable age (0-150)
 * - Gender: Required (Male/Female)
 * - Weight: Required, 20-300 kg
 * - Height: Required, 100-250 cm
 *
 * Auto-calculates: Age (from DOB), BMI (from weight/height)
 */

// Today's date string for HTML max attribute on date inputs
const TODAY_ISO = new Date().toISOString().split('T')[0];

export default function DemographicsForm({ data, setData, onNext }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: data.demographics,
    mode: 'onChange',
  });

  const weight = watch('weight');
  const height = watch('height');
  const dob = watch('dob');

  // Auto-calculate age from DOB
  useEffect(() => {
    if (dob) {
      const birth = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      setValue('age', age >= 0 ? age : 0, { shouldValidate: false });
    }
  }, [dob, setValue]);

  // Auto-calculate BMI from weight and height
  useEffect(() => {
    if (weight && height) {
      const heightInMeters = parseFloat(height) / 100;
      if (heightInMeters > 0) {
        const w = parseFloat(weight);
        const bmi = Math.round((w / (heightInMeters * heightInMeters)) * 10) / 10;
        setValue('bmi', bmi, { shouldValidate: false });
      }
    }
  }, [weight, height, setValue]);

  // Sync form → parent via watch subscription (optimized — avoids stale closure)
  useEffect(() => {
    const subscription = watch((formValues) => {
      setData((prev) => ({ ...prev, demographics: formValues }));
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  const getBmiStyle = useCallback((bmi) => {
    if (!bmi) return 'bg-slate-100 text-slate-500 border-slate-200';
    if (bmi < 18.5) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (bmi < 25) return 'bg-green-50 text-green-700 border-green-200';
    if (bmi < 30) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  }, []);

  const getBmiLabel = useCallback((bmi) => {
    if (!bmi) return '';
    if (bmi >= 30) return ' (Obese)';
    if (bmi >= 25) return ' (Overweight)';
    if (bmi >= 18.5) return ' (Normal)';
    return ' (Underweight)';
  }, []);

  const onSubmit = (formData) => {
    setData((prev) => ({ ...prev, demographics: formData }));
    onNext();
  };

  const currentBmi = watch('bmi');
  const currentAge = watch('age');

  return (
    <div className="max-w-3xl mx-auto">
      <FormCard
        title="Patient Demographics"
        subtitle="Core identifiers and anthropometrics used across the care journey."
        accentColor="primary"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
            <Input
              label="MR Number"
              {...register('mrNumber', {
                required: 'MR Number is required',
                pattern: {
                  value: /^MR-\d{4}-[A-Z0-9]{3}$/i,
                  message: 'Format: MR-YYYY-XXX (e.g., MR-2024-001)',
                },
              })}
              placeholder="MR-2024-XXX"
              error={errors.mrNumber?.message}
              required
            />

            <Input
              label="First Name"
              {...register('firstName', {
                required: 'First Name is required',
                minLength: {
                  value: 2,
                  message: 'First Name must be at least 2 characters',
                },
              })}
              error={errors.firstName?.message}
              required
            />

            <Input
              label="Last Name"
              {...register('lastName', {
                required: 'Last Name is required',
                minLength: {
                  value: 2,
                  message: 'Last Name must be at least 2 characters',
                },
              })}
              error={errors.lastName?.message}
              required
            />

            <Input
              label="Date of Birth"
              type="date"
              max={TODAY_ISO}
              {...register('dob', {
                required: 'Date of Birth is required',
                validate: (value) => {
                  if (!value) return 'Date of Birth is required';
                  const birth = new Date(value);
                  const today = new Date();
                  if (isNaN(birth.getTime())) {
                    return 'Please enter a valid date';
                  }
                  if (birth > today) {
                    return 'Date of Birth cannot be in the future';
                  }
                  const age = today.getFullYear() - birth.getFullYear();
                  if (age > 150) {
                    return 'Please enter a valid date of birth';
                  }
                  return true;
                },
              })}
              error={errors.dob?.message}
              required
            />

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Gender <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3">
                {['Male', 'Female'].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-xl border-2 border-slate-200 hover:border-primary-300 transition-all duration-200 bg-white has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50/50"
                  >
                    <input
                      type="radio"
                      value={g}
                      {...register('gender', { required: 'Gender is required' })}
                    />
                    <span className="text-sm font-medium text-slate-700">{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 animate-fade-in font-medium">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Age Display */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Age
              </label>
              <div className="px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-600 text-sm font-medium">
                {currentAge != null && currentAge >= 0 ? currentAge : '--'} years
              </div>
            </div>

            <Input
              label="Weight (kg)"
              type="number"
              {...register('weight', {
                required: 'Weight is required',
                min: {
                  value: 20,
                  message: 'Weight must be at least 20 kg',
                },
                max: {
                  value: 300,
                  message: 'Weight must be less than 300 kg',
                },
                valueAsNumber: true,
              })}
              placeholder="75"
              error={errors.weight?.message}
              required
            />

            <Input
              label="Height (cm)"
              type="number"
              {...register('height', {
                required: 'Height is required',
                min: {
                  value: 100,
                  message: 'Height must be at least 100 cm',
                },
                max: {
                  value: 250,
                  message: 'Height must be less than 250 cm',
                },
                valueAsNumber: true,
              })}
              placeholder="175"
              error={errors.height?.message}
              required
            />

            {/* BMI Display */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                BMI (Calculated)
              </label>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getBmiStyle(
                  currentBmi
                )} transition-all duration-300`}
              >
                <Scale className="w-4 h-4" />
                {currentBmi || '--'} kg/m²
                {getBmiLabel(currentBmi)}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={!isValid}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Next: Health Issues
            </Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
