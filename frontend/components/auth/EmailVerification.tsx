'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Mail, RefreshCw, Shield } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface EmailVerificationProps {
    onBackToLogin: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onBackToLogin }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    
    const [verificationState, setVerificationState] = useState<'verifying' | 'success' | 'error' | 'waiting'>('waiting');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Auto-verify if token is in URL
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            verifyEmailToken(token);
        }
    }, [searchParams]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const verifyEmailToken = async (token: string) => {
        setVerificationState('verifying');
        setMessage('Verifying your email address...');

        try {
            const response = await apiClient.verifyEmail(token, '');

            if (response.error) {
                setVerificationState('error');
                setMessage(response.error);
                return;
            }

            if (response.data) {
                const { user, token: authToken } = response.data as { user: any; token: string };
                
                // Store auth data
                localStorage.setItem('smartwill_token', authToken);
                localStorage.setItem('smartwill_user', JSON.stringify(user));

                setVerificationState('success');
                setMessage('Email verified successfully! Welcome to SmartWill!');

                // Redirect to dashboard after a delay
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            }

        } catch (error) {
            console.error('Email verification failed:', error);
            setVerificationState('error');
            setMessage('Failed to verify email. Please try again.');
        }
    };

    const handleResendVerification = async () => {
        if (!email.trim()) {
            setMessage('Please enter your email address');
            return;
        }

        setResendLoading(true);
        
        try {
            const response = await apiClient.resendVerification(email);

            if (response.error) {
                setMessage(response.error);
                return;
            }

            setMessage('Verification email sent! Please check your inbox.');
            setResendCooldown(60); // 60 second cooldown

        } catch (error) {
            console.error('Resend verification failed:', error);
            setMessage('Failed to resend verification email. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const renderContent = () => {
        switch (verificationState) {
            case 'verifying':
                return (
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Verifying Email</h2>
                        <p className="text-gray-400">{message}</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-gray-400 mb-4">{message}</p>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-400 text-sm">Redirecting to dashboard...</p>
                        </div>
                    </div>
                );

            case 'error':
                return (
                    <div className="text-center">
                        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-red-400 mb-6">{message}</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="resend-email" className="block text-gray-400 text-sm font-medium mb-2">
                                    Enter your email to resend verification
                                </label>
                                <input
                                    id="resend-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="your@email.com"
                                />
                            </div>
                            
                            <button
                                onClick={handleResendVerification}
                                disabled={resendLoading || resendCooldown > 0}
                                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resendLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : resendCooldown > 0 ? (
                                    <>
                                        <RefreshCw className="h-5 w-5" />
                                        <span>Resend in {resendCooldown}s</span>
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-5 w-5" />
                                        <span>Resend Verification</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                );

            default: // waiting
                return (
                    <div className="text-center">
                        <Mail className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
                        <p className="text-gray-400 mb-6">
                            We've sent a verification link to your email address. 
                            Click the link to verify your account and complete registration.
                        </p>
                        
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                            <p className="text-blue-400 text-sm">
                                💡 Tip: Check your spam folder if you don't see the email
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="resend-email" className="block text-gray-400 text-sm font-medium mb-2">
                                    Didn't receive the email?
                                </label>
                                <input
                                    id="resend-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter your email to resend"
                                />
                            </div>
                            
                            <button
                                onClick={handleResendVerification}
                                disabled={resendLoading || resendCooldown > 0}
                                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resendLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : resendCooldown > 0 ? (
                                    <>
                                        <RefreshCw className="h-5 w-5" />
                                        <span>Resend in {resendCooldown}s</span>
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-5 w-5" />
                                        <span>Resend Verification</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <button 
                            onClick={onBackToLogin}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                        >
                            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </button>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Email Verification</h1>
                    <p className="text-gray-400 text-sm sm:text-base">Verify your email to complete registration</p>
                </div>

                {/* Content */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    {renderContent()}
                    
                    {/* Message Display */}
                    {message && verificationState === 'waiting' && (
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-400 text-sm text-center">{message}</p>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={onBackToLogin}
                            className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;