import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { PATIENTS } from '../../data/dummyData';
import PatientCard from './PatientCard';
import StatsCards from './StatsCards';
import Button from '../ui/Button';

/**
 * Clean dashboard: search input, stats, filtered patient list.
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
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {/* Hero area */}
      <div className="card px-5 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Patient Workspace
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Search existing patients or start a new diabetes care plan.
          </p>
        </div>
        <Button
          type="button"
          onClick={onNewPatient}
          icon={<Plus className="w-4 h-4" />}
        >
          New Patient
        </Button>
      </div>

      {/* Main content card */}
      <div className="card-elevated p-5 space-y-5">
        {/* Search input */}
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-primary-500"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search by name or MR number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15 text-base bg-white transition-all duration-200 hover:border-slate-300"
            aria-label="Search patients"
          />
        </div>

        <StatsCards />

        {/* Patient list */}
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-700 text-sm">
              Recent Patients
            </h3>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
              {filtered.length} record{filtered.length !== 1 && 's'}
            </span>
          </div>
          <div className="divide-y divide-slate-100 stagger-children">
            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-slate-500 text-sm">
                No patients match your search.
              </div>
            ) : (
              filtered.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onSelect={onSelectPatient}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
