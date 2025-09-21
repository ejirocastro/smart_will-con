'use client';

import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, Shield, AlertCircle, User, Users, CheckCircle } from 'lucide-react';
import { SignupData, UserRole } from '@/types';
import Modal from '@/components/common/Modal';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignup: (data: SignupData) => Promise<void>;
    onSwitchToLogin: () => void;
    loading?: boolean;
    error?: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ 
    isOpen, 
    onClose, 
    onSignup, 
    onSwitchToLogin, 
    loading = false, 
    error 
}) => {
    const [formData, setFormData] = useState<SignupData>({
        email: '',
        password: '',
        role: 'owner',
        name: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof (SignupData & { confirmPassword: string }), string>>>({});

    const roleOptions = [
        {
            value: 'owner' as UserRole,
            label: 'Will Owner',
            description: 'Create and manage digital wills',
            icon: User,
            color: 'text-blue-500'
        },
        {
            value: 'heir' as UserRole,
            label: 'Heir',
            description: 'View inheritance status and claims',
            icon: Users,
            color: 'text-green-500'
        },
        {
            value: 'verifier' as UserRole,
            label: 'Verifier',
            description: 'Verify and approve will executions',
            icon: CheckCircle,
            color: 'text-purple-500'
        }
    ];

    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof (SignupData & { confirmPassword: string }), string>> = {};

        if (!formData.name?.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.role) {
            errors.role = 'Please select a role';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await onSignup(formData);
        } catch (err) {
            console.error('Signup failed:', err);
        }
    };

    const handleInputChange = (field: keyof SignupData | 'confirmPassword', value: string) => {
        if (field === 'confirmPassword') {
            setConfirmPassword(value);
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        
        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setFormData({ email: '', password: '', role: 'owner', name: '' });
        setConfirmPassword('');
        setValidationErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="lg">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join SmartWill to secure your digital legacy</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                                validationErrors.name
                                    ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
                            }`}
                            placeholder="Enter your full name"
                            disabled={loading}
                        />
                        {validationErrors.name && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
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

                    {/* Role Selection */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-3">
                            Account Type
                        </label>
                        <div className="space-y-3">
                            {roleOptions.map((role) => {
                                const IconComponent = role.icon;
                                return (
                                    <label
                                        key={role.value}
                                        className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                                            formData.role === role.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 bg-white'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={formData.role === role.value}
                                            onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                                            className="sr-only"
                                            disabled={loading}
                                        />
                                        <IconComponent className={`h-6 w-6 ${role.color} flex-shrink-0 mt-0.5`} />
                                        <div className="flex-1">
                                            <h4 className="text-gray-900 font-medium">{role.label}</h4>
                                            <p className="text-gray-600 text-sm mt-1">{role.description}</p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            formData.role === role.value
                                                ? 'border-blue-500'
                                                : 'border-gray-300'
                                        }`}>
                                            {formData.role === role.value && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                        {validationErrors.role && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>
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
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors pr-12 ${
                                    validationErrors.password
                                        ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
                                }`}
                                placeholder="Create a password"
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

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors pr-12 ${
                                    validationErrors.confirmPassword
                                        ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
                                }`}
                                placeholder="Confirm your password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={loading}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {validationErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                        )}
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
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5" />
                                <span>Create Account</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Switch to Login */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                            disabled={loading}
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default SignupModal;