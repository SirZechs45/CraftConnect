// This file has been migrated to auth.tsx
import type { User as UserType, AuthContextType as AuthContextTypeImport } from './auth.tsx';
import { useAuth as useAuthHook, AuthProvider as AuthProviderComponent, AuthContext as AuthContextValue } from './auth.tsx';

export type User = UserType;
export type AuthContextType = AuthContextTypeImport;
export const useAuth = useAuthHook;
export const AuthProvider = AuthProviderComponent;
export const AuthContext = AuthContextValue;