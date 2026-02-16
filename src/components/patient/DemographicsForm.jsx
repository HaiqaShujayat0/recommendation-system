import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Scale, ChevronRight } from 'lucide-react';
import Input from '../ui/Input';

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
export default function DemographicsForm({ data, setData, onNext }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: data.demographics,
    mode: 'onChange', // Validate on every change
  });

  // Watch weight and height for BMI calculation
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
      setValue('age', age, { shouldValidate: false });
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

  // Sync form data with parent state
  const watchedData = watch();
  useEffect(() => {
    setData({ ...data, demographics: watchedData });
  }, [watchedData]);

  /**
   * Get BMI styling based on value
   */
  const getBmiStyle = (bmi) => {
    if (!bmi) return 'bg-slate-100 text-slate-500';
    if (bmi < 18.5) return 'bg-amber-100 text-amber-700';
    if (bmi < 25) return 'bg-green-100 text-green-700';
    if (bmi < 30) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getBmiLabel = (bmi) => {
    if (!bmi) return '';
    if (bmi >= 30) return ' (Obese)';
    if (bmi >= 25) return ' (Overweight)';
    if (bmi >= 18.5) return ' (Normal)';
    return ' (Underweight)';
  };

  const onSubmit = (formData) => {
    setData({ ...data, demographics: formData });
    onNext();
  };

  const currentBmi = watch('bmi');
  const currentAge = watch('age');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800 font-display">Patient Demographics</h2>
        <p className="text-slate-500 text-sm">Basic information for the care plan</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="grid grid-cols-2 gap-4">
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
              {...register('dob', {
                required: 'Date of Birth is required',
                validate: (value) => {
                  const birth = new Date(value);
                  const today = new Date();
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {['Male', 'Female'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={g}
                      {...register('gender', { required: 'Gender is required' })}
                      className="w-4 h-4 text-primary-900 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-xs text-red-600 mt-1">{errors.gender.message}</p>
              )}
            </div>

            {/* Age Display (read-only, auto-calculated) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm">
                {currentAge || '--'} years
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

            {/* BMI Display (read-only, auto-calculated) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">BMI (Calculated)</label>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getBmiStyle(
                  currentBmi
                )}`}
              >
                <Scale className="w-4 h-4" />
                {currentBmi || '--'} kg/m²
                {getBmiLabel(currentBmi)}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!isValid}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Health Issues <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
