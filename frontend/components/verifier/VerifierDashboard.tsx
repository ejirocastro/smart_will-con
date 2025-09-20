'use client';

import React from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

const VerifierDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Verifier Dashboard</h1>
            </div>

            <div className="text-center py-20">
                <CheckCircle className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Verification Center</h2>
                <p className="text-gray-400 mb-8">Review and approve will executions</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <FileText className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Pending Reviews</h3>
                        <p className="text-2xl font-bold text-blue-400">5</p>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">In Progress</h3>
                        <p className="text-2xl font-bold text-yellow-400">3</p>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Approved</h3>
                        <p className="text-2xl font-bold text-green-400">12</p>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Rejected</h3>
                        <p className="text-2xl font-bold text-red-400">1</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifierDashboard;