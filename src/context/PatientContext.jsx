import { createContext, useContext, useState } from 'react';
import { EMPTY_PATIENT_DATA } from '../data/dummyData';

const PatientContext = createContext(null);

/**
 * UI state for current patient: selected summary, form data (synced from React Query in PatientLayout), sidebar.
 * Server state lives in React Query; see hooks/usePatients.js and services/patientService.js (TODO: real API).
 */
export function PatientProvider({ children }) {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientData, setPatientData] = useState(EMPTY_PATIENT_DATA);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <PatientContext.Provider value={{
            selectedPatient,
            setSelectedPatient,
            patientData,
            setPatientData,
            sidebarOpen,
            setSidebarOpen,
        }}>
            {children}
        </PatientContext.Provider>
    );
}

export function usePatient() {
    return useContext(PatientContext);
}
