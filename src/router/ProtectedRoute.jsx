import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';

/**
 * Wraps all protected routes.
 * Redirects to /login if no valid JWT is present in sessionStorage.
 */
export default function ProtectedRoute() {
    const { user } = useCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
