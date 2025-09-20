'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignupData, UserRole } from '@/types';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers = [
    {
        id: '1',
        email: 'owner@example.com',
        password: 'password123',
        role: 'owner' as UserRole,
        name: 'John Owner'
    },
    {
        id: '2',
        email: 'heir@example.com',
        password: 'password123',
        role: 'heir' as UserRole,
        name: 'Sarah Heir'
    },
    {
        id: '3',
        email: 'verifier@example.com',
        password: 'password123',
        role: 'verifier' as UserRole,
        name: 'Mike Verifier'
    }
];

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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Find user in mock database
            const user = mockUsers.find(
                u => u.email === credentials.email && u.password === credentials.password
            );

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Generate mock token
            const token = `mock_token_${user.id}_${Date.now()}`;

            // Create user object without password
            const authUser: User = {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            };

            // Store in localStorage
            localStorage.setItem('smartwill_token', token);
            localStorage.setItem('smartwill_user', JSON.stringify(authUser));

            // Update state
            setAuthState({
                user: authUser,
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

    const signup = async (data: SignupData): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Check if email already exists
            const existingUser = mockUsers.find(u => u.email === data.email);
            if (existingUser) {
                throw new Error('An account with this email already exists');
            }

            // Create new user
            const newUser = {
                id: `user_${Date.now()}`,
                email: data.email,
                password: data.password,
                role: data.role,
                name: data.name || 'New User'
            };

            // Add to mock database (in real app, this would be API call)
            mockUsers.push(newUser);

            // Generate mock token
            const token = `mock_token_${newUser.id}_${Date.now()}`;

            // Create user object without password
            const authUser: User = {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name
            };

            // Store in localStorage
            localStorage.setItem('smartwill_token', token);
            localStorage.setItem('smartwill_user', JSON.stringify(authUser));

            // Update state
            setAuthState({
                user: authUser,
                token,
                isAuthenticated: true
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Signup failed';
            setError(errorMessage);
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

    const clearError = (): void => {
        setError(null);
    };

    const contextValue: AuthContextType = {
        ...authState,
        login,
        signup,
        logout,
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