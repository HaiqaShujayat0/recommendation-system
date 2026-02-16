import React, { useState } from 'react';
import { Search, User, Activity, FlaskConical, Droplets, Pill, Brain, FileText, ChevronRight, AlertTriangle, CheckCircle, XCircle, Scale, Plus, ArrowLeft, Loader2, Menu, X, Save, Edit3 } from 'lucide-react';

export default function GlyeralApp() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patientData, setPatientData] = useState({
    demographics: { mrNumber: '', firstName: '', lastName: '', dob: '', gender: '', age: 0, weight: '', height: '', bmi: 0 },
    healthIssues: { dm: true, ckd: false, cad: false, hypertension: false, pregnancy: false, neuropathy: false, retinopathy: false, obesity: false },
    labs: { hba1c: '', egfr: '', creatinine: '', cPeptide: '', lipidPanel: '', urineAlbumin: '', insulinLevel: '' },
    bloodSugar: { beforeBreakfast: '', beforeLunch: '', beforeDinner: '', beforeBed: '', average: 0 },
    medications: { metformin: 0, glimepiride: 0, tradjenta: false, farxiga: 0, semaglutide: 0, glargine: 0, lispro_breakfast: 0, lispro_lunch: 0, lispro_dinner: 0, repaglinide_breakfast: 0, repaglinide_lunch: 0, repaglinide_dinner: 0 }
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    { id: 'demographics', icon: User, label: 'Demographics' },
    { id: 'conditions', icon: Activity, label: 'Health Issues' },
    { id: 'labs', icon: FlaskConical, label: 'Lab Values' },
    { id: 'glucose', icon: Droplets, label: 'Blood Sugar' },
    { id: 'medications', icon: Pill, label: 'Medications' },
    { id: 'recommendations', icon: Brain, label: 'AI Recommendations' },
    { id: 'audit', icon: FileText, label: 'Audit Trail' }
  ];

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentScreen('demographics');
  };

  const renderScreen = () => {
    switch(currentScreen) {
      case 'dashboard': return <Dashboard selectPatient={selectPatient} />;
      case 'demographics': return <Demographics data={patientData} setData={setPatientData} next={() => setCurrentScreen('conditions')} />;
      case 'conditions': return <Conditions data={patientData} setData={setPatientData} next={() => setCurrentScreen('labs')} />;
      case 'labs': return <Labs data={patientData} setData={setPatientData} next={() => setCurrentScreen('glucose')} />;
      case 'glucose': return <Glucose data={patientData} setData={setPatientData} next={() => setCurrentScreen('medications')} />;
      case 'medications': return <Medications data={patientData} setData={setPatientData} next={() => setCurrentScreen('recommendations')} />;
      case 'recommendations': return <Recommendations data={patientData} recommendations={recommendations} setRecommendations={setRecommendations} isLoading={isLoading} setIsLoading={setIsLoading} />;
      case 'audit': return <Audit />;
      default: return <Dashboard selectPatient={selectPatient} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-3 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedPatient && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg lg:hidden">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">GLYERAL</h1>
                <p className="text-[10px] text-blue-200 -mt-1">Physician Decision Support</p>
              </div>
            </div>
          </div>
          {selectedPatient && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{selectedPatient.name}</p>
                <p className="text-xs text-blue-200">MR# {selectedPatient.mrNumber}</p>
              </div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {selectedPatient && (
          <aside className={`${sidebarOpen ? 'w-56' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden flex-shrink-0`}>
            <div className="p-3 w-56">
              <button 
                onClick={() => { setSelectedPatient(null); setCurrentScreen('dashboard'); }}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-900 text-sm mb-4 w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </button>
              
              <nav className="space-y-1">
                {navItems.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setCurrentScreen(id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentScreen === id 
                        ? 'bg-blue-900 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 p-3 bg-slate-50 rounded-lg">
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Key Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">HbA1c</span>
                    <span className={`font-bold ${parseFloat(patientData.labs.hba1c) > 7 ? 'text-red-500' : 'text-green-600'}`}>
                      {patientData.labs.hba1c || '--'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">eGFR</span>
                    <span className={`font-bold ${parseFloat(patientData.labs.egfr) < 60 ? 'text-amber-500' : 'text-green-600'}`}>
                      {patientData.labs.egfr || '--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">BMI</span>
                    <span className={`font-bold ${patientData.demographics.bmi > 30 ? 'text-red-500' : patientData.demographics.bmi > 25 ? 'text-amber-500' : 'text-green-600'}`}>
                      {patientData.demographics.bmi || '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ selectPatient }) {
  const [search, setSearch] = useState('');
  
  const patients = [
    { id: 1, mrNumber: 'MR-2024-001', name: 'John Smith', age: 58, gender: 'Male', lastVisit: '2024-12-15', hba1c: '8.2%' },
    { id: 2, mrNumber: 'MR-2024-002', name: 'Maria Garcia', age: 62, gender: 'Female', lastVisit: '2024-12-18', hba1c: '7.5%' },
    { id: 3, mrNumber: 'MR-2024-003', name: 'Robert Johnson', age: 45, gender: 'Male', lastVisit: '2024-12-19', hba1c: '9.1%' },
  ];

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.mrNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Patient Search</h2>
        <p className="text-slate-500 text-sm">Search for a patient or create a new record</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or MR number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
        />
      </div>

      <button 
        onClick={() => selectPatient({ id: 0, mrNumber: 'NEW', name: 'New Patient' })}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition mb-6 text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        New Patient
      </button>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { value: '12', label: 'Patients Today', color: 'text-blue-900' },
          { value: '3', label: 'Pending Reviews', color: 'text-amber-500' },
          { value: '89%', label: 'Acceptance Rate', color: 'text-green-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700 text-sm">Recent Patients</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map(patient => (
            <div 
              key={patient.id}
              onClick={() => selectPatient(patient)}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{patient.name}</p>
                <p className="text-xs text-slate-500">{patient.mrNumber} • {patient.age}y • {patient.gender}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-400">HbA1c</p>
                <p className={`text-sm font-bold ${parseFloat(patient.hba1c) > 7 ? 'text-red-500' : 'text-green-600'}`}>{patient.hba1c}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Demographics Component
function Demographics({ data, setData, next }) {
  const update = (field, value) => {
    const newDemo = { ...data.demographics, [field]: value };
    
    if (field === 'dob' && value) {
      const birth = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
      newDemo.age = age;
    }
    
    if ((field === 'weight' || field === 'height') && newDemo.weight && newDemo.height) {
      const h = parseFloat(newDemo.height) / 100;
      if (h > 0) newDemo.bmi = Math.round((parseFloat(newDemo.weight) / (h * h)) * 10) / 10;
    }
    
    setData({ ...data, demographics: newDemo });
  };

  const getBmiStyle = (bmi) => {
    if (!bmi) return 'bg-slate-100 text-slate-500';
    if (bmi < 18.5) return 'bg-amber-100 text-amber-700';
    if (bmi < 25) return 'bg-green-100 text-green-700';
    if (bmi < 30) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">Patient Demographics</h2>
        <p className="text-slate-500 text-sm">Basic information for ML model input</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="grid grid-cols-2 gap-4">
          <Input label="MR Number *" value={data.demographics.mrNumber} onChange={v => update('mrNumber', v)} placeholder="MR-2024-XXX" />
          <Input label="First Name *" value={data.demographics.firstName} onChange={v => update('firstName', v)} />
          <Input label="Last Name *" value={data.demographics.lastName} onChange={v => update('lastName', v)} />
          <Input label="Date of Birth *" type="date" value={data.demographics.dob} onChange={v => update('dob', v)} />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender *</label>
            <div className="flex gap-4">
              {['Male', 'Female'].map(g => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={data.demographics.gender === g} onChange={() => update('gender', g)} className="w-4 h-4 text-blue-900" />
                  <span className="text-sm">{g}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm">
              {data.demographics.age || '--'} years
            </div>
          </div>
          
          <Input label="Weight (kg) *" type="number" value={data.demographics.weight} onChange={v => update('weight', v)} placeholder="75" />
          <Input label="Height (cm) *" type="number" value={data.demographics.height} onChange={v => update('height', v)} placeholder="175" />
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">BMI (Calculated)</label>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getBmiStyle(data.demographics.bmi)}`}>
              <Scale className="w-4 h-4" />
              {data.demographics.bmi || '--'} kg/m²
              {data.demographics.bmi >= 30 && ' (Obese)'}
              {data.demographics.bmi >= 25 && data.demographics.bmi < 30 && ' (Overweight)'}
              {data.demographics.bmi >= 18.5 && data.demographics.bmi < 25 && ' (Normal)'}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={next} className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm font-medium">
            Next: Health Issues <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Conditions Component
function Conditions({ data, setData, next }) {
  const conditions = [
    { key: 'dm', label: 'Diabetes Mellitus', desc: 'Primary condition - always checked', required: true },
    { key: 'ckd', label: 'Chronic Kidney Disease', desc: 'Affects Metformin dosing' },
    { key: 'cad', label: 'Coronary Artery Disease', desc: 'Favors SGLT2i/GLP-1 RA' },
    { key: 'hypertension', label: 'Hypertension', desc: 'CV risk factor' },
    { key: 'pregnancy', label: 'Pregnancy', desc: 'BLOCKS oral medications', warning: true },
    { key: 'neuropathy', label: 'Neuropathy', desc: 'DM complication' },
    { key: 'retinopathy', label: 'Retinopathy', desc: 'DM complication' },
  ];

  const toggle = (key) => {
    if (key === 'dm') return;
    setData({ ...data, healthIssues: { ...data.healthIssues, [key]: !data.healthIssues[key] } });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">Health Issues & Conditions</h2>
        <p className="text-slate-500 text-sm">Select all applicable conditions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="space-y-2">
          {conditions.map(({ key, label, desc, required, warning }) => (
            <div
              key={key}
              onClick={() => toggle(key)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
                data.healthIssues[key] ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              } ${required ? 'cursor-not-allowed' : ''}`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                data.healthIssues[key] ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
              }`}>
                {data.healthIssues[key] && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              {required && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full">Required</span>}
              {warning && data.healthIssues[key] && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Blocks Oral
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={next} className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm font-medium">
            Next: Lab Values <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Labs Component
function Labs({ data, setData, next }) {
  const labs = [
    { key: 'hba1c', label: 'HbA1c', unit: '%', normal: '< 5.7', critical: true },
    { key: 'egfr', label: 'eGFR', unit: 'mL/min', normal: '> 90', critical: true },
    { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL', normal: '0.7-1.3' },
    { key: 'lipidPanel', label: 'LDL', unit: 'mg/dL', normal: '< 100' },
    { key: 'urineAlbumin', label: 'Urine Albumin', unit: 'mg/L', normal: '< 30' },
  ];

  const update = (key, value) => setData({ ...data, labs: { ...data.labs, [key]: value } });

  const getStatus = (key, value) => {
    if (!value) return '';
    const v = parseFloat(value);
    if (key === 'hba1c') return v < 5.7 ? 'border-green-500 bg-green-50' : v < 7 ? 'border-amber-500 bg-amber-50' : 'border-red-500 bg-red-50';
    if (key === 'egfr') return v >= 90 ? 'border-green-500 bg-green-50' : v >= 60 ? 'border-amber-500 bg-amber-50' : 'border-red-500 bg-red-50';
    return '';
  };

  const getCkdStage = (egfr) => {
    if (!egfr) return null;
    const v = parseFloat(egfr);
    if (v >= 90) return { stage: '1', label: 'Normal', color: 'bg-green-100 text-green-700' };
    if (v >= 60) return { stage: '2', label: 'Mild', color: 'bg-amber-100 text-amber-700' };
    if (v >= 30) return { stage: '3', label: 'Moderate', color: 'bg-orange-100 text-orange-700' };
    if (v >= 15) return { stage: '4', label: 'Severe', color: 'bg-red-100 text-red-700' };
    return { stage: '5', label: 'Failure', color: 'bg-red-100 text-red-700' };
  };

  const ckd = getCkdStage(data.labs.egfr);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">Laboratory Values</h2>
        <p className="text-slate-500 text-sm">HbA1c and eGFR are required for ML prediction</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="grid grid-cols-2 gap-4">
          {labs.map(({ key, label, unit, normal, critical }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                {label}
                {critical && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded">PRIMARY</span>}
              </label>
              <div className={`flex items-center border-2 rounded-lg transition ${getStatus(key, data.labs[key]) || 'border-slate-200'}`}>
                <input
                  type="number"
                  step="0.1"
                  value={data.labs[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
                  placeholder="--"
                />
                <span className="px-3 text-slate-400 text-xs">{unit}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Normal: {normal}</p>
            </div>
          ))}
        </div>

        {ckd && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center gap-3">
            <Activity className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-xs text-slate-500">CKD Stage</p>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ckd.color}`}>
                Stage {ckd.stage}: {ckd.label}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={next} className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm font-medium">
            Next: Blood Sugar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Glucose Component
function Glucose({ data, setData, next }) {
  const times = [
    { key: 'beforeBreakfast', label: 'Before Breakfast', target: '80-130' },
    { key: 'beforeLunch', label: 'Before Lunch', target: '80-130' },
    { key: 'beforeDinner', label: 'Before Dinner', target: '80-130' },
    { key: 'beforeBed', label: 'Before Bed', target: '100-140' },
  ];

  const update = (key, value) => {
    const newBS = { ...data.bloodSugar, [key]: value };
    const vals = [newBS.beforeBreakfast, newBS.beforeLunch, newBS.beforeDinner, newBS.beforeBed]
      .filter(v => v && !isNaN(parseFloat(v))).map(v => parseFloat(v));
    newBS.average = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    setData({ ...data, bloodSugar: newBS });
  };

  const getColor = (value) => {
    if (!value) return 'border-slate-200';
    const v = parseFloat(value);
    if (v < 70) return 'border-red-500 bg-red-50';
    if (v <= 140) return 'border-green-500 bg-green-50';
    if (v <= 180) return 'border-amber-500 bg-amber-50';
    return 'border-red-500 bg-red-50';
  };

  const hasHypo = Object.values(data.bloodSugar).some(v => v && parseFloat(v) < 70);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">Daily Blood Sugar</h2>
        <p className="text-slate-500 text-sm">Enter glucose readings in mg/dL</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="space-y-3">
          {times.map(({ key, label, target }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-32 text-sm text-slate-700">{label}</div>
              <div className={`flex-1 flex items-center border-2 rounded-lg transition ${getColor(data.bloodSugar[key])}`}>
                <input
                  type="number"
                  value={data.bloodSugar[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-center font-mono"
                  placeholder="--"
                />
                <span className="px-3 text-slate-400 text-xs">mg/dL</span>
              </div>
              <div className="w-20 text-xs text-slate-400">{target}</div>
            </div>
          ))}

          <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
            <div className="w-32 text-sm font-bold text-slate-700">Average</div>
            <div className={`flex-1 flex items-center justify-center py-2 rounded-lg ${
              !data.bloodSugar.average ? 'bg-slate-100' : data.bloodSugar.average <= 154 ? 'bg-green-100' : 'bg-amber-100'
            }`}>
              <span className="text-xl font-bold font-mono">{data.bloodSugar.average || '--'}</span>
              <span className="ml-2 text-slate-500 text-sm">mg/dL</span>
            </div>
            <div className="w-20 text-xs text-slate-400">&lt;154</div>
          </div>
        </div>

        {hasHypo && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <p className="font-medium text-red-700 text-sm">Hypoglycemia Detected</p>
              <p className="text-xs text-red-600">Reading below 70 mg/dL</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={next} className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm font-medium">
            Next: Medications <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Medications Component
function Medications({ data, setData, next }) {
  const meds = [
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

  const update = (key, value) => setData({ ...data, medications: { ...data.medications, [key]: value } });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">Current Medications</h2>
        <p className="text-slate-500 text-sm">Enter current diabetes medications</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {meds.map(({ key, label, range, type, options, min, max, step, class: medClass }) => (
            <div key={key} className="p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{label}</p>
                  <p className="text-xs text-slate-500">{range}</p>
                </div>
                {type === 'toggle' ? (
                  <button
                    onClick={() => update(key, !data.medications[key])}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition flex-shrink-0 ${
                      data.medications[key] ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {data.medications[key] ? 'ON' : 'OFF'}
                  </button>
                ) : type === 'select' ? (
                  <select
                    value={data.medications[key]}
                    onChange={(e) => update(key, parseFloat(e.target.value))}
                    className="px-2 py-1 border border-slate-200 rounded text-sm flex-shrink-0"
                  >
                    {options.map(opt => <option key={opt} value={opt}>{opt === 0 ? 'None' : `${opt}${key.includes('repaglinide') ? 'mg' : 'mg'}`}</option>)}
                  </select>
                ) : type === 'slider' ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input type="range" min={min} max={max} step={step} value={data.medications[key]} onChange={(e) => update(key, parseFloat(e.target.value))} className="w-20" />
                    <span className="w-14 text-right text-xs font-mono">{data.medications[key]}mg</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input type="number" min={min} max={max} value={data.medications[key]} onChange={(e) => update(key, parseFloat(e.target.value) || 0)} className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-right" placeholder="0" />
                    <span className="text-xs text-slate-500">u</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={next} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
            <Brain className="w-4 h-4" />
            Get AI Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}

// Medication Configuration for Recommendations
const MEDICATION_CONFIG = {
  'Metformin': {
    class: 'Biguanide',
    dosageRange: '500-2000mg',
    dosageOptions: ['500mg', '750mg', '1000mg', '1500mg', '2000mg'],
    frequencyOptions: ['Once daily', 'Twice daily'],
    timingOptions: ['With breakfast', 'With dinner', 'With meals'],
    unit: 'mg'
  },
  'Glimepiride': {
    class: 'Sulfonylurea',
    dosageRange: '1-4mg',
    dosageOptions: ['1mg', '2mg', '3mg', '4mg'],
    frequencyOptions: ['Once daily'],
    timingOptions: ['Before breakfast', 'With breakfast'],
    unit: 'mg'
  },
  'Tradjenta': {
    class: 'DPP-4 Inhibitor',
    dosageRange: '5mg',
    dosageOptions: ['5mg'],
    frequencyOptions: ['Once daily'],
    timingOptions: ['Morning', 'Any time'],
    unit: 'mg'
  },
  'Glargine_Before_Dinner': {
    class: 'Basal Insulin',
    dosageRange: '4-100 units',
    dosageOptions: ['4 units', '6 units', '8 units', '10 units', '12 units', '15 units', '20 units', '25 units', '30 units', '40 units', '50 units', '60 units', '80 units', '100 units'],
    frequencyOptions: ['Once daily'],
    timingOptions: ['Before dinner', 'At bedtime'],
    unit: 'units'
  },
  'Lispro_Before_Breakfast': {
    class: 'Rapid-Acting Insulin',
    dosageRange: '4-100 units',
    dosageOptions: ['4 units', '6 units', '8 units', '10 units', '12 units', '15 units', '20 units', '25 units', '30 units', '40 units', '50 units'],
    frequencyOptions: ['Before meals'],
    timingOptions: ['Before breakfast'],
    unit: 'units'
  },
  'Lispro_Before_Lunch': {
    class: 'Rapid-Acting Insulin',
    dosageRange: '4-100 units',
    dosageOptions: ['4 units', '6 units', '8 units', '10 units', '12 units', '15 units', '20 units', '25 units', '30 units', '40 units', '50 units'],
    frequencyOptions: ['Before meals'],
    timingOptions: ['Before lunch'],
    unit: 'units'
  },
  'Lispro_Before_Dinner': {
    class: 'Rapid-Acting Insulin',
    dosageRange: '4-100 units',
    dosageOptions: ['4 units', '6 units', '8 units', '10 units', '12 units', '15 units', '20 units', '25 units', '30 units', '40 units', '50 units'],
    frequencyOptions: ['Before meals'],
    timingOptions: ['Before dinner'],
    unit: 'units'
  },
  'Repaglinide_Before_Breakfast': {
    class: 'Meglitinide',
    dosageRange: '0.5-2mg',
    dosageOptions: ['0.5mg', '1mg', '1.5mg', '2mg'],
    frequencyOptions: ['Before meals'],
    timingOptions: ['Before breakfast'],
    unit: 'mg'
  },
  'Repaglinide_Before_Lunch': {
    class: 'Meglitinide',
    dosageRange: '0.5-2mg',
    dosageOptions: ['0.5mg', '1mg', '1.5mg', '2mg'],
    frequencyOptions: ['Before meals'],
    timingOptions: ['Before lunch'],
    unit: 'mg'
  },
  'Repaglinide_Before_Dinner': {
    class: 'Meglitinide',
    dosageRange: '0.5-2mg',
    dosageOptions: ['0.5mg', '1mg', '1.5mg', '2mg'],
    frequencyOptions: ['Before meals'],
    timingOptions: ['Before dinner'],
    unit: 'mg'
  },
  'Farxiga': {
    class: 'SGLT2 Inhibitor',
    dosageRange: '5-10mg',
    dosageOptions: ['5mg', '10mg'],
    frequencyOptions: ['Once daily'],
    timingOptions: ['Morning', 'Any time'],
    unit: 'mg'
  },
  'Semaglutide': {
    class: 'GLP-1 RA',
    dosageRange: '0.25-2mg',
    dosageOptions: ['0.25mg', '0.5mg', '1mg', '1.5mg', '2mg'],
    frequencyOptions: ['Once weekly'],
    timingOptions: ['Same day each week', 'Any time of day'],
    unit: 'mg'
  }
};

// Modify Medication Modal Component
function ModifyModal({ recommendation, onSave, onClose }) {
  const config = MEDICATION_CONFIG[recommendation.med] || {};
  
  const [modifiedData, setModifiedData] = useState({
    dosage: recommendation.originalDosage || '',
    frequency: config.frequencyOptions?.[0] || 'Once daily',
    timing: config.timingOptions?.[0] || 'Morning',
    notes: ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Modify Medication</h3>
              <p className="text-blue-200 text-sm">{recommendation.med}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-1">AI Recommended</p>
            <p className="text-blue-900 font-semibold">{recommendation.dose}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-xs text-slate-500">Drug Class</p>
              <p className="text-sm font-medium text-slate-700">{config.class || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Dosage Range</p>
              <p className="text-sm font-medium text-slate-700">{config.dosageRange || 'N/A'}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Modified Dosage *</label>
            <select
              value={modifiedData.dosage}
              onChange={(e) => setModifiedData({ ...modifiedData, dosage: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="">Select dosage...</option>
              {(config.dosageOptions || ['Custom']).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
            <select
              value={modifiedData.frequency}
              onChange={(e) => setModifiedData({ ...modifiedData, frequency: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            >
              {(config.frequencyOptions || ['Once daily']).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Timing</label>
            <select
              value={modifiedData.timing}
              onChange={(e) => setModifiedData({ ...modifiedData, timing: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            >
              {(config.timingOptions || ['Morning']).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Modification Reason *</label>
            <textarea
              value={modifiedData.notes}
              onChange={(e) => setModifiedData({ ...modifiedData, notes: e.target.value })}
              placeholder="Enter reason for modification (required for audit trail)..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm resize-none"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              All modifications are logged for FDA 21 CFR Part 11 compliance.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-medium">
            Cancel
          </button>
          <button
            onClick={() => {
              if (modifiedData.dosage && modifiedData.notes) {
                onSave({
                  ...recommendation,
                  dose: `${modifiedData.dosage} ${modifiedData.frequency.toLowerCase()}`,
                  modifiedDosage: modifiedData.dosage,
                  frequency: modifiedData.frequency,
                  timing: modifiedData.timing,
                  notes: modifiedData.notes,
                  status: 'modified',
                  modifiedAt: new Date().toISOString()
                });
              }
            }}
            disabled={!modifiedData.dosage || !modifiedData.notes}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Modification
          </button>
        </div>
      </div>
    </div>
  );
}

// Recommendations Component
function Recommendations({ data, recommendations, setRecommendations, isLoading, setIsLoading }) {
  const [modifyingRec, setModifyingRec] = useState(null);
  const [actionedRecs, setActionedRecs] = useState({});

  const generate = () => {
    setIsLoading(true);
    setActionedRecs({});
    
    setTimeout(() => {
      const egfr = parseFloat(data.labs.egfr) || 100;
      const hba1c = parseFloat(data.labs.hba1c) || 7;
      const isPregnant = data.healthIssues.pregnancy;
      const hasCKD = data.healthIssues.ckd || egfr < 60;
      const hasCAD = data.healthIssues.cad;

      const recs = [
        // Oral Medications
        { 
          id: 1, 
          med: 'Metformin', 
          dose: egfr >= 45 ? '1000mg twice daily' : egfr >= 30 ? '500mg twice daily' : 'Not recommended',
          originalDosage: egfr >= 45 ? '1000mg' : '500mg',
          confidence: egfr >= 45 ? 95 : egfr >= 30 ? 70 : 0,
          status: egfr < 30 || isPregnant ? 'blocked' : 'approved',
          guidelines: ['ADA 2025 First-line therapy'],
          warnings: egfr < 30 ? ['BLOCKED: eGFR < 30 - Contraindicated'] : isPregnant ? ['BLOCKED: Pregnancy'] : egfr < 45 ? ['Reduce dose for eGFR 30-45'] : [],
          category: 'Oral'
        },
        { 
          id: 2, 
          med: 'Glimepiride', 
          dose: '2mg once daily before breakfast',
          originalDosage: '2mg',
          confidence: 55,
          status: isPregnant ? 'blocked' : 'warning',
          guidelines: ['Second-line if Metformin intolerant'],
          warnings: isPregnant ? ['BLOCKED: Pregnancy'] : ['Hypoglycemia risk', 'Weight gain potential'],
          category: 'Oral'
        },
        { 
          id: 3, 
          med: 'Tradjenta', 
          dose: '5mg once daily',
          originalDosage: '5mg',
          confidence: 75,
          status: isPregnant ? 'blocked' : 'approved',
          guidelines: ['No renal dose adjustment needed', 'ADA: DPP-4i option'],
          warnings: isPregnant ? ['BLOCKED: Pregnancy'] : [],
          category: 'Oral'
        },
        { 
          id: 4, 
          med: 'Farxiga', 
          dose: egfr >= 45 ? '10mg once daily' : '5mg once daily',
          originalDosage: egfr >= 45 ? '10mg' : '5mg',
          confidence: hasCAD || hasCKD ? 90 : 82,
          status: egfr < 25 || isPregnant ? 'blocked' : 'approved',
          guidelines: ['KDIGO 2024: CKD benefit', 'AHA: Heart failure protection'],
          warnings: egfr < 25 ? ['BLOCKED: eGFR < 25'] : isPregnant ? ['BLOCKED: Pregnancy'] : egfr < 45 ? ['Reduced glucose efficacy at lower eGFR'] : [],
          category: 'Oral'
        },
        { 
          id: 5, 
          med: 'Semaglutide', 
          dose: hba1c > 8 ? '0.5mg weekly → titrate to 1mg' : '0.25mg weekly → titrate to 0.5mg',
          originalDosage: hba1c > 8 ? '0.5mg' : '0.25mg',
          confidence: 88,
          status: isPregnant ? 'blocked' : 'approved',
          guidelines: ['ADA: Weight loss benefit', 'AHA: CV risk reduction'],
          warnings: isPregnant ? ['BLOCKED: Pregnancy'] : ['Start low, titrate slowly for GI tolerance'],
          category: 'Injectable'
        },
        { 
          id: 6, 
          med: 'Repaglinide_Before_Breakfast', 
          dose: '1mg before breakfast',
          originalDosage: '1mg',
          confidence: 50,
          status: isPregnant ? 'blocked' : 'warning',
          guidelines: ['Alternative to sulfonylureas', 'Flexible meal-time dosing'],
          warnings: isPregnant ? ['BLOCKED: Pregnancy'] : ['Hypoglycemia risk', 'Requires meal-time dosing'],
          category: 'Oral'
        },
        { 
          id: 7, 
          med: 'Repaglinide_Before_Lunch', 
          dose: '1mg before lunch',
          originalDosage: '1mg',
          confidence: 50,
          status: isPregnant ? 'blocked' : 'warning',
          guidelines: ['Alternative to sulfonylureas'],
          warnings: isPregnant ? ['BLOCKED: Pregnancy'] : ['Hypoglycemia risk'],
          category: 'Oral'
        },
        { 
          id: 8, 
          med: 'Repaglinide_Before_Dinner', 
          dose: '1mg before dinner',
          originalDosage: '1mg',
          confidence: 50,
          status: isPregnant ? 'blocked' : 'warning',
          guidelines: ['Alternative to sulfonylureas'],
          warnings: isPregnant ? ['BLOCKED: Pregnancy'] : ['Hypoglycemia risk'],
          category: 'Oral'
        },
        // Insulin
        { 
          id: 9, 
          med: 'Glargine_Before_Dinner', 
          dose: hba1c > 9 ? '20 units before dinner' : '10 units before dinner',
          originalDosage: hba1c > 9 ? '20 units' : '10 units',
          confidence: hba1c > 9 ? 92 : 78,
          status: 'approved',
          guidelines: ['ADA: Basal insulin when HbA1c > 9%', 'Safe in pregnancy'],
          warnings: hba1c <= 7.5 ? ['May not be needed if HbA1c at goal'] : [],
          category: 'Insulin'
        },
        { 
          id: 10, 
          med: 'Lispro_Before_Breakfast', 
          dose: '6 units before breakfast',
          originalDosage: '6 units',
          confidence: hba1c > 8.5 ? 80 : 60,
          status: 'approved',
          guidelines: ['ADA: Bolus insulin for post-meal control', 'Safe in pregnancy'],
          warnings: ['Monitor for hypoglycemia', 'Adjust based on carb intake'],
          category: 'Insulin'
        },
        { 
          id: 11, 
          med: 'Lispro_Before_Lunch', 
          dose: '6 units before lunch',
          originalDosage: '6 units',
          confidence: hba1c > 8.5 ? 80 : 60,
          status: 'approved',
          guidelines: ['ADA: Bolus insulin for post-meal control'],
          warnings: ['Monitor for hypoglycemia'],
          category: 'Insulin'
        },
        { 
          id: 12, 
          med: 'Lispro_Before_Dinner', 
          dose: '8 units before dinner',
          originalDosage: '8 units',
          confidence: hba1c > 8.5 ? 82 : 62,
          status: 'approved',
          guidelines: ['ADA: Bolus insulin for post-meal control'],
          warnings: ['Monitor for hypoglycemia'],
          category: 'Insulin'
        },
      ];

      setRecommendations(recs);
      setIsLoading(false);
    }, 1500);
  };

  const handleAccept = (rec) => {
    setActionedRecs({ ...actionedRecs, [rec.id]: { action: 'accepted', timestamp: new Date().toISOString() } });
  };

  const handleReject = (rec) => {
    setActionedRecs({ ...actionedRecs, [rec.id]: { action: 'rejected', timestamp: new Date().toISOString() } });
  };

  const handleModifySave = (modifiedRec) => {
    setRecommendations(recommendations.map(r => r.id === modifiedRec.id ? modifiedRec : r));
    setActionedRecs({ ...actionedRecs, [modifiedRec.id]: { action: 'modified', timestamp: new Date().toISOString(), notes: modifiedRec.notes } });
    setModifyingRec(null);
  };

  const getStatusStyle = (status) => {
    if (status === 'approved') return 'border-green-500 bg-green-50';
    if (status === 'warning') return 'border-amber-500 bg-amber-50';
    if (status === 'modified') return 'border-blue-500 bg-blue-50';
    return 'border-red-500 bg-red-50';
  };

  const getActionBadge = (recId) => {
    const action = actionedRecs[recId];
    if (!action) return null;
    
    const styles = {
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      modified: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    
    const icons = {
      accepted: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      modified: <Edit3 className="w-3 h-3" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[action.action]}`}>
        {icons[action.action]}
        {action.action.charAt(0).toUpperCase() + action.action.slice(1)}
      </span>
    );
  };

  // Group recommendations by category
  const groupedRecs = recommendations.reduce((acc, rec) => {
    const cat = rec.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rec);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">
      {modifyingRec && (
        <ModifyModal
          recommendation={modifyingRec}
          onSave={handleModifySave}
          onClose={() => setModifyingRec(null)}
        />
      )}

      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">AI Medication Recommendations</h2>
          <p className="text-slate-500 text-sm">12 medications analyzed based on patient profile</p>
        </div>
        <button onClick={generate} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-50">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {isLoading ? 'Analyzing...' : 'Generate Recommendations'}
        </button>
      </div>

      {/* Patient Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-3 mb-4 flex items-center gap-4 flex-wrap text-sm">
        <span className="text-slate-500">HbA1c: <strong className={parseFloat(data.labs.hba1c) > 7 ? 'text-red-500' : 'text-green-600'}>{data.labs.hba1c || '--'}%</strong></span>
        <span className="text-slate-500">eGFR: <strong className={parseFloat(data.labs.egfr) < 60 ? 'text-amber-500' : 'text-green-600'}>{data.labs.egfr || '--'}</strong></span>
        <span className="text-slate-500">BMI: <strong>{data.demographics.bmi || '--'}</strong></span>
        {data.healthIssues.cad && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">CAD</span>}
        {data.healthIssues.ckd && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">CKD</span>}
        {data.healthIssues.pregnancy && <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">Pregnancy</span>}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                <div className="flex-1"><div className="h-4 bg-slate-200 rounded w-40 mb-2" /><div className="h-3 bg-slate-200 rounded w-24" /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations by Category */}
      {!isLoading && recommendations.length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedRecs).map(([category, recs]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                {category} Medications ({recs.length})
              </h3>
              <div className="space-y-2">
                {recs.map(rec => {
                  const isActioned = !!actionedRecs[rec.id];
                  
                  return (
                    <div key={rec.id} className={`bg-white rounded-lg shadow-sm border-2 p-3 transition-all ${isActioned ? 'opacity-60' : ''} ${getStatusStyle(rec.status)}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          rec.status === 'approved' ? 'bg-green-100' : 
                          rec.status === 'warning' ? 'bg-amber-100' : 
                          rec.status === 'modified' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          {rec.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {rec.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {rec.status === 'modified' && <Edit3 className="w-4 h-4 text-blue-600" />}
                          {rec.status === 'blocked' && <XCircle className="w-4 h-4 text-red-600" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className={`font-bold text-sm ${rec.status === 'blocked' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {rec.med.replace(/_/g, ' ')}
                            </h4>
                            {rec.status === 'blocked' && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">BLOCKED</span>}
                            {rec.status === 'modified' && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">MODIFIED</span>}
                            {getActionBadge(rec.id)}
                          </div>
                          <p className="text-slate-600 text-xs mb-2">{rec.dose}</p>

                          {rec.status === 'modified' && rec.notes && (
                            <p className="text-xs text-blue-600 mb-2 italic">Note: {rec.notes}</p>
                          )}

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden max-w-[100px]">
                              <div className={`h-full rounded-full ${rec.confidence >= 80 ? 'bg-green-500' : rec.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${rec.confidence}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-500">{rec.confidence}%</span>
                            {rec.guidelines.slice(0, 1).map((g, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded hidden sm:inline">{g}</span>
                            ))}
                          </div>

                          {rec.warnings.length > 0 && (
                            <p className="flex items-center gap-1 text-[10px] text-amber-600">
                              <AlertTriangle className="w-3 h-3" />{rec.warnings[0]}
                            </p>
                          )}
                        </div>

                        {rec.status !== 'blocked' && !isActioned && (
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => handleAccept(rec)} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700" title="Accept">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => setModifyingRec(rec)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="Modify">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReject(rec)} className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {isActioned && (
                          <span className="text-[10px] text-slate-400 flex-shrink-0">✓ Saved</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recommendations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center">
          <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-medium text-slate-600 mb-1">No Recommendations Yet</h3>
          <p className="text-slate-400 text-sm mb-4">Click Generate to analyze all 12 medications</p>
          <button onClick={generate} className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm">Generate Recommendations</button>
        </div>
      )}

      {/* Summary */}
      {Object.keys(actionedRecs).length > 0 && (
        <div className="mt-6 p-4 bg-slate-100 rounded-xl">
          <h4 className="font-semibold text-slate-700 mb-3 text-sm">Decision Summary</h4>
          <div className="flex gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Accepted: {Object.values(actionedRecs).filter(a => a.action === 'accepted').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Modified: {Object.values(actionedRecs).filter(a => a.action === 'modified').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Rejected: {Object.values(actionedRecs).filter(a => a.action === 'rejected').length}</span>
            </div>
          </div>
          <button className="w-full py-2.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800">
            Submit All Decisions
          </button>
        </div>
      )}
    </div>
  );
}

// Audit Component
function Audit() {
  const logs = [
    { id: 'REQ-001', time: '2024-12-19 14:32', status: 'Approved', meds: 'Metformin 1000mg, Semaglutide 0.5mg', confidence: 91, action: 'Accepted - Dr. Smith' },
    { id: 'REQ-002', time: '2024-12-18 09:15', status: 'Modified', meds: 'Glargine 15u → 10u', confidence: 85, action: 'Reduced - patient preference' },
    { id: 'REQ-003', time: '2024-12-17 16:45', status: 'Rejected', meds: 'Glimepiride 4mg', confidence: 52, action: 'Hypoglycemia history' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">Audit Trail</h2>
        <p className="text-slate-500 text-sm">FDA 21 CFR Part 11 Compliance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50 flex-wrap">
          <input type="date" className="px-2 py-1.5 border border-slate-200 rounded text-sm" />
          <input type="date" className="px-2 py-1.5 border border-slate-200 rounded text-sm" />
          <select className="px-2 py-1.5 border border-slate-200 rounded text-sm">
            <option>All Status</option>
            <option>Approved</option>
            <option>Modified</option>
            <option>Rejected</option>
          </select>
          <button className="ml-auto px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded hover:bg-slate-200">Export</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">Time</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">Medications</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">Confidence</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-600">{log.id}</td>
                  <td className="px-4 py-3 text-slate-600">{log.time}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      log.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      log.status === 'Modified' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>{log.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{log.meds}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${log.confidence >= 80 ? 'bg-green-500' : log.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${log.confidence}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500">{log.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
function Input({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
        placeholder={placeholder}
      />
    </div>
  );
}
