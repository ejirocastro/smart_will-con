// src/components/legacy/LegacyVault.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Archive,
    Camera,
    Mic,
    File,
    Clock3,
    Video,
    Mail,
    Star,
    Gift,
    Plus,
    Calendar,
    Users
} from 'lucide-react';
import { MemoryBox, TimeCapsule } from '@/types';
import { getMockMemoryBoxes, getMockTimeCapsules } from '@/data/mockData';

interface CreateMemoryBoxForm {
    title: string;
    type: 'photos' | 'audio' | 'documents';
    unlockDate: string;
    description: string;
}

interface CreateTimeCapsuleForm {
    title: string;
    recipient: string;
    releaseDate: string;
    type: 'video' | 'letter' | 'document';
    message: string;
}

const LegacyVault: React.FC = () => {
    const [memoryBoxes, setMemoryBoxes] = useState<MemoryBox[]>([]);
    const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
    const [activeTab, setActiveTab] = useState<'memories' | 'capsules' | 'heirlooms'>('memories');
    const [showCreateModal, setShowCreateModal] = useState<'memory' | 'capsule' | null>(null);

    const [memoryForm, setMemoryForm] = useState<CreateMemoryBoxForm>({
        title: '',
        type: 'photos',
        unlockDate: '',
        description: ''
    });

    const [capsuleForm, setCapsuleForm] = useState<CreateTimeCapsuleForm>({
        title: '',
        recipient: '',
        releaseDate: '',
        type: 'letter',
        message: ''
    });

    useEffect(() => {
        setMemoryBoxes(getMockMemoryBoxes());
        setTimeCapsules(getMockTimeCapsules());
    }, []);

    const getMemoryIcon = (type: MemoryBox['type']) => {
        const iconMap = { photos: Camera, audio: Mic, documents: File };
        return iconMap[type];
    };

    const getCapsuleIcon = (type: TimeCapsule['type']) => {
        const iconMap = { video: Video, letter: Mail, document: File };
        return iconMap[type];
    };

    const handleCreateMemory = (e: React.FormEvent) => {
        e.preventDefault();
        const newMemory: MemoryBox = {
            id: memoryBoxes.length + 1,
            ...memoryForm,
            count: 0
        };
        setMemoryBoxes([...memoryBoxes, newMemory]);
        setMemoryForm({ title: '', type: 'photos', unlockDate: '', description: '' });
        setShowCreateModal(null);
    };

    const handleCreateCapsule = (e: React.FormEvent) => {
        e.preventDefault();
        const newCapsule: TimeCapsule = {
            id: timeCapsules.length + 1,
            ...capsuleForm
        };
        setTimeCapsules([...timeCapsules, newCapsule]);
        setCapsuleForm({ title: '', recipient: '', releaseDate: '', type: 'letter', message: '' });
        setShowCreateModal(null);
    };

    const MemoryBoxSection = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center">
                    <Archive className="h-5 w-5 mr-2 text-amber-500" />
                    Memory Boxes
                </h3>
                <button
                    onClick={() => setShowCreateModal('memory')}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all font-medium flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Memory Box</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memoryBoxes.map((box) => {
                    const Icon = getMemoryIcon(box.type);

                    return (
                        <div key={box.id} className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-amber-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <Icon className="h-6 w-6 text-amber-500" />
                                    <span className="text-white font-medium">{box.title}</span>
                                </div>
                                <span className="text-amber-400 text-sm font-medium">{box.count} items</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span>Unlocks: {new Date(box.unlockDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                    <File className="h-4 w-4" />
                                    <span className="capitalize">{box.type}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <button className="w-full bg-amber-500/10 text-amber-400 py-2 rounded-lg hover:bg-amber-500/20 transition-all text-sm font-medium">
                                    Manage Contents
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const TimeCapsuleSection = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center">
                    <Clock3 className="h-5 w-5 mr-2 text-indigo-500" />
                    Time Capsules
                </h3>
                <button
                    onClick={() => setShowCreateModal('capsule')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Create Time Capsule</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {timeCapsules.map((capsule) => {
                    const Icon = getCapsuleIcon(capsule.type);

                    return (
                        <div key={capsule.id} className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <Icon className="h-6 w-6 text-indigo-500" />
                                    <div>
                                        <span className="text-white font-medium block">{capsule.title}</span>
                                        <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                                            <Users className="h-3 w-3" />
                                            <span>To: {capsule.recipient}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span>Releases: {new Date(capsule.releaseDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                    <File className="h-4 w-4" />
                                    <span className="capitalize">{capsule.type}</span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 bg-indigo-500/10 text-indigo-400 py-2 rounded-lg hover:bg-indigo-500/20 transition-all text-sm font-medium">
                                    Edit Content
                                </button>
                                <button className="flex-1 bg-gray-500/10 text-gray-400 py-2 rounded-lg hover:bg-gray-500/20 transition-all text-sm font-medium">
                                    Preview
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const DigitalHeirloomSection = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Digital Heirlooms
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 text-center">
                    <div className="h-20 w-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Gift className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-white font-medium mb-2">Family NFT Collection</h4>
                    <p className="text-gray-400 text-sm mb-4">Create unique digital assets for your family legacy</p>
                    <button className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-2 rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all font-medium">
                        Mint Heirloom
                    </button>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 text-center">
                    <div className="h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Archive className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-white font-medium mb-2">Digital Museum</h4>
                    <p className="text-gray-400 text-sm mb-4">Curate a virtual exhibition of family history</p>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium">
                        Create Museum
                    </button>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 text-center">
                    <div className="h-20 w-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-white font-medium mb-2">Family Tree NFT</h4>
                    <p className="text-gray-400 text-sm mb-4">Interactive blockchain-based genealogy</p>
                    <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all font-medium">
                        Build Tree
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Legacy Vault</h2>
                <p className="text-gray-400">Preserve memories and messages for future generations</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl">
                {[
                    { id: 'memories', label: 'Memory Boxes', icon: Archive },
                    { id: 'capsules', label: 'Time Capsules', icon: Clock3 },
                    { id: 'heirlooms', label: 'Digital Heirlooms', icon: Star }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span className="font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-8">
                {activeTab === 'memories' && <MemoryBoxSection />}
                {activeTab === 'capsules' && <TimeCapsuleSection />}
                {activeTab === 'heirlooms' && <DigitalHeirloomSection />}
            </div>

            {/* Create Memory Box Modal */}
            {showCreateModal === 'memory' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
                        <h3 className="text-xl font-semibold text-white mb-4">Create Memory Box</h3>
                        <form onSubmit={handleCreateMemory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={memoryForm.title}
                                    onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                <select
                                    value={memoryForm.type}
                                    onChange={(e) => setMemoryForm({ ...memoryForm, type: e.target.value as any })}
                                    className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white"
                                >
                                    <option value="photos">Photos</option>
                                    <option value="audio">Audio</option>
                                    <option value="documents">Documents</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Unlock Date</label>
                                <input
                                    type="date"
                                    value={memoryForm.unlockDate}
                                    onChange={(e) => setMemoryForm({ ...memoryForm, unlockDate: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(null)}
                                    className="flex-1 bg-gray-700 text-white py-2 rounded-xl hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-amber-600 text-white py-2 rounded-xl hover:bg-amber-700 transition-all"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Time Capsule Modal */}
            {showCreateModal === 'capsule' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
                        <h3 className="text-xl font-semibold text-white mb-4">Create Time Capsule</h3>
                        <form onSubmit={handleCreateCapsule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={capsuleForm.title}
                                    onChange={(e) => setCapsuleForm({ ...capsuleForm, title: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Recipient</label>
                                <input
                                    type="text"
                                    value={capsuleForm.recipient}
                                    onChange={(e) => setCapsuleForm({ ...capsuleForm, recipient: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
                                <input
                                    type="date"
                                    value={capsuleForm.releaseDate}
                                    onChange={(e) => setCapsuleForm({ ...capsuleForm, releaseDate: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                <select
                                    value={capsuleForm.type}
                                    onChange={(e) => setCapsuleForm({ ...capsuleForm, type: e.target.value as any })}
                                    className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white"
                                >
                                    <option value="letter">Letter</option>
                                    <option value="video">Video</option>
                                    <option value="document">Document</option>
                                </select>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(null)}
                                    className="flex-1 bg-gray-700 text-white py-2 rounded-xl hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-all"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LegacyVault;