import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { PATIENTS } from '../../data/dummyData';
import PatientCard from './PatientCard';
import StatsCards from './StatsCards';

/**
 * Dashboard: search input, "New Patient" button, stats, and filtered patient list.
 * Uses dummy PATIENTS; filters by name or MR number.
 */
export default function PatientSearch({ onSelectPatient, onNewPatient }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PATIENTS;
    return PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.mrNumber.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 font-display">Patient Search</h2>
        <p className="text-slate-500 text-sm">Search for a patient or create a new record</p>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search by name or MR number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none text-lg"
          aria-label="Search patients"
        />
      </div>

      <button
        type="button"
        onClick={onNewPatient}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition mb-6 text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        New Patient
      </button>

      <StatsCards className="mb-6" />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700 text-sm">Recent Patients</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              No patients match your search.
            </div>
          ) : (
            filtered.map((patient) => (
              <PatientCard key={patient.id} patient={patient} onSelect={onSelectPatient} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
