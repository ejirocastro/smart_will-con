'use client';

import React from 'react';
import { Users, Gift, Clock, AlertCircle } from 'lucide-react';

const HeirView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Heir Dashboard</h1>
            </div>

            <div className="text-center py-20">
                <Users className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Your Inheritance Status</h2>
                <p className="text-gray-400 mb-8">View your inheritance details and claim status</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <Gift className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Pending Inheritance</h3>
                        <p className="text-gray-400 text-sm">2 wills awaiting execution</p>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Time Locked</h3>
                        <p className="text-gray-400 text-sm">15 days remaining</p>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Action Required</h3>
                        <p className="text-gray-400 text-sm">Verification needed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeirView;