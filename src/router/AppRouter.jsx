import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import App from '../App';
import AuthLayout from '../components/auth/AuthLayout';
import PatientSearch from '../components/dashboard/PatientSearch';
import DemographicsForm from '../components/patient/DemographicsForm';
import ConditionsForm from '../components/patient/ConditionsForm';
import LabsForm from '../components/patient/LabsForm';
import GlucoseForm from '../components/patient/GlucoseForm';
import MedicationsForm from '../components/patient/MedicationsForm';
import RecommendationList from '../components/recommendations/RecommendationList';
import AuditTable from '../components/audit/AuditTable';
import ProtectedRoute from './ProtectedRoute';
import PatientLayout from './PatientLayout';

const router = createBrowserRouter([
    // ── Public ──────────────────────────────────────────────
    {
        path: '/login',
        element: <AuthLayout />,
    },

    // ── Protected shell ─────────────────────────────────────
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                element: <App />,          // Header + PatientProvider + <Outlet>
                children: [
                    // / → /dashboard
                    { index: true, element: <Navigate to="/dashboard" replace /> },

                    // Dashboard (patient list)
                    { path: 'dashboard', element: <PatientSearch /> },

                    // Patient wizard — /patient/:patientId/*
                    {
                        path: 'patient/:patientId',
                        element: <PatientLayout />,   // Sidebar + <Outlet>
                        children: [
                            // /patient/:id  → /patient/:id/demographics
                            { index: true, element: <Navigate to="demographics" replace /> },
                            { path: 'demographics',    element: <DemographicsForm /> },
                            { path: 'conditions',      element: <ConditionsForm /> },
                            { path: 'labs',            element: <LabsForm /> },
                            { path: 'glucose',         element: <GlucoseForm /> },
                            { path: 'medications',     element: <MedicationsForm /> },
                            { path: 'recommendations', element: <RecommendationList /> },
                            { path: 'audit',           element: <AuditTable /> },
                        ],
                    },
                ],
            },
        ],
    },

    // Catch-all → root (which redirects to /dashboard or /login)
    { path: '*', element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
