/**
 * CreateWill Component
 * Form for creating and configuring digital wills with beneficiaries and conditions
 */
'use client';

import React, { useState } from 'react';
import { Users, Shield, Plus, Trash2 } from 'lucide-react';
import { RELATIONSHIP_OPTIONS, TIME_LOCK_OPTIONS } from '@/utils/constants';

interface BeneficiaryForm {
    /** Beneficiary's full name */
    name: string;
    /** Relationship to the will owner */
    relationship: string;
    /** Percentage of assets allocated to this beneficiary */
    percentage: number;
    /** Blockchain wallet address for asset distribution */
    walletAddress: string;
}

interface ConditionForm {
    /** Age-based inheritance conditions */
    ageRequirement: {
        /** Whether age requirement is enabled */
        enabled: boolean;
        /** Minimum age required to inherit */
        minAge: number;
    };
    /** Time-based inheritance delay */
    timeLock: {
        /** Whether time lock is enabled */
        enabled: boolean;
        /** Number of days to delay inheritance */
        days: number;
    };
    /** Staged asset release configuration */
    stagedRelease: {
        /** Whether staged release is enabled */
        enabled: boolean;
        /** Number of release stages */
        stages: number;
    };
}

const CreateWill: React.FC = () => {
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForm[]>([
        { name: '', relationship: '', percentage: 0, walletAddress: '' }
    ]);

    const [conditions, setConditions] = useState<ConditionForm>({
        ageRequirement: { enabled: false, minAge: 21 },
        timeLock: { enabled: true, days: 30 },
        stagedRelease: { enabled: false, stages: 1 }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * Adds a new empty beneficiary form to the list
     */
    const addBeneficiary = (): void => {
        setBeneficiaries([
            ...beneficiaries,
            { name: '', relationship: '', percentage: 0, walletAddress: '' }
        ]);
    };

    /**
     * Removes a beneficiary from the list by index
     * @param {number} index - Index of beneficiary to remove
     */
    const removeBeneficiary = (index: number): void => {
        setBeneficiaries(beneficiaries.filter((_, i) => i !== index));
    };

    /**
     * Updates a specific field of a beneficiary
     * @param {number} index - Index of beneficiary to update
     * @param {keyof BeneficiaryForm} field - Field name to update
     * @param {string | number} value - New value for the field
     */
    const updateBeneficiary = (index: number, field: keyof BeneficiaryForm, value: string | number): void => {
        const updated = beneficiaries.map((ben, i) =>
            i === index ? { ...ben, [field]: value } : ben
        );
        setBeneficiaries(updated);
    };

    const updateCondition = (
        category: keyof ConditionForm,
        field: string,
        value: boolean | number
    ): void => {
        setConditions(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const getTotalPercentage = (): number => {
        return beneficiaries.reduce((total, ben) => total + (ben.percentage || 0), 0);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate beneficiaries
        beneficiaries.forEach((ben, index) => {
            if (!ben.name.trim()) {
                newErrors[`beneficiary-${index}-name`] = 'Name is required';
            }
            if (!ben.relationship) {
                newErrors[`beneficiary-${index}-relationship`] = 'Relationship is required';
            }
            if (ben.percentage <= 0) {
                newErrors[`beneficiary-${index}-percentage`] = 'Percentage must be greater than 0';
            }
        });

        // Validate total percentage
        const total = getTotalPercentage();
        if (total !== 100) {
            newErrors.totalPercentage = `Total percentage must equal 100% (currently ${total}%)`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Will created:', { beneficiaries, conditions });
            // Here you would typically send the data to your backend
        }
    };

    const totalPercentage = getTotalPercentage();

    return (
        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4">Create Your Digital Will</h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">Follow these steps to secure your digital legacy</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                {/* Beneficiaries Section */}
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500 flex-shrink-0" />
                            <span>Beneficiaries</span>
                        </h3>
                        <div className="text-xs sm:text-sm">
                            <span className={`font-medium px-3 py-1 rounded-full ${totalPercentage === 100 ? 'bg-green-500/20 text-green-400' : 
                                totalPercentage > 100 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                Total: {totalPercentage}%
                            </span>
                        </div>
                    </div>

                    {errors.totalPercentage && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {errors.totalPercentage}
                        </div>
                    )}

                    <div className="space-y-4">
                        {beneficiaries.map((beneficiary, index) => (
                            <div key={index} className="p-4 bg-black/20 border border-gray-700 rounded-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={beneficiary.name}
                                            onChange={(e) => updateBeneficiary(index, 'name', e.target.value)}
                                            className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter name"
                                        />
                                        {errors[`beneficiary-${index}-name`] && (
                                            <p className="text-red-400 text-xs mt-1">{errors[`beneficiary-${index}-name`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Relationship *
                                        </label>
                                        <select
                                            value={beneficiary.relationship}
                                            onChange={(e) => updateBeneficiary(index, 'relationship', e.target.value)}
                                            className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="">Select relationship</option>
                                            {RELATIONSHIP_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors[`beneficiary-${index}-relationship`] && (
                                            <p className="text-red-400 text-xs mt-1">{errors[`beneficiary-${index}-relationship`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Percentage *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={beneficiary.percentage || ''}
                                            onChange={(e) => updateBeneficiary(index, 'percentage', parseInt(e.target.value) || 0)}
                                            className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                            placeholder="0"
                                        />
                                        {errors[`beneficiary-${index}-percentage`] && (
                                            <p className="text-red-400 text-xs mt-1">{errors[`beneficiary-${index}-percentage`]}</p>
                                        )}
                                    </div>

                                    <div className="flex items-end">
                                        {beneficiaries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBeneficiary(index)}
                                                className="w-full bg-red-600/20 border border-red-500/30 text-red-400 py-3 rounded-xl hover:bg-red-600/30 transition-all flex items-center justify-center"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Wallet Address (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={beneficiary.walletAddress}
                                        onChange={(e) => updateBeneficiary(index, 'walletAddress', e.target.value)}
                                        className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                        placeholder="STX wallet address (optional)"
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addBeneficiary}
                            className="w-full bg-blue-600/20 border border-blue-500/30 text-blue-400 py-3 rounded-xl hover:bg-blue-600/30 transition-all flex items-center justify-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Beneficiary</span>
                        </button>
                    </div>
                </div>

                {/* Conditions Section */}
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-500" />
                        Inheritance Conditions
                    </h3>

                    <div className="space-y-6">
                        {/* Age Requirement */}
                        <div className="p-4 rounded-xl bg-black/20 border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-white">Age Requirement</h4>
                                <input
                                    type="checkbox"
                                    checked={conditions.ageRequirement.enabled}
                                    onChange={(e) => updateCondition('ageRequirement', 'enabled', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Set minimum age for inheritance</p>
                            {conditions.ageRequirement.enabled && (
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={conditions.ageRequirement.minAge}
                                    onChange={(e) => updateCondition('ageRequirement', 'minAge', parseInt(e.target.value) || 21)}
                                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                    placeholder="21"
                                />
                            )}
                        </div>

                        {/* Time Lock */}
                        <div className="p-4 rounded-xl bg-black/20 border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-white">Time Lock</h4>
                                <input
                                    type="checkbox"
                                    checked={conditions.timeLock.enabled}
                                    onChange={(e) => updateCondition('timeLock', 'enabled', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Release assets after inactivity period</p>
                            {conditions.timeLock.enabled && (
                                <select
                                    value={conditions.timeLock.days}
                                    onChange={(e) => updateCondition('timeLock', 'days', parseInt(e.target.value))}
                                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                >
                                    {TIME_LOCK_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Staged Release */}
                        <div className="p-4 rounded-xl bg-black/20 border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-white">Staged Release</h4>
                                <input
                                    type="checkbox"
                                    checked={conditions.stagedRelease.enabled}
                                    onChange={(e) => updateCondition('stagedRelease', 'enabled', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Release inheritance in multiple payments</p>
                            {conditions.stagedRelease.enabled && (
                                <input
                                    type="number"
                                    min="2"
                                    max="10"
                                    value={conditions.stagedRelease.stages}
                                    onChange={(e) => updateCondition('stagedRelease', 'stages', parseInt(e.target.value) || 2)}
                                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                    placeholder="2"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={totalPercentage !== 100}
                    >
                        Create Digital Will
                    </button>
                    {totalPercentage !== 100 && (
                        <p className="text-yellow-400 text-sm mt-2">
                            Total beneficiary percentage must equal 100% to create will
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateWill;