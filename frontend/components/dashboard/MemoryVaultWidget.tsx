/**
 * MemoryVaultWidget Component
 * Dashboard widget for managing memory boxes and digital legacy content
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Archive, Camera, Mic, File } from 'lucide-react';
import { MemoryBox } from '@/types';
import { getMockMemoryBoxes } from '@/data/mockData';

const MemoryVaultWidget: React.FC = () => {
    const [memoryBoxes, setMemoryBoxes] = useState<MemoryBox[]>([]);

    useEffect(() => {
        const mockBoxes = getMockMemoryBoxes();
        setMemoryBoxes(mockBoxes);
    }, []);

    const getIcon = (type: MemoryBox['type']) => {
        const iconMap = {
            photos: Camera,
            audio: Mic,
            documents: File,
        };
        return iconMap[type];
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-800">
            <h3 className="text-lg md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center">
                <Archive className="h-4 w-4 md:h-5 md:w-5 mr-2 text-amber-500" />
                <span className="truncate">Memory Vault</span>
            </h3>

            <div className="space-y-2 md:space-y-3">
                {memoryBoxes.map((box) => {
                    const Icon = getIcon(box.type);

                    return (
                        <div
                            key={box.id}
                            className="flex items-center justify-between p-2 md:p-3 rounded-lg md:rounded-xl bg-black/20 border border-gray-700 hover:border-amber-500/50 transition-all cursor-pointer"
                        >
                            <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                                <div className="p-1.5 md:p-2 rounded-lg bg-amber-500/20 flex-shrink-0">
                                    <Icon className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-white font-medium text-sm md:text-sm capitalize truncate">{box.type}</p>
                                    <p className="text-gray-400 text-xs truncate">Until {box.unlockDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                                <span className="text-amber-400 font-medium text-sm">{box.count}</span>
                            </div>
                        </div>
                    );
                })}

                <button className="w-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg md:rounded-xl py-2 text-amber-400 text-sm font-medium hover:from-amber-600/30 hover:to-orange-600/30 transition-all">
                    Add Memory
                </button>
            </div>
        </div>
    );
};

export default MemoryVaultWidget;