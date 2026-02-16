import React, { useState } from 'react';
import { Search, User, Activity, FlaskConical, Droplets, Pill, Brain, FileText, ChevronRight, AlertTriangle, CheckCircle, XCircle, Scale, Plus, ArrowLeft, Loader2 } from 'lucide-react';

export default function GlyeralApp() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState({
    demographics: { mrNumber: '', firstName: '', lastName: '', dob: '', gender: '', age: 0, weight: '', height: '', bmi: 0 },
    healthIssues: { dm: true, ckd: false, cad: false, hypertension: false, pregnancy: false },
    labs: { hba1c: '', egfr: '' },
    bloodSugar: { beforeBreakfast: '', beforeLunch: '', beforeDinner: '', beforeBed: '', average: 0 },
    medications: { metformin: 0, glimepiride: 0, tradjenta: false, farxiga: 0, semaglutide: 0, glargine: 0 }
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionedRecs, setActionedRecs] = useState({});

  const navItems = [
    { id: 'demographics', icon: User, label: 'Demographics' },
    { id: 'conditions', icon: Activity, label: 'Health Issues' },
    { id: 'labs', icon: FlaskConical, label: 'Lab Values' },
    { id: 'glucose', icon: Droplets, label: 'Blood Sugar' },
    { id: 'medications', icon: Pill, label: 'Medications' },
    { id: 'recommendations', icon: Brain, label: 'Glyeral Recs' },
    { id: 'audit', icon: FileText, label: 'Audit' }
  ];

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentScreen('demographics');
  };

  const Dashboard = () => {
    const [search, setSearch] = useState('');
    const patients = [
      { id: 1, mrNumber: 'MR-2024-001', name: 'John Smith', age: 58, gender: 'Male', hba1c: '8.2%' },
      { id: 2, mrNumber: 'MR-2024-002', name: 'Maria Garcia', age: 62, gender: 'Female', hba1c: '7.5%' },
      { id: 3, mrNumber: 'MR-2024-003', name: 'Robert Johnson', age: 45, gender: 'Male', hba1c: '9.1%' },
    ];
    const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-4">Patient Search</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none" />
        </div>
        <button onClick={() => selectPatient({ id: 0, mrNumber: 'NEW', name: 'New Patient' })} className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg mb-4 text-sm">
          <Plus className="w-4 h-4" />New Patient
        </button>
        <div className="bg-white rounded-xl shadow border border-slate-100">
          <div className="px-4 py-2 border-b bg-slate-50 font-semibold text-slate-700 text-sm">Recent Patients</div>
          {filtered.map(patient => (
            <div key={patient.id} onClick={() => selectPatient(patient)} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b last:border-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-900" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{patient.name}</p>
                <p className="text-xs text-slate-500">{patient.mrNumber} • {patient.age}y</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">HbA1c</p>
                <p className={`font-bold ${parseFloat(patient.hba1c) > 7 ? 'text-red-500' : 'text-green-600'}`}>{patient.hba1c}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Demographics = () => {
    const update = (field, value) => {
      const d = { ...patientData.demographics, [field]: value };
      if (field === 'dob' && value) {
        d.age = new Date().getFullYear() - new Date(value).getFullYear();
      }
      if (d.weight && d.height) {
        d.bmi = Math.round((parseFloat(d.weight) / Math.pow(parseFloat(d.height)/100, 2)) * 10) / 10;
      }
      setPatientData({ ...patientData, demographics: d });
    };
    
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Demographics</h2>
        <div className="grid grid-cols-2 gap-3">
          <input value={patientData.demographics.mrNumber} onChange={e => update('mrNumber', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="MR Number" />
          <input value={patientData.demographics.firstName} onChange={e => update('firstName', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="First Name" />
          <input value={patientData.demographics.lastName} onChange={e => update('lastName', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="Last Name" />
          <input type="date" value={patientData.demographics.dob} onChange={e => update('dob', e.target.value)} className="px-3 py-2 border rounded-lg" />
          <div className="flex gap-4 items-center col-span-2">
            {['Male', 'Female'].map(g => (
              <label key={g} className="flex items-center gap-2">
                <input type="radio" checked={patientData.demographics.gender === g} onChange={() => update('gender', g)} />
                {g}
              </label>
            ))}
            <span className="ml-auto text-slate-500">Age: {patientData.demographics.age || '--'}</span>
          </div>
          <input type="number" value={patientData.demographics.weight} onChange={e => update('weight', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="Weight (kg)" />
          <input type="number" value={patientData.demographics.height} onChange={e => update('height', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="Height (cm)" />
          <div className="col-span-2 flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <span className={`font-bold ${patientData.demographics.bmi > 30 ? 'text-red-500' : patientData.demographics.bmi > 25 ? 'text-amber-500' : 'text-green-600'}`}>
              BMI: {patientData.demographics.bmi || '--'}
            </span>
          </div>
        </div>
        <button onClick={() => setCurrentScreen('conditions')} className="mt-4 w-full py-2 bg-blue-900 text-white rounded-lg flex items-center justify-center gap-2">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const Conditions = () => {
    const toggle = (key) => {
      if (key !== 'dm') {
        setPatientData({ ...patientData, healthIssues: { ...patientData.healthIssues, [key]: !patientData.healthIssues[key] } });
      }
    };
    const conditions = [
      { key: 'dm', label: 'Diabetes', required: true },
      { key: 'ckd', label: 'CKD' },
      { key: 'cad', label: 'CAD' },
      { key: 'hypertension', label: 'Hypertension' },
      { key: 'pregnancy', label: 'Pregnancy', warning: true }
    ];
    
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Health Issues</h2>
        <div className="space-y-2">
          {conditions.map(({ key, label, required, warning }) => (
            <div key={key} onClick={() => toggle(key)} className={`p-3 rounded-lg border-2 cursor-pointer flex items-center gap-3 ${patientData.healthIssues[key] ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${patientData.healthIssues[key] ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                {patientData.healthIssues[key] && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className="flex-1 font-medium">{label}</span>
              {required && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>}
              {warning && patientData.healthIssues[key] && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />Blocks Oral
                </span>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setCurrentScreen('labs')} className="mt-4 w-full py-2 bg-blue-900 text-white rounded-lg flex items-center justify-center gap-2">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const Labs = () => {
    const update = (key, value) => setPatientData({ ...patientData, labs: { ...patientData.labs, [key]: value } });
    const getColor = (key, val) => {
      if (!val) return 'border-slate-200';
      const v = parseFloat(val);
      if (key === 'hba1c') return v < 7 ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
      if (key === 'egfr') return v >= 60 ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
      return 'border-slate-200';
    };
    
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Lab Values</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">HbA1c (%)</label>
            <input type="number" step="0.1" value={patientData.labs.hba1c} onChange={(e) => update('hba1c', e.target.value)} className={`w-full mt-1 px-3 py-2 border-2 rounded-lg ${getColor('hba1c', patientData.labs.hba1c)}`} placeholder="7.0" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">eGFR (mL/min)</label>
            <input type="number" value={patientData.labs.egfr} onChange={(e) => update('egfr', e.target.value)} className={`w-full mt-1 px-3 py-2 border-2 rounded-lg ${getColor('egfr', patientData.labs.egfr)}`} placeholder="90" />
          </div>
        </div>
        <button onClick={() => setCurrentScreen('glucose')} className="mt-4 w-full py-2 bg-blue-900 text-white rounded-lg flex items-center justify-center gap-2">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const Glucose = () => {
    const update = (key, value) => {
      const bs = { ...patientData.bloodSugar, [key]: value };
      const vals = [bs.beforeBreakfast, bs.beforeLunch, bs.beforeDinner, bs.beforeBed].filter(v => v).map(v => parseFloat(v));
      bs.average = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
      setPatientData({ ...patientData, bloodSugar: bs });
    };
    
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Blood Sugar</h2>
        <div className="space-y-3">
          {['beforeBreakfast', 'beforeLunch', 'beforeDinner', 'beforeBed'].map(key => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-32 text-sm">{key.replace('before', 'Before ')}</span>
              <input type="number" value={patientData.bloodSugar[key]} onChange={(e) => update(key, e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-center" placeholder="--" />
              <span className="text-xs text-slate-400">mg/dL</span>
            </div>
          ))}
          <div className="flex items-center gap-3 pt-3 border-t">
            <span className="w-32 text-sm font-bold">Average</span>
            <div className={`flex-1 py-2 text-center rounded-lg font-bold ${patientData.bloodSugar.average <= 154 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {patientData.bloodSugar.average || '--'} mg/dL
            </div>
          </div>
        </div>
        <button onClick={() => setCurrentScreen('medications')} className="mt-4 w-full py-2 bg-blue-900 text-white rounded-lg flex items-center justify-center gap-2">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const Medications = () => {
    const update = (key, value) => setPatientData({ ...patientData, medications: { ...patientData.medications, [key]: value } });
    
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Medications</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Metformin</span>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="2000" step="250" value={patientData.medications.metformin} onChange={(e) => update('metformin', parseFloat(e.target.value))} className="w-24" />
              <span className="w-16 text-right text-sm">{patientData.medications.metformin}mg</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Farxiga</span>
            <select value={patientData.medications.farxiga} onChange={(e) => update('farxiga', parseFloat(e.target.value))} className="border rounded px-2 py-1">
              {[0, 5, 10].map(v => <option key={v} value={v}>{v === 0 ? 'None' : `${v}mg`}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Ozempic</span>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="2" step="0.25" value={patientData.medications.semaglutide} onChange={(e) => update('semaglutide', parseFloat(e.target.value))} className="w-24" />
              <span className="w-16 text-right text-sm">{patientData.medications.semaglutide}mg</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Glargine</span>
            <div className="flex items-center gap-1">
              <input type="number" min="0" max="100" value={patientData.medications.glargine} onChange={(e) => update('glargine', parseFloat(e.target.value) || 0)} className="w-16 px-2 py-1 border rounded text-right" />
              <span className="text-sm">u</span>
            </div>
          </div>
        </div>
        <button onClick={() => setCurrentScreen('recommendations')} className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
          <Brain className="w-4 h-4" />Get AI Recommendations
        </button>
      </div>
    );
  };

  const Recommendations = () => {
    const generate = () => {
      setIsLoading(true);
      setActionedRecs({});
      setTimeout(() => {
        const egfr = parseFloat(patientData.labs.egfr) || 100;
        const hba1c = parseFloat(patientData.labs.hba1c) || 7;
        const isPregnant = patientData.healthIssues.pregnancy;
        setRecommendations([
          { id: 1, med: 'Metformin', dose: egfr >= 45 ? '1000mg BID' : '500mg BID', confidence: 95, status: egfr < 30 || isPregnant ? 'blocked' : 'approved' },
          { id: 2, med: 'Farxiga', dose: egfr >= 45 ? '10mg daily' : '5mg daily', confidence: 88, status: egfr < 20 || isPregnant ? 'blocked' : 'approved' },
          { id: 3, med: 'Semaglutide', dose: hba1c > 8 ? '0.5mg weekly' : '0.25mg weekly', confidence: 85, status: isPregnant ? 'blocked' : 'approved' },
          { id: 4, med: 'Glargine', dose: hba1c > 9 ? '20u dinner' : '10u dinner', confidence: 80, status: 'approved' },
        ]);
        setIsLoading(false);
      }, 1500);
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Glyeral Recommendations</h2>
          <button onClick={generate} disabled={isLoading} className="px-4 py-2 bg-blue-900 text-white rounded-lg flex items-center gap-2 disabled:opacity-50">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            {isLoading ? 'Analyzing...' : 'Generate'}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-3 mb-4 flex gap-4 text-sm">
          <span>HbA1c: <strong className={parseFloat(patientData.labs.hba1c) > 7 ? 'text-red-500' : 'text-green-600'}>{patientData.labs.hba1c || '--'}%</strong></span>
          <span>eGFR: <strong className={parseFloat(patientData.labs.egfr) < 60 ? 'text-amber-500' : 'text-green-600'}>{patientData.labs.egfr || '--'}</strong></span>
        </div>
        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map(rec => (
              <div key={rec.id} className={`p-4 rounded-xl border-2 ${rec.status === 'approved' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} ${actionedRecs[rec.id] ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{rec.med}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${rec.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {rec.status === 'approved' ? 'Recommended' : 'Blocked'}
                      </span>
                      {actionedRecs[rec.id] && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${actionedRecs[rec.id] === 'accepted' ? 'bg-green-100 text-green-700' : actionedRecs[rec.id] === 'modified' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                          {actionedRecs[rec.id] === 'accepted' ? '✓ Accepted' : actionedRecs[rec.id] === 'modified' ? '✎ Modified' : '✗ Rejected'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700">{rec.dose}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span>Confidence:</span>
                      <div className="w-20 h-2 bg-slate-200 rounded-full">
                        <div className={`h-full rounded-full ${rec.confidence >= 80 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${rec.confidence}%` }} />
                      </div>
                      <span>{rec.confidence}%</span>
                    </div>
                  </div>
                  {rec.status === 'approved' && !actionedRecs[rec.id] && (
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => setActionedRecs({ ...actionedRecs, [rec.id]: 'accepted' })} className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1 text-sm font-medium hover:bg-green-700">
                        <CheckCircle className="w-4 h-4" /> Accept
                      </button>
                      <button onClick={() => setActionedRecs({ ...actionedRecs, [rec.id]: 'modified' })} className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1 text-sm font-medium hover:bg-blue-700">
                        <Scale className="w-4 h-4" /> Modify
                      </button>
                      <button onClick={() => setActionedRecs({ ...actionedRecs, [rec.id]: 'rejected' })} className="px-3 py-2 border-2 border-red-400 text-red-600 rounded-lg flex items-center gap-1 text-sm font-medium hover:bg-red-50">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Click Generate to get recommendations</p>
          </div>
        )}
      </div>
    );
  };

  const Audit = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow overflow-hidden">
      <h2 className="text-xl font-bold text-slate-800 p-4 border-b">Audit Trail</h2>
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Meds</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3">REQ-001</td>
            <td className="px-4 py-3">2024-12-19</td>
            <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Approved</span></td>
            <td className="px-4 py-3">Metformin, Semaglutide</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3">REQ-002</td>
            <td className="px-4 py-3">2024-12-18</td>
            <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Modified</span></td>
            <td className="px-4 py-3">Glargine 15→10u</td>
          </tr>
          <tr>
            <td className="px-4 py-3">REQ-003</td>
            <td className="px-4 py-3">2024-12-17</td>
            <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">Rejected</span></td>
            <td className="px-4 py-3">Glimepiride 4mg</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const screens = {
    dashboard: Dashboard,
    demographics: Demographics,
    conditions: Conditions,
    labs: Labs,
    glucose: Glucose,
    medications: Medications,
    recommendations: Recommendations,
    audit: Audit
  };
  
  const Screen = screens[currentScreen] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold">GLYERAL</h1>
            <p className="text-xs text-blue-200">Decision Support</p>
          </div>
        </div>
        {selectedPatient && (
          <div className="text-right">
            <p className="text-sm font-medium">{selectedPatient.name}</p>
            <p className="text-xs text-blue-200">{selectedPatient.mrNumber}</p>
          </div>
        )}
      </header>
      <div className="flex flex-1 overflow-hidden">
        {selectedPatient && (
          <aside className="w-44 bg-white shadow-lg p-3 flex-shrink-0">
            <button onClick={() => { setSelectedPatient(null); setCurrentScreen('dashboard'); setRecommendations([]); }} className="flex items-center gap-2 text-slate-500 text-sm mb-3">
              <ArrowLeft className="w-4 h-4" />Back
            </button>
            <nav className="space-y-1">
              {navItems.map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setCurrentScreen(id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${currentScreen === id ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </nav>
          </aside>
        )}
        <main className="flex-1 overflow-auto p-4">
          <Screen />
        </main>
      </div>
    </div>
  );
}
