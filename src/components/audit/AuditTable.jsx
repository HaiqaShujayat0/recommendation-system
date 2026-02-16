import React, { useState } from 'react';
import { AUDIT_LOGS } from '../../data/dummyData';

/**
 * Audit trail table with date filters and status filter.
 * Uses dummy AUDIT_LOGS; export button is UI-only.
 */
export default function AuditTable() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = AUDIT_LOGS.filter((log) => {
    if (statusFilter !== 'All' && log.status !== statusFilter) return false;
    // Dummy data has no date field; in real app filter by log.time
    return true;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Modified':
        return 'bg-blue-100 text-blue-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800 font-display">Audit Trail</h2>
        <p className="text-slate-500 text-sm">FDA 21 CFR Part 11 Compliance (dummy data)</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50 flex-wrap">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 py-1.5 border border-slate-200 rounded text-sm"
            aria-label="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2 py-1.5 border border-slate-200 rounded text-sm"
            aria-label="To date"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 border border-slate-200 rounded text-sm"
            aria-label="Filter by status"
          >
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Modified">Modified</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            type="button"
            className="ml-auto px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded hover:bg-slate-200"
          >
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">
                  Time
                </th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">
                  Medications
                </th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">
                  Confidence
                </th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-600">{log.id}</td>
                  <td className="px-4 py-3 text-slate-600">{log.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getStatusClass(log.status)}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{log.meds}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            log.confidence >= 80
                              ? 'bg-green-500'
                              : log.confidence >= 60
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${log.confidence}%` }}
                        />
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
