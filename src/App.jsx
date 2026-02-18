import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import { PatientProvider, usePatient } from './context/PatientContext';
import { useCurrentUser, useSignOut } from './hooks/useAuth';

/**
 * Inner layout — rendered inside PatientProvider so Header can read selectedPatient.
 */
function AppLayout() {
  const { user } = useCurrentUser();
  const { selectedPatient, setSidebarOpen } = usePatient();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#edf4f8] flex flex-col">
      <Header
        selectedPatient={selectedPatient}
        onMenuClick={() => setSidebarOpen((o) => !o)}
        user={user}
        onSignOut={handleSignOut}
      />
      <div className="flex flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

/**
 * App is the protected layout root.
 * Provides PatientContext to Header + all nested patient routes.
 */
export default function App() {
  return (
    <PatientProvider>
      <AppLayout />
    </PatientProvider>
  );
}
