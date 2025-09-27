/**
 * AIAdvisor Component
 * Displays AI-powered recommendations and risk analysis for estate planning
 */
'use client';

import React, { useState, useEffect } from 'react';
import {
    Brain,
    BarChart3,
    Shield,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    Sparkles,
    CheckCircle,
    Clock
} from 'lucide-react';
import { AIRecommendation } from '@/types';
import { getMockAIRecommendations } from '@/data/mockData';

interface RiskMetric {
    /** Name of the risk metric */
    name: string;
    /** Score from 0-100 */
    score: number;
    /** Detailed description of the metric */
    description: string;
    /** Status indicating risk level */
    status: 'good' | 'warning' | 'critical';
}

const AIAdvisor: React.FC = () => {
    // Component state
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'optimization' | 'security' | 'tax'>('all');
    const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);

    /**
     * Load mock AI recommendations and risk metrics on component mount
     */
    useEffect(() => {
        const mockRecommendations = getMockAIRecommendations();
        setRecommendations(mockRecommendations);

        // Initialize risk assessment metrics
        setRiskMetrics([
            { name: 'Asset Diversification', score: 85, description: 'Well diversified across crypto and traditional assets', status: 'good' },
            { name: 'Security Score', score: 72, description: 'Consider adding more recovery guardians', status: 'warning' },
            { name: 'Tax Efficiency', score: 58, description: 'Opportunities for charitable giving optimization', status: 'critical' },
            { name: 'Beneficiary Coverage', score: 90, description: 'All major beneficiaries properly documented', status: 'good' },
            { name: 'Legal Compliance', score: 78, description: 'Review jurisdictional requirements', status: 'warning' }
        ]);
    }, []);

    /**
     * Returns appropriate icon component for recommendation type
     * @param {string} type - The recommendation type
     * @returns {React.ComponentType} Icon component
     */
    const getIcon = (type: string) => {
        switch (type) {
            case 'optimization':
                return BarChart3;
            case 'security':
                return Shield;
            case 'tax':
                return DollarSign;
            default:
                return Brain;
        }
    };

    const getImpactColor = (impact: string): string => {
        switch (impact) {
            case 'high':
                return 'text-red-400 bg-red-500/20';
            case 'medium':
                return 'text-yellow-400 bg-yellow-500/20';
            case 'low':
                return 'text-green-400 bg-green-500/20';
            default:
                return 'text-gray-400 bg-gray-500/20';
        }
    };

    const getRiskColor = (status: string): string => {
        switch (status) {
            case 'good':
                return 'from-green-500 to-blue-500';
            case 'warning':
                return 'from-yellow-500 to-orange-500';
            case 'critical':
                return 'from-red-500 to-pink-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const filteredRecommendations = recommendations.filter(rec =>
        selectedCategory === 'all' || rec.type === selectedCategory
    );

    const overallScore = riskMetrics.length > 0 
        ? Math.round(riskMetrics.reduce((sum, metric) => sum + metric.score, 0) / riskMetrics.length)
        : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
                    <span>AI Estate Advisor</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">Intelligent recommendations powered by blockchain analytics</p>
            </div>

            {/* Overall Score */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-800 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4">
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white text-xl sm:text-2xl font-bold">{overallScore}</span>
                        </div>
                        <Sparkles className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 animate-pulse" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-semibold text-white">Overall Estate Health Score</h3>
                        <p className="text-gray-400 text-sm sm:text-base">Based on comprehensive AI analysis</p>
                        <div className="flex items-center justify-center sm:justify-start mt-2">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-400 text-sm">+5 points this month</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* AI Recommendations */}
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                            <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-500 flex-shrink-0" />
                            <span>Smart Recommendations</span>
                        </h3>
                        <div className="flex items-center space-x-1">
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 animate-pulse" />
                            <span className="text-yellow-500 text-xs sm:text-sm font-medium">Live</span>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        {['all', 'optimization', 'security', 'tax'].map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category as any)}
                                className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all flex-shrink-0 ${selectedCategory === category
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredRecommendations.map((rec) => {
                            const Icon = getIcon(rec.type);

                            return (
                                <div key={rec.id} className="p-3 sm:p-4 rounded-xl bg-black/20 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                                            <div className={`p-2 rounded-lg flex-shrink-0 ${rec.type === 'optimization' ? 'bg-blue-500/20' :
                                                    rec.type === 'security' ? 'bg-green-500/20' :
                                                        'bg-yellow-500/20'
                                                }`}>
                                                <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${rec.type === 'optimization' ? 'text-blue-400' :
                                                        rec.type === 'security' ? 'text-green-400' :
                                                            'text-yellow-400'
                                                    }`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-white font-medium text-sm sm:text-base truncate">{rec.title}</h4>
                                                <p className="text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed">{rec.description}</p>
                                            </div>
                                        </div>
                                        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 self-start ${rec.confidence >= 90 ? 'bg-green-500/20 text-green-400' :
                                                rec.confidence >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {rec.confidence}%
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                                        <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded self-start ${getImpactColor(rec.impact)}`}>
                                            {rec.impact.toUpperCase()} IMPACT
                                        </span>
                                        <button className="text-purple-400 text-xs sm:text-sm hover:text-purple-300 transition-colors flex items-center self-start sm:self-auto">
                                            <span>Apply Suggestion</span>
                                            <CheckCircle className="h-3 w-3 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-800">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500 flex-shrink-0" />
                        <span>Risk Assessment</span>
                    </h3>

                    <div className="space-y-4 sm:space-y-6">
                        {riskMetrics.map((metric, index) => (
                            <div key={index} className="p-3 sm:p-4 rounded-xl bg-black/20 border border-gray-700">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <span className="text-white font-medium text-sm sm:text-base truncate pr-2">{metric.name}</span>
                                    <span className={`font-bold text-sm sm:text-base flex-shrink-0 ${metric.status === 'good' ? 'text-green-400' :
                                            metric.status === 'warning' ? 'text-yellow-400' :
                                                'text-red-400'
                                        }`}>
                                        {metric.score}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mb-2">
                                    <div
                                        className={`bg-gradient-to-r ${getRiskColor(metric.status)} h-1.5 sm:h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${metric.score}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{metric.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0" />
                            <span className="text-purple-400 font-medium text-xs sm:text-sm">Next Analysis</span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm">AI will re-evaluate your portfolio in 24 hours</p>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-800">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 flex-shrink-0" />
                    <span>AI Insights & Trends</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="p-3 sm:p-4 bg-black/20 rounded-xl border border-gray-700">
                        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                            <h4 className="text-white font-medium text-sm sm:text-base">Market Trend</h4>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            STX showing strong growth patterns. Consider increasing allocation by 3-5%.
                        </p>
                    </div>

                    <div className="p-3 sm:p-4 bg-black/20 rounded-xl border border-gray-700">
                        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                            <h4 className="text-white font-medium text-sm sm:text-base">Security Alert</h4>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Multi-signature wallets reduce risk by 78%. Upgrade recommended.
                        </p>
                    </div>

                    <div className="p-3 sm:p-4 bg-black/20 rounded-xl border border-gray-700 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
                            <h4 className="text-white font-medium text-sm sm:text-base">Tax Optimization</h4>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Charitable donations this year could save $2,800 in inheritance taxes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAdvisor;