import { type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { UserProfile } from '../types/user';
export interface AuthContextValue {
    signUp: (args: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => Promise<unknown>;
    signIn: (args: {
        email: string;
        password: string;
    }) => Promise<unknown>;
    signInWithGoogle: () => Promise<unknown>;
    signOut: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    resendVerificationEmail: (email: string) => Promise<void>;
    updateProfile: (updates: unknown) => Promise<unknown>;
    updateUserSettings: (settings: unknown) => Promise<unknown>;
    getUserSettings: () => Promise<unknown>;
    user: User | null;
    userProfile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    error: unknown;
    isAdmin: boolean;
}
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextValue;
