import { type ReactNode } from 'react';
import type { Session, User, AuthResponse, OAuthResponse } from '@supabase/supabase-js';
import type { UpdateUserProfilePayload, UpdateUserProfileResponse, UpdateUserSettingsPayload, UpdateUserSettingsResponse, GetUserSettingsResponse } from '../types/rpc.types';
import type { UserProfile } from '../types/user';
export interface AuthContextValue {
    signUp: (args: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => Promise<AuthResponse>;
    signIn: (args: {
        email: string;
        password: string;
    }) => Promise<AuthResponse>;
    signInWithGoogle: () => Promise<OAuthResponse>;
    signOut: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    resendVerificationEmail: (email: string) => Promise<void>;
    updateProfile: (updates: UpdateUserProfilePayload['profile_data']) => Promise<UpdateUserProfileResponse>;
    updateUserSettings: (settings: UpdateUserSettingsPayload['settings_data']) => Promise<UpdateUserSettingsResponse>;
    getUserSettings: () => Promise<GetUserSettingsResponse>;
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
