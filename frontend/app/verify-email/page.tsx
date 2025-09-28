'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import EmailVerification from '@/components/auth/EmailVerification';

function EmailVerificationContent() {
    const router = useRouter();

    const handleBackToLogin = () => {
        router.push('/');
    };

    return <EmailVerification onBackToLogin={handleBackToLogin} />;
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <EmailVerificationContent />
        </Suspense>
    );
}