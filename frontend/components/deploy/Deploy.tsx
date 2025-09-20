'use client';

import React from 'react';
import { Rocket, CheckCircle, AlertTriangle, Code, ExternalLink } from 'lucide-react';

const Deploy: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Deploy Will</h1>
            </div>

            <div className="text-center py-20">
                <Rocket className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Deploy Your Smart Contract</h2>
                <p className="text-gray-400 mb-8">Deploy your will to the Stacks blockchain for execution</p>
                
                <div className="max-w-md mx-auto space-y-4">
                    <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Deploy to Testnet
                    </button>
                    <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                        Deploy to Mainnet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Deploy;