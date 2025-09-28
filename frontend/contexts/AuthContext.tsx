/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, SignupData } from '@/types';
import { apiClient } from '@/lib/api';
import { walletService } from '@/lib/wallet-service';

interface AuthContextType extends AuthState {
    /** Authenticate user with email and password */
    login: (credentials: LoginCredentials) => Promise<void>;
    /** Register new user account */
    signup: (data: SignupData) => Promise<{ requiresVerification?: boolean; email?: string }>;
    /** Authenticate user with wallet */
    loginWithWallet: () => Promise<void>;
    /** Register new user with wallet */
    signupWithWallet: () => Promise<void>;
    /** Sign out current user and clear session */
    logout: () => void;
    /** Complete user authentication after verification */
    completeAuthentication: (user: any, token: string) => void;
    /** Loading state for async operations */
    loading: boolean;
    /** Current error message if any */
    error: string | null;
    /** Clear current error state */
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


/**
 * Custom hook to access authentication context
 * @returns {AuthContextType} Authentication context with user state and methods
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = () => {
            try {
                const token = localStorage.getItem('smartwill_token');
                const userStr = localStorage.getItem('smartwill_user');

                if (token && userStr) {
                    const user = JSON.parse(userStr);
                    setAuthState({
                        user,
                        token,
                        isAuthenticated: true
                    });
                }
            } catch (err) {
                console.error('Failed to restore session:', err);
                // Clear corrupted data
                localStorage.removeItem('smartwill_token');
                localStorage.removeItem('smartwill_user');
            }
        };

        checkSession();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.login(credentials);

            if (response.error) {
                throw new Error(response.error);
            }

            if (!response.data) {
                throw new Error('Invalid response from server');
            }

            const { user, token } = response.data as { user: any; token: string };

            // Store in localStorage
            localStorage.setItem('smartwill_token', token);
            localStorage.setItem('smartwill_user', JSON.stringify(user));

            // Update state
            setAuthState({
                user,
                token,
                isAuthenticated: true
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (data: SignupData): Promise<{ requiresVerification?: boolean; email?: string }> => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.signup(data);

            if (response.error) {
                throw new Error(response.error);
            }

            if (!response.data) {
                throw new Error('Invalid response from server');
            }

            // Check if response requires email verification
            if ((response.data as any).requiresVerification) {
                // Don't authenticate user yet - they need to verify email first
                setError(null);
                return {
                    requiresVerification: true,
                    email: (response.data as any).email || data.email
                };
            }

            // Legacy path: if user is created immediately (shouldn't happen with email verification)
            const { user, token } = response.data as { user: any; token: string };

            // Store in localStorage
            localStorage.setItem('smartwill_token', token);
            localStorage.setItem('smartwill_user', JSON.stringify(user));

            // Update state
            setAuthState({
                user,
                token,
                isAuthenticated: true
            });

            return {};

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Signup failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginWithWallet = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 AuthContext: Starting wallet login...');
            const response = await walletService.loginWithWallet();

            if (!response.success) {
                throw new Error(response.error || 'Wallet login failed');
            }

            const { user, token } = response;

            console.log('✅ AuthContext: Wallet login successful', { user, hasToken: !!token });

            // Store in localStorage with same keys as email auth
            localStorage.setItem('smartwill_token', token);
            localStorage.setItem('smartwill_user', JSON.stringify(user));

            // Update state
            setAuthState({
                user,
                token,
                isAuthenticated: true
            });

            console.log('✅ AuthContext: User authenticated with wallet');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Wallet login failed';
            setError(errorMessage);
            console.error('❌ AuthContext: Wallet login failed:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signupWithWallet = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 AuthContext: Starting wallet signup...');
            const response = await walletService.registerWithWallet();

            if (!response.success) {
                throw new Error(response.error || 'Wallet signup failed');
            }

            const { user, token } = response;

            console.log('✅ AuthContext: Wallet signup successful', { user, hasToken: !!token });

            // Store in localStorage with same keys as email auth
            localStorage.setItem('smartwill_token', token);
            localStorage.setItem('smartwill_user', JSON.stringify(user));

            // Update state
            setAuthState({
                user,
                token,
                isAuthenticated: true
            });

            console.log('✅ AuthContext: User registered and authenticated with wallet');

        } catch (err) {
            // Handle user cancellation gracefully - don't show error
            if (err instanceof Error && err.message === 'WALLET_CANCELED') {
                console.log('ℹ️ AuthContext: User canceled wallet signup');
                throw new Error('WALLET_CANCELED');
            }

            // Handle wallet already exists - suggest login instead
            if (err instanceof Error && err.message === 'WALLET_ALREADY_EXISTS') {
                setError('This wallet is already registered. Please use "Sign In with Wallet" instead.');
                console.log('ℹ️ AuthContext: Wallet already exists, suggesting login');
                throw new Error('WALLET_ALREADY_EXISTS');
            }

            const errorMessage = err instanceof Error ? err.message : 'Wallet signup failed';
            setError(errorMessage);
            console.error('❌ AuthContext: Wallet signup failed:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = (): void => {
        // Clear localStorage
        localStorage.removeItem('smartwill_token');
        localStorage.removeItem('smartwill_user');

        // Reset state
        setAuthState({
            user: null,
            token: null,
            isAuthenticated: false
        });

        setError(null);
    };

    const completeAuthentication = (user: any, token: string): void => {
        // Update state with verified user
        setAuthState({
            user,
            token,
            isAuthenticated: true
        });
        setError(null);
    };

    const clearError = (): void => {
        setError(null);
    };

    const contextValue: AuthContextType = {
        ...authState,
        login,
        signup,
        loginWithWallet,
        signupWithWallet,
        logout,
        completeAuthentication,
        loading,
        error,
        clearError
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;