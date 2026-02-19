import React, { useEffect } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { usePatient } from '../context/PatientContext';
import { usePatientsQuery, usePatientQuery } from '../hooks/usePatients';
import { useLatestLabsQuery } from '../hooks/useLabs';
import { useMedsQuery } from '../hooks/useMeds';

/**
 * Layout for all /patient/:patientId/* routes.
 *
 * - Single prefetch point: fetches patient, labs, and meds data here.
 *   All child forms call the same hooks, but hit React Query's warm cache.
 * - Syncs selectedPatient (summary row) into PatientContext for the Header.
 */
export default function PatientLayout() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedPatient, sidebarOpen, setSidebarOpen } = usePatient();

  // ── Prefetch all patient-scoped data here (single fetch point) ──
  const { data: patients = [] } = usePatientsQuery();
  const { data: patientDetail } = usePatientQuery(
    patientId === 'new' ? null : patientId
  );
  // These populate the React Query cache — child forms read from cache, no extra network call
  useLatestLabsQuery(patientId === 'new' ? null : patientId);
  useMedsQuery(patientId === 'new' ? null : patientId);

  const isRecommendations = location.pathname.endsWith('/recommendations');

  // Sync selectedPatient summary into context (for Header display)
  useEffect(() => {
    if (patientId === 'new') {
      setSelectedPatient({ id: 0, mrNumber: 'NEW', name: 'New Patient' });
      return;
    }
    const found = patients.find((p) => String(p.id) === patientId);
    if (!found && patients.length > 0) {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (found) setSelectedPatient(found);
  }, [patientId, patients, setSelectedPatient, navigate]);

  useEffect(() => {
    if (patientId === 'new') return;
    return () => {
      setSelectedPatient(null);
    };
  }, [patientId, setSelectedPatient]);

  return (
    <>
      <Sidebar
        patientDetail={patientDetail}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onBackToSearch={() => navigate('/dashboard')}
      />
      <main className="flex-1 overflow-auto px-4 py-4 md:px-8 md:py-6" role="main">
        <div className={`${isRecommendations ? 'max-w-[1440px]' : 'max-w-6xl'} mx-auto space-y-4`}>
          <Outlet />
        </div>
      </main>
    </>
  );
}
