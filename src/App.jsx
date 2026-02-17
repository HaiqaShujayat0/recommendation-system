import React, { useState, useCallback } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PatientSearch from './components/dashboard/PatientSearch';
import DemographicsForm from './components/patient/DemographicsForm';
import ConditionsForm from './components/patient/ConditionsForm';
import LabsForm from './components/patient/LabsForm';
import GlucoseForm from './components/patient/GlucoseForm';
import MedicationsForm from './components/patient/MedicationsForm';
import RecommendationList from './components/recommendations/RecommendationList';
import AuditTable from './components/audit/AuditTable';
import { EMPTY_PATIENT_DATA } from './data/dummyData';

/**
 * Root app: dashboard vs patient flow.
 * - No patient selected → Dashboard (PatientSearch).
 * - Patient selected → Sidebar + main content (demographics → … → recommendations, audit).
 */
export default function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patientData, setPatientData] = useState(EMPTY_PATIENT_DATA);

  const selectPatient = useCallback((patient) => {
    setSelectedPatient(patient);
    setCurrentScreen('demographics');
    setPatientData(EMPTY_PATIENT_DATA);
  }, []);

  const newPatient = useCallback(() => {
    selectPatient({ id: 0, mrNumber: 'NEW', name: 'New Patient' });
  }, [selectPatient]);

  const backToSearch = useCallback(() => {
    setSelectedPatient(null);
    setCurrentScreen('dashboard');
    setPatientData(EMPTY_PATIENT_DATA);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((o) => !o);
  }, []);

  const renderMain = () => {
    if (!selectedPatient) {
      return (
        <PatientSearch onSelectPatient={selectPatient} onNewPatient={newPatient} />
      );
    }

    switch (currentScreen) {
      case 'demographics':
        return (
          <DemographicsForm
            data={patientData}
            setData={setPatientData}
            onNext={() => setCurrentScreen('conditions')}
          />
        );
      case 'conditions':
        return (
          <ConditionsForm
            data={patientData}
            setData={setPatientData}
            onNext={() => setCurrentScreen('labs')}
          />
        );
      case 'labs':
        return (
          <LabsForm
            data={patientData}
            setData={setPatientData}
            onNext={() => setCurrentScreen('glucose')}
          />
        );
      case 'glucose':
        return (
          <GlucoseForm
            data={patientData}
            setData={setPatientData}
            onNext={() => setCurrentScreen('medications')}
          />
        );
      case 'medications':
        return (
          <MedicationsForm
            data={patientData}
            setData={setPatientData}
            onNext={() => setCurrentScreen('recommendations')}
          />
        );
      case 'recommendations':
        return <RecommendationList patientData={patientData} />;
      case 'audit':
        return <AuditTable />;
      default:
        return (
          <DemographicsForm
            data={patientData}
            setData={setPatientData}
            onNext={() => setCurrentScreen('conditions')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ff] flex flex-col">
      <Header
        selectedPatient={selectedPatient}
        onMenuClick={toggleSidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        {selectedPatient && (
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            onBackToSearch={backToSearch}
            patientData={patientData}
            open={sidebarOpen}
            onToggle={toggleSidebar}
          />
        )}
        <main
          className="flex-1 overflow-auto px-4 py-4 md:px-8 md:py-6"
          role="main"
        >
          <div className={`${currentScreen === 'recommendations' ? 'max-w-[1440px]' : 'max-w-6xl'} mx-auto space-y-4`}>
            {renderMain()}
          </div>
        </main>
      </div>
    </div>
  );
}
