import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, signIn, signUp, clearSession } from '../services/authService';

/**
 * Returns the currently authenticated user from the cached JWT.
 * No network call — reads sessionStorage (via getSession) synchronously via initialData.
 * user is null when logged out.
 */
export function useCurrentUser() {
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: getSession,
        initialData: getSession,   // synchronous seed — no loading flash
        staleTime: Infinity,       // never auto-refetch; we manage cache manually
        retry: false,
    });
    return { user: user ?? null };
}

/**
 * Sign-in mutation. On success, pushes the user object directly into
 * the React Query cache so all useCurrentUser() subscribers update instantly.
 *
 * const signIn = useSignIn();
 * const result = await signIn.mutateAsync({ email, password });
 * if (result.success) navigate('/dashboard');
 * else setError(result.error);
 */
export function useSignIn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signIn,
        onSuccess: (result) => {
            if (result.success) {
                queryClient.setQueryData(['user'], result.user);
            }
        },
    });
}

/**
 * Sign-up mutation — same cache-update pattern as useSignIn.
 */
export function useSignUp() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signUp,
        onSuccess: (result) => {
            if (result.success) {
                queryClient.setQueryData(['user'], result.user);
            }
        },
    });
}

/**
 * Sign-out mutation — clears server session then sets user to null in cache.
 */
export function useSignOut() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clearSession,
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
        },
    });
}
