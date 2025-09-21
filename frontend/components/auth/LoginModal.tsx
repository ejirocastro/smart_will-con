'use client';

import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { LoginCredentials } from '@/types';
import Modal from '@/components/common/Modal';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (credentials: LoginCredentials) => Promise<void>;
    onSwitchToSignup: () => void;
    loading?: boolean;
    error?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
    isOpen, 
    onClose, 
    onLogin, 
    onSwitchToSignup, 
    loading = false, 
    error 
}) => {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Partial<LoginCredentials>>({});

    const validateForm = (): boolean => {
        const errors: Partial<LoginCredentials> = {};

        if (!credentials.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!credentials.password) {
            errors.password = 'Password is required';
        } else if (credentials.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await onLogin(credentials);
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleInputChange = (field: keyof LoginCredentials, value: string) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setCredentials({ email: '', password: '' });
        setValidationErrors({});
        setShowPassword(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
            <div className="p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your SmartWill account</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={credentials.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                                validationErrors.email
                                    ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
                            }`}
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors pr-12 ${
                                    validationErrors.password
                                        ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
                                }`}
                                placeholder="Enter your password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                        )}
                    </div>

                    {/* Demo Accounts */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-blue-700 font-medium text-sm mb-2">Demo Accounts:</h4>
                        <div className="space-y-1 text-xs text-blue-600">
                            <p>Owner: owner@example.com / password123</p>
                            <p>Heir: heir@example.com / password123</p>
                            <p>Verifier: verifier@example.com / password123</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Signing In...</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="h-5 w-5" />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Switch to Signup */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                            disabled={loading}
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;