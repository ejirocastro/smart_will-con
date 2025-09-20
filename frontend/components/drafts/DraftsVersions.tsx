'use client';

import React, { useState } from 'react';
import {
    FileText,
    GitBranch,
    Clock,
    Eye,
    Trash2,
    Plus,
    CheckCircle,
    AlertTriangle,
    Calendar,
    User,
    FileCheck,
    RotateCcw,
    Diff
} from 'lucide-react';

interface Draft {
    id: string;
    name: string;
    lastModified: string;
    status: 'in-progress' | 'ready-for-review' | 'needs-attention';
    completionPercentage: number;
    beneficiariesCount: number;
    assetsCount: number;
}

interface Version {
    id: string;
    version: string;
    createdAt: string;
    createdBy: string;
    changes: string[];
    status: 'draft' | 'published' | 'archived';
    description: string;
}

const DraftsVersions: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'drafts' | 'versions' | 'diff'>('drafts');
    const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
    const [compareVersions, setCompareVersions] = useState<{ from: string; to: string }>({ from: '', to: '' });

    const drafts: Draft[] = [
        {
            id: '1',
            name: 'Family Trust Will - Draft 1',
            lastModified: '2 hours ago',
            status: 'in-progress',
            completionPercentage: 65,
            beneficiariesCount: 3,
            assetsCount: 5
        },
        {
            id: '2',
            name: 'Estate Plan Update',
            lastModified: '1 day ago',
            status: 'ready-for-review',
            completionPercentage: 95,
            beneficiariesCount: 2,
            assetsCount: 8
        },
        {
            id: '3',
            name: 'Emergency Will',
            lastModified: '3 days ago',
            status: 'needs-attention',
            completionPercentage: 30,
            beneficiariesCount: 1,
            assetsCount: 2
        }
    ];

    const versions: Version[] = [
        {
            id: 'v1.3',
            version: '1.3',
            createdAt: '2024-01-15',
            createdBy: 'John Doe',
            changes: ['Added new beneficiary: Sarah Johnson', 'Updated BTC holdings to 2.5 BTC', 'Modified distribution percentages'],
            status: 'published',
            description: 'Major update with new beneficiary and asset adjustments'
        },
        {
            id: 'v1.2',
            version: '1.2',
            createdAt: '2024-01-10',
            createdBy: 'John Doe',
            changes: ['Updated STX holdings', 'Added emergency contact information', 'Fixed beneficiary verification status'],
            status: 'archived',
            description: 'Minor updates and bug fixes'
        },
        {
            id: 'v1.1',
            version: '1.1',
            createdAt: '2024-01-05',
            createdBy: 'John Doe',
            changes: ['Initial will creation', 'Added primary beneficiaries', 'Set up asset distribution'],
            status: 'archived',
            description: 'Initial will setup'
        }
    ];

    const getStatusIcon = (status: Draft['status']) => {
        switch (status) {
            case 'in-progress':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'ready-for-review':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'needs-attention':
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
        }
    };

    const getStatusColor = (status: Draft['status']) => {
        switch (status) {
            case 'in-progress':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'ready-for-review':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'needs-attention':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
        }
    };

    const renderDrafts = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Draft Wills</h2>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>New Draft</span>
                </button>
            </div>

            <div className="grid gap-4">
                {drafts.map((draft) => (
                    <div key={draft.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <FileText className="h-6 w-6 text-blue-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{draft.name}</h3>
                                    <p className="text-gray-400 text-sm">Last modified {draft.lastModified}</p>
                                </div>
                            </div>
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${getStatusColor(draft.status)}`}>
                                {getStatusIcon(draft.status)}
                                <span className="text-sm font-medium capitalize">{draft.status.replace('-', ' ')}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">Completion Progress</span>
                                <span className="text-white text-sm font-medium">{draft.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${draft.completionPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-gray-400 text-sm">
                                <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>{draft.beneficiariesCount} beneficiaries</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <FileCheck className="h-4 w-4" />
                                    <span>{draft.assetsCount} assets</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderVersions = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Version History</h2>
                <button 
                    onClick={() => setActiveTab('diff')}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Diff className="h-4 w-4" />
                    <span>Compare Versions</span>
                </button>
            </div>

            <div className="space-y-4">
                {versions.map((version, index) => (
                    <div key={version.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <GitBranch className="h-6 w-6 text-green-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Version {version.version}</h3>
                                    <p className="text-gray-400 text-sm">{version.description}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                version.status === 'published' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                version.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                                {version.status}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
                            <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{version.createdAt}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{version.createdBy}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Changes:</h4>
                            <ul className="space-y-1">
                                {version.changes.map((change, changeIndex) => (
                                    <li key={changeIndex} className="text-gray-400 text-sm flex items-start space-x-2">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{change}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center justify-end space-x-2 mt-4">
                            <button className="flex items-center space-x-1 px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                            </button>
                            {version.status !== 'published' && (
                                <button className="flex items-center space-x-1 px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                                    <RotateCcw className="h-4 w-4" />
                                    <span>Restore</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDiffView = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Compare Versions</h2>
                <button 
                    onClick={() => setActiveTab('versions')}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Versions
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">From Version</label>
                    <select 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        value={compareVersions.from}
                        onChange={(e) => setCompareVersions(prev => ({ ...prev, from: e.target.value }))}
                    >
                        <option value="">Select version</option>
                        {versions.map(version => (
                            <option key={version.id} value={version.id}>Version {version.version}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">To Version</label>
                    <select 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        value={compareVersions.to}
                        onChange={(e) => setCompareVersions(prev => ({ ...prev, to: e.target.value }))}
                    >
                        <option value="">Select version</option>
                        {versions.map(version => (
                            <option key={version.id} value={version.id}>Version {version.version}</option>
                        ))}
                    </select>
                </div>
            </div>

            {compareVersions.from && compareVersions.to && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Differences</h3>
                    <div className="space-y-4">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-red-400 font-medium">- Removed</span>
                            </div>
                            <p className="text-red-300 text-sm">Beneficiary: Mike Johnson (removed)</p>
                            <p className="text-red-300 text-sm">BTC Holdings: 1.5 BTC → (removed)</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-green-400 font-medium">+ Added</span>
                            </div>
                            <p className="text-green-300 text-sm">Beneficiary: Sarah Johnson (added)</p>
                            <p className="text-green-300 text-sm">BTC Holdings: 2.5 BTC (increased)</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-yellow-400 font-medium">~ Modified</span>
                            </div>
                            <p className="text-yellow-300 text-sm">Distribution: Updated percentages for existing beneficiaries</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('drafts')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                        activeTab === 'drafts' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                    <FileText className="h-4 w-4" />
                    <span>Drafts</span>
                </button>
                <button
                    onClick={() => setActiveTab('versions')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                        activeTab === 'versions' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                    <GitBranch className="h-4 w-4" />
                    <span>Versions</span>
                </button>
            </div>

            {/* Content */}
            {activeTab === 'drafts' && renderDrafts()}
            {activeTab === 'versions' && renderVersions()}
            {activeTab === 'diff' && renderDiffView()}
        </div>
    );
};

export default DraftsVersions;