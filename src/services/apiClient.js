import { getAuthToken } from './authService';

const TOKEN_KEY = 'glyeral_token';

/**
 * Drop-in replacement for fetch() that automatically:
 *  1. Attaches Authorization: Bearer <token> to every request.
 *  2. Redirects to /login on a 401 (expired / invalid token mid-session).
 *
 * Usage:
 *   const res = await authFetch(`${RULES_URL}/recommend`, { method: 'POST', body: JSON.stringify(payload) });
 */
export async function authFetch(url, options = {}) {
    const token = getAuthToken();

    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // caller-supplied headers win (e.g. multipart/form-data overrides Content-Type)
            ...options.headers,
        },
    });

    if (res.status === 401) {
        // Token expired or revoked mid-session — wipe local state and force re-login
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
    }

    return res;
}
