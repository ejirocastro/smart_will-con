/**
 * SocialRecoveryWidget Component
 * Dashboard widget for managing social recovery guardians and wallet recovery
 */
'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle, Clock3 } from 'lucide-react';
import { SocialRecoveryGuardian } from '@/types';
import { getMockSocialRecovery } from '@/data/mockData';

const SocialRecoveryWidget: React.FC = () => {
    const [guardians, setGuardians] = useState<SocialRecoveryGuardian[]>([]);

    useEffect(() => {
        const mockGuardians = getMockSocialRecovery();
        setGuardians(mockGuardians.slice(0, 2));
    }, []);

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-cyan-500" />
                Recovery Guardians
            </h3>

            <div className="space-y-3">
                {guardians.map((guardian) => (
                    <div
                        key={guardian.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-gray-700 hover:border-cyan-500/50 transition-all"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-medium text-xs">
                                    {getInitials(guardian.name)}
                                </span>
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{guardian.name}</p>
                                <p className="text-gray-400 text-xs">{guardian.relationship}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-xs">{guardian.responseTime}</span>
                            {guardian.verified ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                                <Clock3 className="h-4 w-4 text-yellow-500" />
                            )}
                        </div>
                    </div>
                ))}

                <button className="w-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl py-2 text-cyan-400 text-sm font-medium hover:from-cyan-600/30 hover:to-blue-600/30 transition-all">
                    Add Guardian
                </button>
            </div>
        </div>
    );
};

export default SocialRecoveryWidget;