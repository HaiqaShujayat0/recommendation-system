import React, { useEffect } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { usePatient } from '../context/PatientContext';
import { usePatientsQuery, usePatientQuery } from '../hooks/usePatients';
import { EMPTY_PATIENT_DATA } from '../data/dummyData';

/**
 * Layout for all /patient/:patientId/* routes.
 *
 * - Resolves patientId from URL; syncs selectedPatient and patientData from React Query into PatientContext.
 * - Patient data comes from usePatientQuery (TODO: real API in patientService).
 */
export default function PatientLayout() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedPatient, patientData, setPatientData, sidebarOpen, setSidebarOpen } = usePatient();

  const { data: patients = [] } = usePatientsQuery();
  const { data: queryPatientData, isSuccess: patientDataReady } = usePatientQuery(
    patientId === 'new' ? null : patientId
  );

  const isRecommendations = location.pathname.endsWith('/recommendations');

  useEffect(() => {
    if (patientId === 'new') {
      setSelectedPatient({ id: 0, mrNumber: 'NEW', name: 'New Patient' });
      setPatientData(EMPTY_PATIENT_DATA);
      return;
    }
    const found = patients.find((p) => String(p.id) === patientId);
    if (!found && patients.length > 0) {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (found) setSelectedPatient(found);
  }, [patientId, patients, setSelectedPatient, setPatientData, navigate]);

  useEffect(() => {
    if (patientId === 'new') return;
    if (!patientDataReady || queryPatientData == null) return;
    const { _summary, ...formData } = queryPatientData;
    setPatientData(formData);
  }, [patientId, patientDataReady, queryPatientData, setPatientData]);

  useEffect(() => {
    if (patientId === 'new') return;
    return () => {
      setSelectedPatient(null);
    };
  }, [patientId, setSelectedPatient]);

  return (
    <>
      <Sidebar
        patientData={patientData}
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
