'use client';

import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface EmailCodeVerificationProps {
    email: string;
    onVerificationComplete: (user: any, token: string) => void;
    onBackToSignup: () => void;
    onBackToLogin: () => void;
}

const EmailCodeVerification: React.FC<EmailCodeVerificationProps> = ({ 
    email, 
    onVerificationComplete, 
    onBackToSignup,
    onBackToLogin 
}) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!code.trim() || code.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiClient.verifyEmail(code, email);

            if (response.error) {
                setError(response.error);
                return;
            }

            if (response.data) {
                const { user, token } = response.data as { user: any; token: string };
                setSuccess(true);
                
                // Store auth data
                localStorage.setItem('smartwill_token', token);
                localStorage.setItem('smartwill_user', JSON.stringify(user));
                
                // Notify parent component
                setTimeout(() => {
                    onVerificationComplete(user, token);
                }, 1500);
            }

        } catch (err) {
            console.error('Verification failed:', err);
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendLoading(true);
        setError('');

        try {
            const response = await apiClient.resendVerification(email);

            if (response.error) {
                setError(response.error);
                return;
            }

            setError('');
            setResendCooldown(60); // 60 second cooldown
            
        } catch (err) {
            console.error('Resend failed:', err);
            setError('Failed to resend code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
        setCode(value);
        if (error) setError(''); // Clear error when user starts typing
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
                <div className="max-w-md w-full text-center">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-gray-400 mb-4">
                            Your account has been successfully created and verified.
                        </p>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-400 text-sm">Redirecting to dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Verify Your Email</h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                        We've sent a 6-digit verification code to
                    </p>
                    <p className="text-blue-400 font-medium">{email}</p>
                </div>

                {/* Verification Form */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Code Input */}
                        <div>
                            <label htmlFor="code" className="block text-gray-400 text-sm font-medium mb-2">
                                Verification Code
                            </label>
                            <input
                                id="code"
                                type="text"
                                value={code}
                                onChange={handleCodeChange}
                                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors text-center text-2xl tracking-widest ${
                                    error
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                                }`}
                                placeholder="000000"
                                maxLength={6}
                                disabled={loading}
                            />
                            <p className="text-gray-500 text-xs mt-1 text-center">
                                Enter the 6-digit code from your email
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3">
                                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || code.length !== 6}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <Mail className="h-5 w-5" />
                                    <span>Verify Email</span>
                                </>
                            )}
                        </button>

                        {/* Resend Code */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendLoading || resendCooldown > 0}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resendLoading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </span>
                                ) : resendCooldown > 0 ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <RefreshCw className="h-4 w-4" />
                                        <span>Resend in {resendCooldown}s</span>
                                    </span>
                                ) : (
                                    'Resend Code'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Back Options */}
                    <div className="mt-6 pt-6 border-t border-gray-700 text-center space-y-2">
                        <p className="text-gray-400 text-sm">Need to make changes?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={onBackToSignup}
                                className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                            >
                                ← Back to Signup
                            </button>
                            <span className="text-gray-600">|</span>
                            <button
                                onClick={onBackToLogin}
                                className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailCodeVerification;