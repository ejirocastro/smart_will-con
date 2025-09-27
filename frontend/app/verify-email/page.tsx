'use client';

import { useRouter } from 'next/navigation';
import EmailVerification from '@/components/auth/EmailVerification';

export default function VerifyEmailPage() {
    const router = useRouter();

    const handleBackToLogin = () => {
        router.push('/');
    };

    return <EmailVerification onBackToLogin={handleBackToLogin} />;
}