'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, RefreshCw, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface OTPVerificationModalProps {
    isOpen: boolean;
    email: string;
    onClose: () => void;
    onVerificationComplete: (user: any, token: string) => void;
    onBackToSignup: () => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
    isOpen,
    email,
    onClose,
    onVerificationComplete,
    onBackToSignup
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    
    // Refs for OTP inputs
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setError('');
            setSuccess(false);
            setResendCooldown(0);
            // Focus first input
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Clear error when user starts typing
        if (error) setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        
        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const digits = text.replace(/\D/g, '').slice(0, 6);
                const newOtp = [...otp];
                for (let i = 0; i < 6; i++) {
                    newOtp[i] = digits[i] || '';
                }
                setOtp(newOtp);
                // Focus last filled input or first empty
                const lastIndex = Math.min(digits.length, 5);
                inputRefs.current[lastIndex]?.focus();
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiClient.verifyEmail(code, email);

            if (response.error) {
                setError(response.error);
                // Clear OTP on error
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                return;
            }

            if (response.data) {
                const { user, token } = response.data as { user: any; token: string };
                setSuccess(true);
                
                // Store auth data
                localStorage.setItem('smartwill_token', token);
                localStorage.setItem('smartwill_user', JSON.stringify(user));
                
                // Notify parent component after a brief success display
                setTimeout(() => {
                    onVerificationComplete(user, token);
                }, 1500);
            }

        } catch (err) {
            console.error('Verification failed:', err);
            setError('Verification failed. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
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

            setResendCooldown(60); // 60 second cooldown
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            
        } catch (err) {
            console.error('Resend failed:', err);
            setError('Failed to resend code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    disabled={loading}
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-6">
                    {success ? (
                        // Success State
                        <div className="text-center">
                            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
                            <p className="text-gray-400 mb-4">
                                Your account has been successfully created and verified.
                            </p>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <p className="text-green-400 text-sm">Redirecting to dashboard...</p>
                            </div>
                        </div>
                    ) : (
                        // Verification Form
                        <>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Verify Your Email</h2>
                                <p className="text-gray-400 text-sm">
                                    Enter the 6-digit code sent to
                                </p>
                                <p className="text-blue-400 font-medium text-sm">{email}</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* OTP Input */}
                                <div className="mb-6">
                                    <div className="flex justify-center space-x-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    inputRefs.current[index] = el;
                                                }}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className={`w-12 h-12 text-center text-xl font-bold bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                                                    error
                                                        ? 'border-red-500 focus:ring-red-500/50'
                                                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                                                }`}
                                                disabled={loading}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-500 text-xs mt-2 text-center">
                                        Enter the verification code from your email
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3">
                                        <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || otp.join('').length !== 6}
                                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Verifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="h-5 w-5" />
                                            <span>Verify Code</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Resend Section */}
                            <div className="text-center border-t border-gray-700 pt-4">
                                <p className="text-gray-400 text-sm mb-3">Didn't receive the code?</p>
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={resendLoading || resendCooldown > 0}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                                >
                                    {resendLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : resendCooldown > 0 ? (
                                        <>
                                            <RefreshCw className="h-4 w-4" />
                                            <span>Resend in {resendCooldown}s</span>
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-4 w-4" />
                                            <span>Resend Code</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Back to Signup */}
                            <div className="text-center mt-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={onBackToSignup}
                                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                                    disabled={loading}
                                >
                                    ← Back to Signup
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationModal;