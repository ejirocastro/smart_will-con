'use client';

import React, { useState } from 'react';
import {
    Eye,
    FileText,
    Code,
    Download,
    Copy,
    CheckCircle,
    AlertTriangle,
    User,
    Wallet,
    Calendar,
    Shield,
    Settings,
    Layers,
    Database
} from 'lucide-react';

import { WillData, Beneficiary, Assets, WillCondition } from '@/types';

interface ExtendedBeneficiary extends Beneficiary {
    walletAddress: string;
}

interface Owner {
    name: string;
    walletAddress: string;
    createdAt: string;
    lastUpdated: string;
}

interface AssetDetails {
    stxHoldings: { amount: string; usdValue: string };
    btcHoldings: { amount: string; usdValue: string };
    nftCollections: Array<{ name: string; count: number; estimatedValue: string }>;
}

interface ExtendedAssets extends Assets {
    details: AssetDetails;
}

interface ExecutionDetails {
    contractAddress: string;
    networkFee: string;
    estimatedGas: string;
}

interface ExtendedWillData {
    id: string;
    owner: Owner;
    beneficiaries: ExtendedBeneficiary[];
    assets: ExtendedAssets;
    conditions: WillCondition[];
    executionDetails: ExecutionDetails;
}

interface ReviewPreviewProps {
    willData?: WillData; // Use the existing WillData type from props
}

const ReviewPreview: React.FC<ReviewPreviewProps> = ({ willData }) => {
    const [activeView, setActiveView] = useState<'summary' | 'json' | 'contract'>('summary');
    const [copied, setCopied] = useState<string | null>(null);

    // Function to convert basic WillData to extended format
    const extendWillData = (basicWillData?: WillData): ExtendedWillData => {
        const generateWalletAddress = (name: string): string => {
            // Generate a mock Stacks wallet address based on name
            const hash = name.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
            const addresses = [
                'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
                'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
                'SP1G4C4HEDQV8YNJ3ZXQJ5P4K2N7RX8QJ5SVTE',
                'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335'
            ];
            return addresses[Math.abs(hash) % addresses.length];
        };

        const currentDate = new Date().toISOString();
        
        // Safe parsing function for numbers
        const safeParseFloat = (value: string | undefined, fallback: number): number => {
            if (!value) return fallback;
            const parsed = parseFloat(value.replace(/,/g, ''));
            return isNaN(parsed) ? fallback : parsed;
        };
        
        return {
            id: "will-001",
            owner: {
                name: "John Doe",
                walletAddress: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
                createdAt: currentDate,
                lastUpdated: currentDate
            },
            beneficiaries: basicWillData?.beneficiaries.map(b => ({
                ...b,
                walletAddress: generateWalletAddress(b.name)
            })) || [],
            assets: {
                ...basicWillData?.assets || { stx: '0', btc: '0', nfts: 0, totalValue: '$0' },
                details: {
                    stxHoldings: {
                        amount: basicWillData?.assets?.stx || '10000',
                        usdValue: `$${(safeParseFloat(basicWillData?.assets?.stx, 10000) * 1.5).toLocaleString()}`
                    },
                    btcHoldings: {
                        amount: basicWillData?.assets?.btc || '2.5',
                        usdValue: `$${(safeParseFloat(basicWillData?.assets?.btc, 2.5) * 42000).toLocaleString()}`
                    },
                    nftCollections: [
                        { name: "CryptoPunks", count: 2, estimatedValue: "$3,200" },
                        { name: "Stacks Bulls", count: 5, estimatedValue: "$1,500" },
                        { name: "Megapont", count: 5, estimatedValue: "$750" }
                    ]
                }
            },
            conditions: basicWillData?.conditions || [
                {
                    type: "time-lock",
                    description: "Assets locked for 30 days after death verification",
                    status: "active"
                },
                {
                    type: "multi-sig",
                    description: "Requires 2 of 3 guardians to approve distribution",
                    status: "active"
                }
            ],
            executionDetails: {
                contractAddress: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.smart-will-v1",
                networkFee: "0.001 STX",
                estimatedGas: "25,000 units"
            }
        };
    };

    // Get extended will data
    const currentData = extendWillData(willData);

    // Fallback mock will data for demonstration when no real data
    const mockWillData: ExtendedWillData = {
        id: "will-001",
        owner: {
            name: "John Doe",
            walletAddress: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
            createdAt: "2024-01-15T10:30:00Z",
            lastUpdated: "2024-01-20T14:22:00Z"
        },
        beneficiaries: [
            {
                id: 1,
                name: "Sarah Johnson",
                relationship: "Daughter",
                walletAddress: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
                percentage: 50,
                verified: true
            },
            {
                id: 2,
                name: "Michael Doe",
                relationship: "Son",
                walletAddress: "SP1G4C4HEDQV8YNJ3ZXQJ5P4K2N7RX8QJ5SVTE",
                percentage: 50,
                verified: true
            }
        ],
        assets: {
            stx: "10,000",
            btc: "2.5",
            nfts: 12,
            totalValue: "$125,450.00",
            details: {
                stxHoldings: {
                    amount: "10000",
                    usdValue: "$15,000"
                },
                btcHoldings: {
                    amount: "2.5",
                    usdValue: "$105,000"
                },
                nftCollections: [
                    { name: "CryptoPunks", count: 2, estimatedValue: "$3,200" },
                    { name: "Stacks Bulls", count: 5, estimatedValue: "$1,500" },
                    { name: "Megapont", count: 5, estimatedValue: "$750" }
                ]
            }
        },
        conditions: [
            {
                type: "time-lock",
                description: "Assets locked for 30 days after death verification",
                status: "active"
            },
            {
                type: "multi-sig",
                description: "Requires 2 of 3 guardians to approve distribution",
                status: "active"
            }
        ],
        executionDetails: {
            contractAddress: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.smart-will-v1",
            networkFee: "0.001 STX",
            estimatedGas: "25,000 units"
        }
    };

    // Remove this line since we now use extendWillData function

    const handleCopy = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const generateJsonData = () => {
        return JSON.stringify(currentData, null, 2);
    };

    const generateClarityContract = () => {
        return `;;  Smart Will Contract v1.0
;;  Auto-generated from SmartWill platform

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-invalid-beneficiary (err u102))

;; Data Variables
(define-data-var will-owner principal '${currentData.owner.walletAddress})
(define-data-var is-executed bool false)
(define-data-var death-verified bool false)
(define-data-var time-lock-duration uint u2592000) ;; 30 days in seconds

;; Beneficiaries Map
(define-map beneficiaries 
    { beneficiary: principal }
    { percentage: uint, verified: bool }
)

;; Initialize beneficiaries
${currentData.beneficiaries.map(beneficiary => 
    `(map-set beneficiaries 
        { beneficiary: '${beneficiary.walletAddress} }
        { percentage: u${beneficiary.percentage}, verified: ${beneficiary.verified} }
    )`
).join('\n')}

;; Assets tracking
(define-data-var total-stx-assets uint u${currentData.assets.stx.replace(',', '')})
(define-data-var total-btc-assets uint u${Math.floor(parseFloat(currentData.assets.btc) * 100000000)}) ;; satoshis

;; Death verification function (called by authorized guardians)
(define-public (verify-death)
    (begin
        (asserts! (is-authorized-guardian tx-sender) err-not-authorized)
        (var-set death-verified true)
        (ok true)
    )
)

;; Execute will distribution
(define-public (execute-will)
    (let (
        (beneficiary-data (unwrap! (map-get? beneficiaries { beneficiary: tx-sender }) err-invalid-beneficiary))
        (percentage (get percentage beneficiary-data))
        (stx-amount (/ (* (var-get total-stx-assets) percentage) u100))
    )
        (asserts! (var-get death-verified) (err u103))
        (asserts! (not (var-get is-executed)) (err u104))
        
        ;; Transfer STX assets
        (try! (stx-transfer? stx-amount (var-get will-owner) tx-sender))
        
        ;; Update execution status
        (var-set is-executed true)
        (ok stx-amount)
    )
)

;; Guardian authorization check
(define-private (is-authorized-guardian (user principal))
    (or 
        (is-eq user '${currentData.beneficiaries[0]?.walletAddress || 'SP000000000000000000002Q6VF78'})
        (is-eq user '${currentData.beneficiaries[1]?.walletAddress || 'SP000000000000000000002Q6VF78'})
        (is-eq user contract-owner)
    )
)

;; Read-only functions
(define-read-only (get-beneficiary-info (beneficiary principal))
    (map-get? beneficiaries { beneficiary: beneficiary })
)

(define-read-only (get-will-status)
    {
        executed: (var-get is-executed),
        death-verified: (var-get death-verified),
        total-stx: (var-get total-stx-assets)
    }
)

(define-read-only (get-contract-info)
    {
        owner: (var-get will-owner),
        beneficiaries-count: u${currentData.beneficiaries.length},
        time-lock: (var-get time-lock-duration)
    }
)`;
    };

    const renderSummaryView = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Will Summary</h2>
                <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-400 text-sm font-medium">Ready for Execution</span>
                </div>
            </div>

            {/* Owner Information */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    Will Owner
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white font-medium">{currentData.owner.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Wallet Address</p>
                        <p className="text-white font-mono text-sm">{currentData.owner.walletAddress}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Created</p>
                        <p className="text-white">{new Date(currentData.owner.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Last Updated</p>
                        <p className="text-white">{new Date(currentData.owner.lastUpdated).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Beneficiaries */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-500" />
                    Beneficiaries ({currentData.beneficiaries.length})
                </h3>
                <div className="space-y-4">
                    {currentData.beneficiaries.map((beneficiary: ExtendedBeneficiary) => (
                        <div key={beneficiary.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                    <span className="text-white font-medium">{beneficiary.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">{beneficiary.name}</p>
                                    <p className="text-gray-400 text-sm">{beneficiary.relationship}</p>
                                    <p className="text-gray-400 text-xs font-mono">{beneficiary.walletAddress}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-400 font-bold text-lg">{beneficiary.percentage}%</p>
                                <div className="flex items-center space-x-1">
                                    {beneficiary.verified ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    )}
                                    <span className="text-gray-400 text-xs">
                                        {beneficiary.verified ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Assets Overview */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-yellow-500" />
                    Assets Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm">STX Holdings</p>
                        <p className="text-white text-xl font-bold">{currentData.assets.stx} STX</p>
                        <p className="text-gray-400 text-sm">{currentData.assets.details.stxHoldings.usdValue}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm">BTC Holdings</p>
                        <p className="text-white text-xl font-bold">{currentData.assets.btc} BTC</p>
                        <p className="text-gray-400 text-sm">{currentData.assets.details.btcHoldings.usdValue}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm">NFT Collection</p>
                        <p className="text-white text-xl font-bold">{currentData.assets.nfts} Items</p>
                        <p className="text-gray-400 text-sm">Multiple Collections</p>
                    </div>
                </div>
                <div className="text-center p-4 bg-blue-600/20 border border-blue-600/40 rounded-lg">
                    <p className="text-blue-400 text-sm font-medium">Total Estimated Value</p>
                    <p className="text-white text-2xl font-bold">{currentData.assets.totalValue}</p>
                </div>
            </div>

            {/* Execution Conditions */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-purple-500" />
                    Execution Conditions
                </h3>
                <div className="space-y-3">
                    {currentData.conditions.map((condition: WillCondition, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div>
                                <p className="text-white font-medium capitalize">{condition.type.replace('-', ' ')}</p>
                                <p className="text-gray-400 text-sm">{condition.description}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                condition.status === 'active' 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                                {condition.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contract Information */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-500" />
                    Smart Contract Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400 text-sm">Contract Address</p>
                        <p className="text-white font-mono text-sm">{currentData.executionDetails.contractAddress}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Network Fee</p>
                        <p className="text-white">{currentData.executionDetails.networkFee}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Estimated Gas</p>
                        <p className="text-white">{currentData.executionDetails.estimatedGas}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderJsonView = () => {
        const jsonData = generateJsonData();
        
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">JSON Data Format</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleCopy(jsonData, 'json')}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {copied === 'json' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span>{copied === 'json' ? 'Copied!' : 'Copy JSON'}</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">
                            This JSON format can be used for:
                        </p>
                        <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                            <li>API integrations and external services</li>
                            <li>Development and testing environments</li>
                            <li>Audit trails and compliance reporting</li>
                            <li>Backup and data migration purposes</li>
                        </ul>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                            {jsonData}
                        </pre>
                    </div>
                </div>
            </div>
        );
    };

    const renderContractView = () => {
        const contractCode = generateClarityContract();
        
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Clarity Smart Contract</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleCopy(contractCode, 'contract')}
                            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            {copied === 'contract' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span>{copied === 'contract' ? 'Copied!' : 'Copy Code'}</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            <Download className="h-4 w-4" />
                            <span>Download .clar</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">
                            This Clarity smart contract will be deployed to the Stacks blockchain and includes:
                        </p>
                        <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                            <li>Beneficiary management and verification</li>
                            <li>Asset distribution logic with percentage-based allocation</li>
                            <li>Multi-signature guardian authorization system</li>
                            <li>Time-lock mechanisms for security</li>
                            <li>Death verification workflows</li>
                        </ul>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                        <pre className="text-blue-400 text-sm font-mono whitespace-pre-wrap">
                            {contractCode}
                        </pre>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                            <h4 className="text-yellow-400 font-medium">Important Notice</h4>
                            <p className="text-yellow-300 text-sm mt-1">
                                This contract is auto-generated based on your will configuration. Please review carefully 
                                and consider having it audited by a smart contract security expert before deployment to mainnet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-800 p-1 rounded-lg">
                <button
                    onClick={() => setActiveView('summary')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 sm:px-4 rounded-md transition-colors ${
                        activeView === 'summary' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Summary</span>
                </button>
                <button
                    onClick={() => setActiveView('json')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 sm:px-4 rounded-md transition-colors ${
                        activeView === 'json' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                    <Database className="h-4 w-4" />
                    <span className="text-sm sm:text-base">JSON Data</span>
                </button>
                <button
                    onClick={() => setActiveView('contract')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 sm:px-4 rounded-md transition-colors ${
                        activeView === 'contract' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                    <Code className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Contract</span>
                </button>
            </div>

            {/* Content */}
            {activeView === 'summary' && renderSummaryView()}
            {activeView === 'json' && renderJsonView()}
            {activeView === 'contract' && renderContractView()}
        </div>
    );
};

export default ReviewPreview;