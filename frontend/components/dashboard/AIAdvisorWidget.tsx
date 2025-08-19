// src/components/dashboard/AIAdvisorWidget.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { AIRecommendation } from '@/types';
import { getMockAIRecommendations } from '@/data/mockData';

const AIAdvisorWidget: React.FC = () => {
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

    useEffect(() => {
        const mockRecommendations = getMockAIRecommendations();
        setRecommendations(mockRecommendations.slice(0, 2));
    }, []);

    const getImpactColor = (impact: string): string => {
        switch (impact) {
            case 'high':
                return 'bg-red-500/20 text-red-400';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'low':
                return 'bg-green-500/20 text-green-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    AI Advisor
                </h3>
                <div className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                    <span className="text-yellow-500 text-sm font-medium">Active</span>
                </div>
            </div>

            <div className="space-y-3">
                {recommendations.map((rec) => (
                    <div key={rec.id} className="p-3 rounded-xl bg-black/20 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="text-white font-medium text-sm">{rec.title}</h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                                {rec.confidence}%
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs">{rec.description}</p>
                    </div>
                ))}

                <button className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl py-2 text-purple-400 text-sm font-medium hover:from-purple-600/30 hover:to-blue-600/30 transition-all">
                    View All Recommendations
                </button>
            </div>
        </div>
    );
};

export default AIAdvisorWidget;