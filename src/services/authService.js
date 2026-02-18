

const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8001';

const TOKEN_KEY = 'glyeral_token';


function decodeJWT(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

/* ─── Token helpers ─── */
function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);    
}

/** Returns the raw JWT string, or null if not logged in. */
export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/* ─── Map raw backend messages to professional UI copy ─── */
function friendlySignupError(raw) {
    if (!raw) return 'Registration failed. Please try again.';
    const msg = raw.toLowerCase();
    if (msg.includes('already exists')) return 'An account with this email already exists. Please sign in instead.';
    if (msg.includes('unexpected')) return 'Something went wrong on our end. Please try again in a moment.';
    return raw;
}

function friendlyLoginError(raw) {
    if (!raw) return 'Sign-in failed. Please try again.';
    const msg = raw.toLowerCase();
    if (msg.includes('invalid password')) return 'The password you entered is incorrect. Please try again.';
    if (msg.includes('user not found')) return 'No account found with this email address. Please check your email or sign up.';
    return raw;
}

/* ─── Build a safe user object from the JWT payload ─── */
function buildUser(payload, fallbackEmail = '') {
    const info = payload?.user || {};
    const firstName = info['user-name'] || '';
    const lastName = info['last_name'] || '';
    return {
        email: info['user-email'] || fallbackEmail,
        name: [firstName, lastName].filter(Boolean).join(' ') || fallbackEmail,
        role: payload?.role_name || 'physician',
    };
}

/* ─── Public API ─── */

/**
 * Register a new physician account.
 * Returns { success: true, user } on success, or { success: false, error } on failure.
 */
export async function signUp({ firstName, lastName, email, password }) {
    try {
        const res = await fetch(`${AUTH_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                role: 1, // 1 = physician
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            // Signup errors use { "error": "..." }
            return { success: false, error: friendlySignupError(data.error) };
        }

        saveToken(data.accessToken);
        const user = buildUser(decodeJWT(data.accessToken), email);
        return { success: true, user };
    } catch {
        return { success: false, error: 'Cannot reach the server. Is the backend running?' };
    }
}

/**
 * Sign in with email + password.
 * Returns { success: true, user } on success, or { success: false, error } on failure.
 */
export async function signIn({ email, password }) {
    try {
        const res = await fetch(`${AUTH_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            // Login errors use { "Code": "BadRequestError", "Message": "..." }
            return { success: false, error: friendlyLoginError(data.Message) };
        }

        saveToken(data.accessToken);
        const user = buildUser(decodeJWT(data.accessToken), email);
        return { success: true, user };
    } catch {
        return { success: false, error: 'Cannot reach the server. Is the backend running?' };
    }
}

/**
 * Read the current session from the stored JWT without an API call.
 * Returns the user object, or null if not logged in / token missing.
 */
export function getSession() {
    const token = getAuthToken();
    if (!token) return null;
    const payload = decodeJWT(token);
    if (!payload) return null;

    // If token is expired, clear it so all subsequent API calls don't silently fail
    if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
    }

    return buildUser(payload);
}

/**
 * Invalidate the token on the backend then wipe local storage.
 */
export async function clearSession() {
    const token = getAuthToken();
    if (token) {
        try {
            await fetch(`${AUTH_BASE}/logout`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            // backend may be unreachable — still clear local state
        }
    }
    localStorage.removeItem(TOKEN_KEY);
}

/* ─── Profile & settings ─── */

function friendlyProfileError(raw) {
    if (!raw) return 'Unable to load your profile. Please try again.';
    return typeof raw === 'string' ? raw : 'Unable to load your profile. Please try again.';
}

function friendlyUpdateError(raw) {
    if (!raw) return 'Unable to save changes. Please try again.';
    return typeof raw === 'string' ? raw : 'Unable to save changes. Please try again.';
}

/**
 * Fetch the logged-in user's profile.
 * Expected shape includes:
 *  id, email, first_name, last_name, role, org_id, is_active, created_at
 */
export async function fetchUserProfile() {
    const token = getAuthToken();
    if (!token) return { success: false, error: 'You are not signed in.' };

    try {
        const res = await fetch(`${AUTH_BASE}/user_profile`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return { success: false, error: friendlyProfileError(data?.error || data?.Message) };
        }

        return { success: true, profile: data };
    } catch {
        return { success: false, error: 'Cannot reach the server. Is the backend running?' };
    }
}

/**
 * Update profile fields (first_name, last_name, email, org_id).
 * Backend: POST /user_profile (Bearer required)
 */
export async function updateUserProfile({ first_name, last_name, email, org_id }) {
    const token = getAuthToken();
    if (!token) return { success: false, error: 'You are not signed in.' };

    try {
        const res = await fetch(`${AUTH_BASE}/user_profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ first_name, last_name, email, org_id }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return { success: false, error: friendlyUpdateError(data?.error || data?.Message) };
        }

        return { success: true, profile: data };
    } catch {
        return { success: false, error: 'Cannot reach the server. Is the backend running?' };
    }
}

/**
 * Update password.
 * Backend: POST /updatepassword (Bearer required)
 * We send both current + new to be safe across implementations.
 */
export async function updatePassword({ current_password, new_password }) {
    const token = getAuthToken();
    if (!token) return { success: false, error: 'You are not signed in.' };

    try {
        const res = await fetch(`${AUTH_BASE}/updatepassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ current_password, new_password }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return { success: false, error: friendlyUpdateError(data?.error || data?.Message) };
        }

        return { success: true, data };
    } catch {
        return { success: false, error: 'Cannot reach the server. Is the backend running?' };
    }
}
