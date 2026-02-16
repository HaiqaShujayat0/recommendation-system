import React, { useState } from 'react';
import { Brain, Loader2, Pill, CheckCircle, Edit3, XCircle } from 'lucide-react';
import { SAMPLE_RECOMMENDATIONS } from '../../data/dummyData';
import MedicationCard from './MedicationCard';

/**
 * Recommendations view: generate button, loading state, list grouped by category.
 * Uses dummy SAMPLE_RECOMMENDATIONS; tracks accept/modify/reject per rec.
 */
export default function RecommendationList({ patientData }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionedRecs, setActionedRecs] = useState({});
  const [modifyingRec, setModifyingRec] = useState(null);

  const generate = () => {
    setIsLoading(true);
    setActionedRecs({});
    setTimeout(() => {
      setRecommendations(SAMPLE_RECOMMENDATIONS);
      setIsLoading(false);
    }, 1200);
  };

  const handleAccept = (rec) => {
    setActionedRecs((prev) => ({
      ...prev,
      [rec.id]: { action: 'accepted', timestamp: new Date().toISOString() },
    }));
  };

  const handleReject = (rec) => {
    setActionedRecs((prev) => ({
      ...prev,
      [rec.id]: { action: 'rejected', timestamp: new Date().toISOString() },
    }));
  };

  const handleModifySave = (modifiedRec) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === modifiedRec.id ? modifiedRec : r))
    );
    setActionedRecs((prev) => ({
      ...prev,
      [modifiedRec.id]: {
        action: 'modified',
        timestamp: new Date().toISOString(),
        notes: modifiedRec.notes,
      },
    }));
    setModifyingRec(null);
  };

  const getActionBadge = (recId) => {
    const action = actionedRecs[recId];
    if (!action) return null;
    const styles = {
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      modified: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    const icons = {
      accepted: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      modified: <Edit3 className="w-3 h-3" />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[action.action]}`}
      >
        {icons[action.action]}
        {action.action.charAt(0).toUpperCase() + action.action.slice(1)}
      </span>
    );
  };

  const grouped = recommendations.reduce((acc, rec) => {
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
          <h2 className="text-xl font-bold text-slate-800 font-display">AI Medication Recommendations</h2>
          <p className="text-slate-500 text-sm">Based on patient profile (dummy data)</p>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Generate Recommendations'}
        </button>
      </div>

      {patientData && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-3 mb-4 flex items-center gap-4 flex-wrap text-sm">
          <span className="text-slate-500">
            HbA1c:{' '}
            <strong
              className={
                parseFloat(patientData.labs?.hba1c) > 7 ? 'text-red-500' : 'text-green-600'
              }
            >
              {patientData.labs?.hba1c || '--'}%
            </strong>
          </span>
          <span className="text-slate-500">
            eGFR:{' '}
            <strong
              className={
                parseFloat(patientData.labs?.egfr) < 60 ? 'text-amber-500' : 'text-green-600'
              }
            >
              {patientData.labs?.egfr || '--'}
            </strong>
          </span>
          <span className="text-slate-500">
            BMI: <strong>{patientData.demographics?.bmi ?? '--'}</strong>
          </span>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-40 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && recommendations.length > 0 && (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, recs]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                {category} ({recs.length})
              </h3>
              <div className="space-y-2">
                {recs.map((rec) => (
                  <MedicationCard
                    key={rec.id}
                    recommendation={rec}
                    isActioned={!!actionedRecs[rec.id]}
                    actionBadge={getActionBadge(rec.id)}
                    onAccept={handleAccept}
                    onModify={(rec) => setModifyingRec(rec)}
                    onReject={handleReject}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && recommendations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center">
          <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-medium text-slate-600 mb-1">No Recommendations Yet</h3>
          <p className="text-slate-400 text-sm mb-4">Click Generate to load sample recommendations</p>
          <button
            type="button"
            onClick={generate}
            className="px-5 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 text-sm"
          >
            Generate Recommendations
          </button>
        </div>
      )}

      {Object.keys(actionedRecs).length > 0 && (
        <div className="mt-6 p-4 bg-slate-100 rounded-xl">
          <h4 className="font-semibold text-slate-700 mb-3 text-sm">Decision Summary</h4>
          <div className="flex gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Accepted: {Object.values(actionedRecs).filter((a) => a.action === 'accepted').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Modified: {Object.values(actionedRecs).filter((a) => a.action === 'modified').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Rejected: {Object.values(actionedRecs).filter((a) => a.action === 'rejected').length}</span>
            </div>
          </div>
          <button
            type="button"
            className="w-full py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-800"
          >
            Submit All Decisions
          </button>
        </div>
      )}
    </div>
  );
}

// Simple modal for "modify" — in production would use dosage options from config
function ModifyModal({ recommendation, onSave, onClose }) {
  const [notes, setNotes] = useState('');
  const [dosage, setDosage] = useState(recommendation.dose || '');

  const handleSave = () => {
    if (!notes.trim()) return;
    onSave({
      ...recommendation,
      dose: dosage || recommendation.dose,
      notes: notes.trim(),
      status: 'modified',
      modifiedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white px-6 py-4 flex-shrink-0">
          <h3 className="text-lg font-bold font-display">Modify Medication</h3>
          <p className="text-primary-200 text-sm">{recommendation.med}</p>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-xs text-primary-600 font-medium mb-1">AI Recommended</p>
            <p className="text-primary-900 font-semibold">{recommendation.dose}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Modified dosage / instructions</label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
              placeholder="e.g. 500mg twice daily"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Modification reason *</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Required for audit trail..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm resize-none"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!notes.trim()}
            className="px-5 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Modification
          </button>
        </div>
      </div>
    </div>
  );
}
