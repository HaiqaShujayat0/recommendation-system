import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';
import { useUpdatePatientMutation, usePatientQuery } from '../../hooks/usePatients';

/** Map an API patient object → conditions form fields */
function apiToForm(p) {
  if (!p) return {};
  return {
    dm: true,
    ckd: p.has_ckd ?? false,
    cad: p.has_ascvd ?? false,
    pregnancy: p.is_pregnant ?? false,
    planning_pregnancy: p.planning_pregnancy ?? false,
    heart_failure: p.has_heart_failure ?? false,
    acute_decompensated_hf: p.has_acute_decompensated_hf ?? false,
    albuminuria: p.has_albuminuria ?? false,
    liver_disease: p.has_liver_disease ?? false,
    severe_hepatic: p.has_severe_hepatic_impairment ?? false,
    pancreatitis_history: p.has_pancreatitis_history ?? false,
    mtc_history: p.has_mtc_history ?? false,
    men2: p.has_men2 ?? false,
    dka_history: p.has_dka_history ?? false,
    sglt2_dka: p.has_sglt2_associated_dka ?? false,
    severe_pad: p.has_severe_pad ?? false,
    prior_amputation: p.has_prior_amputation ?? false,
    active_foot_ulcer: p.has_active_foot_ulcer ?? false,
    high_fracture_risk: p.has_high_fracture_risk ?? false,
    is_frail: p.is_frail ?? false,
    hypoxic_state: p.has_hypoxic_state ?? false,
    dehydration: p.has_dehydration ?? false,
    loop_diuretic: p.on_high_dose_loop_diuretic ?? false,
    gastroparesis: p.has_gastroparesis ?? false,
    hypoglycemia_history: p.has_hypoglycemia_history ?? false,
    self_management_capable: p.self_management_capable ?? true,
    caregiver_support: p.has_caregiver_support ?? false,
  };
}

/** Map form → API payload */
function formToApi(f) {
  return {
    has_ckd: f.ckd ?? false,
    has_ascvd: f.cad ?? false,
    is_pregnant: f.pregnancy ?? false,
    planning_pregnancy: f.planning_pregnancy ?? false,
    has_heart_failure: f.heart_failure ?? false,
    has_acute_decompensated_hf: f.acute_decompensated_hf ?? false,
    has_albuminuria: f.albuminuria ?? false,
    has_liver_disease: f.liver_disease ?? false,
    has_severe_hepatic_impairment: f.severe_hepatic ?? false,
    has_pancreatitis_history: f.pancreatitis_history ?? false,
    has_mtc_history: f.mtc_history ?? false,
    has_men2: f.men2 ?? false,
    has_dka_history: f.dka_history ?? false,
    has_sglt2_associated_dka: f.sglt2_dka ?? false,
    has_severe_pad: f.severe_pad ?? false,
    has_prior_amputation: f.prior_amputation ?? false,
    has_active_foot_ulcer: f.active_foot_ulcer ?? false,
    has_high_fracture_risk: f.high_fracture_risk ?? false,
    is_frail: f.is_frail ?? false,
    has_hypoxic_state: f.hypoxic_state ?? false,
    has_dehydration: f.dehydration ?? false,
    on_high_dose_loop_diuretic: f.loop_diuretic ?? false,
    has_gastroparesis: f.gastroparesis ?? false,
    has_hypoglycemia_history: f.hypoglycemia_history ?? false,
    self_management_capable: f.self_management_capable ?? true,
    has_caregiver_support: f.caregiver_support ?? false,
  };
}

/* ── Condition Groups ── */
const CONDITION_GROUPS = [
  {
    title: 'Core',
    items: [
      { key: 'dm', label: 'Diabetes Mellitus', desc: 'Primary condition — always checked', required: true },
    ],
  },
  {
    title: 'Cardiovascular',
    items: [
      { key: 'cad', label: 'Coronary Artery Disease (ASCVD)', desc: 'Favors SGLT2i / GLP-1 RA' },
      { key: 'heart_failure', label: 'Heart Failure', desc: 'Affects SGLT2i / TZD choice' },
      { key: 'acute_decompensated_hf', label: 'Acute Decompensated HF', desc: 'Blocks SGLT2i initiation', warning: true },
    ],
  },
  {
    title: 'Renal & Hepatic',
    items: [
      { key: 'ckd', label: 'Chronic Kidney Disease', desc: 'Affects Metformin dosing' },
      { key: 'albuminuria', label: 'Albuminuria', desc: 'Favors SGLT2i / finerenone' },
      { key: 'liver_disease', label: 'Liver Disease', desc: 'Affects TZD / Metformin' },
      { key: 'severe_hepatic', label: 'Severe Hepatic Impairment', desc: 'Blocks several agents', warning: true },
    ],
  },
  {
    title: 'Endocrine History',
    items: [
      { key: 'pancreatitis_history', label: 'History of Pancreatitis', desc: 'Blocks DPP-4i / GLP-1 RA', warning: true },
      { key: 'mtc_history', label: 'Medullary Thyroid Cancer', desc: 'Blocks GLP-1 RA', warning: true },
      { key: 'men2', label: 'MEN 2 Syndrome', desc: 'Blocks GLP-1 RA', warning: true },
      { key: 'dka_history', label: 'DKA History', desc: 'Caution with SGLT2i' },
      { key: 'sglt2_dka', label: 'SGLT2i-associated DKA', desc: 'Blocks SGLT2i', warning: true },
    ],
  },
  {
    title: 'Reproductive',
    items: [
      { key: 'pregnancy', label: 'Currently Pregnant', desc: 'Blocks oral medications', warning: true },
      { key: 'planning_pregnancy', label: 'Planning Pregnancy', desc: 'Limits medication options' },
    ],
  },
  {
    title: 'Vascular & Orthopedic',
    items: [
      { key: 'severe_pad', label: 'Severe PAD', desc: 'Caution with certain SGLT2i' },
      { key: 'prior_amputation', label: 'Prior Amputation', desc: 'Affects canagliflozin use' },
      { key: 'active_foot_ulcer', label: 'Active Foot Ulcer', desc: 'Caution with SGLT2i' },
      { key: 'high_fracture_risk', label: 'High Fracture Risk', desc: 'Caution with TZD / canagliflozin' },
    ],
  },
  {
    title: 'General Risk Factors',
    items: [
      { key: 'is_frail', label: 'Frail / Elderly', desc: 'Conservative targets' },
      { key: 'hypoxic_state', label: 'Hypoxic State', desc: 'Blocks Metformin', warning: true },
      { key: 'dehydration', label: 'Dehydration Risk', desc: 'Caution with SGLT2i' },
      { key: 'loop_diuretic', label: 'High-Dose Loop Diuretic', desc: 'Caution with SGLT2i' },
      { key: 'gastroparesis', label: 'Gastroparesis', desc: 'Blocks GLP-1 RA', warning: true },
      { key: 'hypoglycemia_history', label: 'Hypoglycemia History', desc: 'Avoid SU / insulin escalation' },
    ],
  },
  {
    title: 'Patient Support',
    items: [
      { key: 'self_management_capable', label: 'Self-Management Capable', desc: 'Can handle insulin / complex regimen' },
      { key: 'caregiver_support', label: 'Has Caregiver Support', desc: 'Enables complex regimens' },
    ],
  },
];

export default function ConditionsForm() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const isNew = patientId === 'new';
  const updatePatientMutation = useUpdatePatientMutation();

  // Reads from React Query cache (prefetched by PatientLayout)
  const { data: existingPatient } = usePatientQuery(isNew ? null : patientId);

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
  });

  // Hydrate form from API data on edit
  useEffect(() => {
    if (!isNew && existingPatient) {
      reset(apiToForm(existingPatient));
    }
  }, [existingPatient, isNew, reset]);

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
    const apiPayload = formToApi(formData);
    updatePatientMutation.mutate({ patientId, data: apiPayload }, {
      onSuccess: () => navigate(`/patient/${patientId}/labs`),
    });
  };

  const isSaving = updatePatientMutation.isPending;
  const saveError = updatePatientMutation.error?.message;

  return (
    <div className="max-w-3xl mx-auto">
      <FormCard
        title="Health Issues &amp; Conditions"
        subtitle="Capture comorbidities that influence medication choice and dosing."
        accentColor="secondary"
      >
        {saveError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {CONDITION_GROUPS.map(({ title, items }) => (
              <div key={title}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{title}</h3>
                <div className="space-y-2">
                  {items.map(({ key, label, desc, required, warning }) => {
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
                              Caution
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              loading={isSaving}
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
