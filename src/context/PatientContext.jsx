import { createContext, useContext, useState } from 'react';

const PatientContext = createContext(null);

/**
 * UI-only state for the current patient: selected summary row, sidebar toggle.
 * Server state is managed entirely by React Query (see hooks/).
 */
export function PatientProvider({ children }) {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <PatientContext.Provider value={{
            selectedPatient,
            setSelectedPatient,
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
