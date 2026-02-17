import React, { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  CheckCircle,
  Pen,
  X as XIcon,
} from 'lucide-react';
import { AUDIT_LOGS } from '../../data/dummyData';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';

/**
 * Audit Trail table — clean white rows with status badges.
 */
export default function AuditTable() {
  const [filter, setFilter] = useState('All');

  const FILTERS = ['All', 'Approved', 'Modified', 'Rejected'];

  const filtered = AUDIT_LOGS.filter((log) => {
    if (filter === 'All') return true;
    return log.status === filter;
  });

  const getBadge = (status) => {
    switch (status) {
      case 'Approved':
        return {
          cls: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
        };
      case 'Modified':
        return {
          cls: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Pen,
        };
      case 'Rejected':
        return {
          cls: 'bg-red-50 text-red-700 border-red-200',
          icon: XIcon,
        };
      default:
        return {
          cls: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: FileText,
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <FormCard
        title="Audit Trail"
        subtitle="Searchable log of all AI recommendations and physician decisions."
        accentColor="primary"
        headerSlot={
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        }
      >
        {/* Filters */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${filter === f
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:bg-primary-50/50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  Log ID
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  Time
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200 hidden md:table-cell">
                  Medications
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200 hidden lg:table-cell">
                  Confidence
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 stagger-children">
              {filtered.map((log) => {
                const badge = getBadge(log.status);
                const Icon = badge.icon;
                return (
                  <tr
                    key={log.id}
                    className="hover:bg-primary-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-primary-600 font-semibold">
                      {log.id}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {log.time}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.cls}`}
                      >
                        <Icon className="w-3 h-3" />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-[200px] truncate hidden md:table-cell">
                      {log.meds}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${log.confidence >= 80
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : log.confidence >= 60
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                      >
                        {log.confidence}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                      {log.action}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No records match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </FormCard>
    </div>
  );
}
