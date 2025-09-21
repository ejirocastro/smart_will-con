'use client';

import React, { useState, useEffect } from 'react';
import {
    Shield,
    ArrowRight,
    Check,
    Star,
    Lock,
    Users,
    Brain,
    ChevronDown,
    Phone,
    Mail,
    MessageCircle,
    X,
    Plus,
    Minus,
    Play,
    Award,
    Globe,
    Zap,
    Code,
    Database,
    TrendingUp,
    Clock,
    Heart,
    Eye,
    MousePointer,
    Menu
} from 'lucide-react';

interface LandingPageProps {
    onGetStarted?: () => void;
    onSignInClick?: () => void;
    onSignUpClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignInClick, onSignUpClick }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [navbarBlur, setNavbarBlur] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "Hi! I'm SmartWill AI. How can I help you with your digital legacy planning?", isBot: true }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [blockchainNodes, setBlockchainNodes] = useState<Array<{
        id: number;
        x: number;
        y: number;
        size: number;
        pulseDelay: number;
        moveSpeed: number;
        direction: number;
    }>>([]);
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        size: number;
        opacity: number;
        speed: number;
        direction: number;
    }>>([]);

    useEffect(() => {
        setIsVisible(true);

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setNavbarBlur(window.scrollY > 50);
        };

        // Initialize blockchain nodes
        const initNodes = () => {
            const nodes = [];
            const nodeCount = window.innerWidth < 768 ? 6 : 12;
            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 8 + 4,
                    pulseDelay: Math.random() * 4,
                    moveSpeed: Math.random() * 0.5 + 0.2,
                    direction: Math.random() * Math.PI * 2
                });
            }
            setBlockchainNodes(nodes);
        };

        // Initialize particles
        const initParticles = () => {
            const newParticles = [];
            const particleCount = window.innerWidth < 768 ? 20 : 50;
            for (let i = 0; i < particleCount; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.6 + 0.2,
                    speed: Math.random() * 0.3 + 0.1,
                    direction: Math.random() * Math.PI * 2
                });
            }
            setParticles(newParticles);
        };

        initNodes();
        initParticles();

        // Animation loop
        const animateNodes = () => {
            setBlockchainNodes(prevNodes =>
                prevNodes.map(node => ({
                    ...node,
                    x: (node.x + Math.cos(node.direction) * node.moveSpeed + 100) % 100,
                    y: (node.y + Math.sin(node.direction) * node.moveSpeed + 100) % 100
                }))
            );
        };

        const animateParticles = () => {
            setParticles(prevParticles =>
                prevParticles.map(particle => ({
                    ...particle,
                    x: (particle.x + Math.cos(particle.direction) * particle.speed + 100) % 100,
                    y: (particle.y + Math.sin(particle.direction) * particle.speed + 100) % 100
                }))
            );
        };

        const animationInterval = setInterval(() => {
            animateNodes();
            animateParticles();
        }, 50);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            initNodes();
            initParticles();
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(animationInterval);
        };
    }, []);

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage = { id: chatMessages.length + 1, text: inputMessage, isBot: false };
            setChatMessages([...chatMessages, newMessage]);
            setInputMessage('');

            // Simulate AI response
            setTimeout(() => {
                const response = {
                    id: chatMessages.length + 2,
                    text: "I'd be happy to help you understand how SmartWill works! You can create a secure digital will in minutes, protect your crypto assets, and ensure your family has access when needed. Would you like to know more about any specific feature?",
                    isBot: true
                };
                setChatMessages(prev => [...prev, response]);
            }, 1000);
        }
    };

    const faqData = [
        {
            question: "How secure is SmartWill?",
            answer: "SmartWill uses military-grade 256-bit encryption and blockchain technology to ensure your digital legacy is completely secure. All data is encrypted before storage and distributed across multiple secure nodes."
        },
        {
            question: "What happens to my digital assets?",
            answer: "Your digital assets are protected by smart contracts that automatically execute according to your will's instructions. Beneficiaries gain access only when predetermined conditions are met."
        },
        {
            question: "Can I modify my will after creating it?",
            answer: "Yes, you can update your SmartWill at any time. Changes are securely recorded on the blockchain with full version history and cryptographic proof of authenticity."
        },
        {
            question: "How do beneficiaries access their inheritance?",
            answer: "Beneficiaries are notified through secure channels and must complete identity verification. The smart contract then automatically transfers assets according to your specified distribution."
        },
        {
            question: "What types of assets can I include?",
            answer: "SmartWill supports cryptocurrency, NFTs, traditional financial accounts, digital documents, and memory vault items like photos, videos, and messages."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                
                @keyframes dataFlow {
                    0% { transform: translateX(0px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateX(20px); opacity: 0; }
                }
                
                @keyframes nodePulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.1); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                
                @keyframes dataBeam {
                    0% { transform: scaleX(0); opacity: 0; }
                    20% { transform: scaleX(0.3); opacity: 1; }
                    80% { transform: scaleX(1); opacity: 1; }
                    100% { transform: scaleX(1.2); opacity: 0; }
                }
                
                @keyframes particleFloat {
                    0% { transform: translateY(0px); opacity: 0.3; }
                    50% { transform: translateY(-20px); opacity: 0.8; }
                    100% { transform: translateY(-40px); opacity: 0; }
                }
                
                @keyframes connectionPulse {
                    0% { stroke-opacity: 0.1; stroke-width: 1; }
                    50% { stroke-opacity: 0.6; stroke-width: 2; }
                    100% { stroke-opacity: 0.1; stroke-width: 1; }
                }
                
                .blockchain-node {
                    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
                    animation: nodePulse 4s ease-in-out infinite;
                }
                
                .data-stream {
                    animation: dataFlow 2s ease-in-out infinite;
                }
                
                .data-beam {
                    animation: dataBeam 3s ease-in-out infinite;
                    transform-origin: left center;
                }
                
                .floating-particle {
                    animation: particleFloat 6s ease-in-out infinite;
                }
                
                .connection-line {
                    animation: connectionPulse 3s ease-in-out infinite;
                }
                
                @media (max-width: 768px) {
                    .blockchain-node {
                        animation-duration: 3s;
                    }
                    .data-beam {
                        animation-duration: 2s;
                    }
                    .floating-particle {
                        animation-duration: 4s;
                    }
                }
            `}</style>

            {/* Sticky Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBlur ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <button 
                            onClick={() => {
                                console.log('Landing page logo clicked - starting app');
                                onGetStarted?.();
                            }}
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-gray-900 font-semibold text-xl">SmartWill</span>
                        </button>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                            >
                                About us
                            </button>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                            >
                                Contact
                            </button>
                            <button
                                onClick={() => scrollToSection('support')}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                            >
                                Support
                            </button>
                            
                            {/* Auth Buttons */}
                            <div className="flex items-center space-x-4 ml-8">
                                <button
                                    onClick={onSignInClick}
                                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={onSignUpClick}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center space-x-4">
                            <button
                                onClick={onSignInClick}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium text-sm"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={onSignUpClick}
                                className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 text-sm"
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
                            <div className="px-6 py-4 space-y-4">
                                <button
                                    onClick={() => {
                                        scrollToSection('features');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium py-2"
                                >
                                    Features
                                </button>
                                <button
                                    onClick={() => {
                                        scrollToSection('about');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium py-2"
                                >
                                    About us
                                </button>
                                <button
                                    onClick={() => {
                                        scrollToSection('contact');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium py-2"
                                >
                                    Contact
                                </button>
                                <button
                                    onClick={() => {
                                        scrollToSection('support');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium py-2"
                                >
                                    Support
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Blockchain Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient Background with Animation */}
                    <div
                        className="absolute inset-0 bg-gray-100"
                        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
                    />

                    {/* Floating Particles */}
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute w-1 h-1 bg-blue-500/60 rounded-full floating-particle"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                opacity: particle.opacity,
                                animationDelay: `${particle.id * 0.3}s`
                            }}
                        />
                    ))}

                    {/* Blockchain Nodes */}
                    {blockchainNodes.map((node) => (
                        <div key={node.id} className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                            {/* Node Circle */}
                            <div
                                className="relative bg-gradient-to-br from-blue-500/30 to-white/30 rounded-full border border-blue-500/40 backdrop-blur-sm blockchain-node"
                                style={{
                                    width: `${node.size}px`,
                                    height: `${node.size}px`,
                                    animationDelay: `${node.pulseDelay}s`
                                }}
                            >
                                {/* Inner Glow */}
                                <div className="absolute inset-1 bg-gradient-to-br from-blue-500/40 to-white/40 rounded-full animate-ping opacity-75"></div>
                                {/* Core */}
                                <div className="absolute inset-2 bg-white/80 rounded-full"></div>
                            </div>

                            {/* Data Streams */}
                            {node.id % 3 === 0 && (
                                <div className="absolute top-1/2 left-full w-16 h-px">
                                    <div className="w-full h-full bg-gradient-to-r from-blue-500/60 to-transparent data-beam" style={{ animationDelay: `${node.pulseDelay}s` }}></div>
                                    <div className="absolute top-0 left-0 w-2 h-px bg-blue-500 data-stream" style={{ animationDelay: `${node.pulseDelay + 0.5}s` }}></div>
                                    <div className="absolute top-0 right-0 w-1 h-1 bg-blue-600 rounded-full opacity-60 animate-pulse" style={{ animationDelay: `${node.pulseDelay + 1}s` }}></div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        {blockchainNodes.map((node, index) =>
                            blockchainNodes.slice(index + 1).map((targetNode, targetIndex) => {
                                const distance = Math.sqrt(
                                    Math.pow(node.x - targetNode.x, 2) + Math.pow(node.y - targetNode.y, 2)
                                );
                                if (distance < 25) {
                                    return (
                                        <line
                                            key={`${index}-${targetIndex}`}
                                            x1={`${node.x}%`}
                                            y1={`${node.y}%`}
                                            x2={`${targetNode.x}%`}
                                            y2={`${targetNode.y}%`}
                                            stroke="url(#blockchainGradient)"
                                            strokeWidth="1"
                                            className="connection-line"
                                            style={{ animationDelay: `${index * 0.5}s` }}
                                        />
                                    );
                                }
                                return null;
                            })
                        )}
                        <defs>
                            <linearGradient id="blockchainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Floating Data Blocks */}
                    {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 6)].map((_, i) => (
                        <div
                            key={`block-${i}`}
                            className="absolute opacity-20"
                            style={{
                                left: `${10 + i * 15}%`,
                                top: `${20 + (i % 3) * 20}%`,
                                animation: `float 4s ease-in-out infinite`,
                                animationDelay: `${i * 0.8}s`
                            }}
                        >
                            <div className="bg-gradient-to-br from-blue-500/20 to-white/20 rounded-lg p-3 border border-blue-500/30 backdrop-blur-sm hover:opacity-40 transition-opacity">
                                <div className="w-8 h-2 bg-gradient-to-r from-blue-500 to-white rounded mb-1 opacity-60 data-beam" style={{ animationDelay: `${i * 0.3}s` }}></div>
                                <div className="w-6 h-1 bg-gray-400 rounded opacity-40"></div>
                                <div className="w-4 h-1 bg-gray-400 rounded mt-1 opacity-30"></div>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500/60 rounded-full animate-ping"></div>
                            </div>
                        </div>
                    ))}

                    {/* Pulse Rings */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-10">
                        <div className="absolute inset-0 border border-blue-500 rounded-full animate-ping"></div>
                        <div className="absolute inset-4 border border-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute inset-8 border border-blue-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 opacity-10">
                        <div className="absolute inset-0 border border-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute inset-3 border border-blue-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-16">
                    <div className={`transition-all duration-1500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

                        {/* Hero Headlines - Premium Style */}
                        <div className="text-center space-y-8 mb-16">
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-white/10 border border-blue-500/20 rounded-full px-6 py-3 backdrop-blur-xl">
                                <Award className="h-4 w-4 text-blue-500" />
                                <span className="text-blue-600 text-sm font-medium">Trusted by 10,000+ families worldwide</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-gray-900 leading-[0.85] tracking-tighter">
                                Your Legacy.
                                <br />
                                <span className="text-blue-600 font-thin">
                                    Secured Forever.
                                </span>
                            </h1>

                            <p className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto mt-8">
                                The world's most advanced digital estate planning platform.
                                <br className="hidden md:block" />
                                Blockchain-secured. AI-powered. Family-protected.
                            </p>
                        </div>

                        {/* Interactive CTAs */}
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-16">
                            <button
                                onClick={onGetStarted}
                                className="group bg-blue-600 text-white px-12 py-5 rounded-full font-medium text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-105 flex items-center space-x-3"
                            >
                                <span>Start Your Legacy</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="group flex items-center space-x-3 text-gray-900 hover:text-blue-500 transition-colors duration-300">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                                    <Play className="h-5 w-5 ml-0.5" />
                                </div>
                                <span className="text-lg font-medium">Watch Demo</span>
                            </button>
                        </div>

                        {/* Premium Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-200">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2">$2.5B+</div>
                                <div className="text-gray-600 text-sm">Assets Protected</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2">99.99%</div>
                                <div className="text-gray-600 text-sm">Uptime SLA</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2">10K+</div>
                                <div className="text-gray-600 text-sm">Families</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2">256-bit</div>
                                <div className="text-gray-600 text-sm">Encryption</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smooth Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                        <ChevronDown className="h-6 w-6 text-gray-400" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-white/10 border border-blue-500/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
                            <Zap className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-600 text-sm font-medium">Next-Generation Technology</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
                            Built for the
                            <br />
                            <span className="text-blue-600">
                                Digital Future
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the perfect fusion of blockchain security, artificial intelligence,
                            and intuitive design in one powerful platform.
                        </p>
                    </div>

                    {/* Interactive Product Showcase */}
                    <div className="space-y-32">
                        {/* Blockchain Security */}
                        <div className="relative rounded-3xl overflow-hidden bg-gray-100 p-1">
                            <div className="bg-white rounded-3xl p-8 md:p-16 border border-gray-200">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div
                                        className="space-y-8"
                                        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                                    >
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                <Shield className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <span className="text-blue-600 font-medium">Blockchain Security</span>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                                            Unbreakable
                                            <br />
                                            <span className="text-blue-600">Protection</span>
                                        </h3>
                                        <p className="text-xl text-gray-600 leading-relaxed">
                                            Military-grade encryption meets blockchain technology.
                                            Your digital legacy is protected by the most secure infrastructure on Earth.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-3">
                                                <Check className="h-5 w-5 text-green-600" />
                                                <span className="text-gray-600">256-bit Encryption</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Check className="h-5 w-5 text-green-600" />
                                                <span className="text-gray-600">Immutable Records</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Check className="h-5 w-5 text-green-600" />
                                                <span className="text-gray-600">Multi-Signature</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Check className="h-5 w-5 text-green-600" />
                                                <span className="text-gray-600">Zero-Knowledge</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="bg-blue-100 rounded-2xl p-8 backdrop-blur-xl border border-blue-200 hover:border-blue-300 transition-colors duration-500">
                                            <div className="relative">
                                                <Shield className="h-32 w-32 text-blue-600 mx-auto animate-pulse" />
                                                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Intelligence */}
                        <div className="relative rounded-3xl overflow-hidden bg-purple-100 p-1">
                            <div className="bg-white rounded-3xl p-8 md:p-16 border border-purple-200">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="relative order-2 md:order-1">
                                        <div className="bg-purple-100 rounded-2xl p-8 backdrop-blur-xl border border-purple-200 hover:border-purple-300 transition-colors duration-500">
                                            <div className="relative">
                                                <Brain className="h-32 w-32 text-purple-600 mx-auto" />
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
                                                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="space-y-8 order-1 md:order-2"
                                        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                                    >
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                                <Brain className="h-6 w-6 text-purple-400" />
                                            </div>
                                            <span className="text-purple-300 font-medium">AI Intelligence</span>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                                            Smart
                                            <br />
                                            <span className="text-purple-600">Recommendations</span>
                                        </h3>
                                        <p className="text-xl text-gray-600 leading-relaxed">
                                            Our AI advisor analyzes your assets, relationships, and goals to provide
                                            personalized recommendations that evolve with your life.
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-100 border border-purple-200">
                                                <TrendingUp className="h-5 w-5 text-purple-600" />
                                                <span className="text-gray-600">Portfolio optimization suggestions</span>
                                            </div>
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-100 border border-purple-200">
                                                <Clock className="h-5 w-5 text-purple-600" />
                                                <span className="text-gray-600">Life event reminders</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Feature Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-32">
                        <div className="group relative p-8 rounded-2xl bg-green-50 border border-gray-200 hover:border-green-300 transition-all duration-500">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Lock className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Bank-Grade Security</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">Every byte of data is protected with the same security standards used by major financial institutions.</p>
                            <div className="flex items-center text-green-600 text-sm font-medium">
                                <span>Learn more</span>
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="group relative p-8 rounded-2xl bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-500">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Globe className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Access</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">Access your digital legacy from anywhere in the world with enterprise-grade infrastructure and 99.99% uptime.</p>
                            <div className="flex items-center text-blue-600 text-sm font-medium">
                                <span>Learn more</span>
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="group relative p-8 rounded-2xl bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all duration-500">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Heart className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Family First</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">Designed with families in mind. Easy onboarding, guardian systems, and emotional support resources.</p>
                            <div className="flex items-center text-purple-600 text-sm font-medium">
                                <span>Learn more</span>
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600/10 to-blue-500/10 border border-green-600/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
                            <Star className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 text-sm font-medium">Trusted by Families Worldwide</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
                            Real Stories,
                            <br />
                            <span className="text-green-600">
                                Real Peace of Mind
                            </span>
                        </h2>
                    </div>

                    {/* Interactive Testimonials Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-gray-800 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white font-medium">SM</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Sarah Miller</h4>
                                    <p className="text-gray-400 text-sm">Tech Executive</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                "Finally, a platform that understands the complexity of digital assets.
                                SmartWill made securing my crypto portfolio for my family incredibly simple."
                            </p>
                            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Code className="h-8 w-8 text-blue-400" />
                            </div>
                        </div>

                        <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-gray-800 hover:border-green-600/30 transition-all duration-500 hover:transform hover:scale-105">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
                                    <span className="text-white font-medium">JC</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">James Chen</h4>
                                    <p className="text-gray-400 text-sm">Investment Advisor</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                "The AI recommendations helped me optimize my estate plan in ways I never considered.
                                The security features give me complete confidence."
                            </p>
                            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-gray-800 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                                    <span className="text-white font-medium">EM</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Elena Martinez</h4>
                                    <p className="text-gray-400 text-sm">Small Business Owner</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                "Setting up guardians for my kids was so easy. The peace of mind knowing
                                they'll be taken care of is priceless."
                            </p>
                            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Heart className="h-8 w-8 text-purple-400" />
                            </div>
                        </div>
                    </div>

                    {/* Company Logos */}
                    <div className="text-center mb-16">
                        <p className="text-gray-400 mb-8">Trusted by employees at leading companies</p>
                        <div className="flex flex-wrap items-center justify-center space-x-8 opacity-40">
                            <div className="text-2xl font-bold text-gray-400">Apple</div>
                            <div className="text-2xl font-bold text-gray-400">Google</div>
                            <div className="text-2xl font-bold text-gray-400">Tesla</div>
                            <div className="text-2xl font-bold text-gray-400">Microsoft</div>
                            <div className="text-2xl font-bold text-gray-400">Amazon</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 bg-white">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
                                <Database className="h-4 w-4 text-blue-400" />
                                <span className="text-blue-300 text-sm font-medium">Next-Generation Platform</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-light text-white leading-tight mb-8">
                                Built for
                                <br />
                                <span className="text-blue-600">
                                    Tomorrow's Families
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                SmartWill combines cutting-edge blockchain technology with intuitive design
                                to create the world's most secure and user-friendly digital estate planning platform.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Check className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <span className="text-gray-300">Enterprise-grade security infrastructure</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                                        <Check className="h-4 w-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-300">AI-powered optimization and insights</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <Check className="h-4 w-4 text-purple-400" />
                                    </div>
                                    <span className="text-gray-300">Family-first design and support</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 backdrop-blur-xl border border-gray-800">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-light text-white mb-2">$2.5B+</div>
                                        <div className="text-gray-400 text-sm">Assets Protected</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-light text-white mb-2">10K+</div>
                                        <div className="text-gray-400 text-sm">Families</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-light text-white mb-2">99.99%</div>
                                        <div className="text-gray-400 text-sm">Uptime SLA</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-light text-white mb-2">24/7</div>
                                        <div className="text-gray-400 text-sm">Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
                            <Zap className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-300 text-sm font-medium">Simple, Transparent Pricing</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
                            Choose Your
                            <br />
                            <span className="text-blue-600">
                                Legacy Plan
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Start free and upgrade as your digital estate grows. All plans include military-grade security.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Starter Plan */}
                        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 backdrop-blur-xl">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-2">Starter</h3>
                                <p className="text-gray-400 mb-6">Perfect for getting started</p>
                                <div className="text-5xl font-light text-white mb-2">$0</div>
                                <p className="text-gray-400">per month</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <span className="text-gray-300">Basic will creation</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <span className="text-gray-300">Up to 3 beneficiaries</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <span className="text-gray-300">Basic asset tracking</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <span className="text-gray-300">Email support</span>
                                </div>
                            </div>
                            <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-300">
                                Get Started Free
                            </button>
                        </div>

                        {/* Professional Plan - Featured */}
                        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-500/50 backdrop-blur-xl transform scale-105">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            </div>
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-2">Professional</h3>
                                <p className="text-gray-400 mb-6">Advanced features for families</p>
                                <div className="text-5xl font-light text-white mb-2">$29</div>
                                <p className="text-gray-400">per month</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-300">Everything in Starter</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-300">Unlimited beneficiaries</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-300">AI advisor insights</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-300">Memory vault (10GB)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-300">Guardian system</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-300">Priority support</span>
                                </div>
                            </div>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                                Start 14-Day Trial
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-xl">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-2">Enterprise</h3>
                                <p className="text-gray-400 mb-6">For high-net-worth individuals</p>
                                <div className="text-5xl font-light text-white mb-2">$99</div>
                                <p className="text-gray-400">per month</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-purple-400" />
                                    <span className="text-gray-300">Everything in Professional</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-purple-400" />
                                    <span className="text-gray-300">Unlimited memory vault</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-purple-400" />
                                    <span className="text-gray-300">White-glove onboarding</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-purple-400" />
                                    <span className="text-gray-300">Legal document review</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-purple-400" />
                                    <span className="text-gray-300">24/7 dedicated support</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-purple-400" />
                                    <span className="text-gray-300">Custom integrations</span>
                                </div>
                            </div>
                            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300">
                                Contact Sales
                            </button>
                        </div>
                    </div>

                    {/* Feature Comparison */}
                    <div className="mt-20 text-center">
                        <p className="text-gray-400 mb-8">All plans include 256-bit encryption, blockchain security, and our happiness guarantee</p>
                        <div className="flex flex-wrap items-center justify-center space-x-6 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-blue-400" />
                                <span>Enterprise Security</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-green-600" />
                                <span>Global Access</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Heart className="h-4 w-4 text-purple-400" />
                                <span>99.99% Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-5xl md:text-6xl font-light text-white mb-8">
                        Get in Touch
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                        Have questions? Our team is here to help you secure your digital legacy.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <a
                            href="mailto:hello@smartwill.com"
                            className="group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <Mail className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">Email Us</h3>
                            <p className="text-gray-400">hello@smartwill.com</p>
                        </a>

                        <a
                            href="tel:+15551234567"
                            className="group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                        >
                            <Phone className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">Call Us</h3>
                            <p className="text-gray-400">(555) 123-4567</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* Support/FAQ Section */}
            <section id="support" className="py-32 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-light text-white mb-8">
                            Frequently Asked
                            <br />
                            <span className="text-blue-600">
                                Questions
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-300"
                                >
                                    <h3 className="text-xl font-medium text-white">{faq.question}</h3>
                                    {expandedFaq === index ? (
                                        <Minus className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedFaq === index && (
                                    <div className="px-8 pb-6">
                                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
                            <Eye className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-300 text-sm font-medium">See It In Action</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
                            Experience the
                            <br />
                            <span className="text-blue-600">
                                Future of Legacy
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Take a guided tour through SmartWill's powerful features and see how easy
                            it is to secure your digital legacy.
                        </p>
                    </div>

                    {/* Interactive Demo Preview */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-1 mb-16">
                        <div className="bg-gray-900 rounded-3xl p-8 md:p-16">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <MousePointer className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <span className="text-blue-300 font-medium">Interactive Demo</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-light text-white leading-tight">
                                        Try Before
                                        <br />
                                        <span className="text-blue-400">You Buy</span>
                                    </h3>
                                    <p className="text-xl text-gray-300 leading-relaxed">
                                        Explore every feature, test the AI advisor, and see how your
                                        digital estate would look - all without signing up.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <span className="text-blue-400 font-medium text-sm">1</span>
                                            </div>
                                            <span className="text-gray-300">Create a sample will in 60 seconds</span>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                <span className="text-purple-400 font-medium text-sm">2</span>
                                            </div>
                                            <span className="text-gray-300">Add digital assets and beneficiaries</span>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                                            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                                                <span className="text-green-600 font-medium text-sm">3</span>
                                            </div>
                                            <span className="text-gray-300">See AI recommendations in real-time</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                                        <Play className="h-5 w-5" />
                                        <span>Start Interactive Demo</span>
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 backdrop-blur-xl border border-gray-700 hover:border-blue-500/50 transition-colors duration-500">
                                        <div className="relative aspect-video bg-black/40 rounded-xl overflow-hidden border border-gray-600">
                                            {/* Mock Dashboard Preview */}
                                            <div className="absolute inset-0 p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex space-x-2">
                                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                                    </div>
                                                    <div className="text-xs text-gray-400">SmartWill Dashboard</div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mb-4">
                                                    <div className="bg-blue-500/20 rounded p-2">
                                                        <div className="w-4 h-4 bg-blue-400 rounded mb-1"></div>
                                                        <div className="w-full h-1 bg-gray-600 rounded"></div>
                                                    </div>
                                                    <div className="bg-green-600/20 rounded p-2">
                                                        <div className="w-4 h-4 bg-green-400 rounded mb-1"></div>
                                                        <div className="w-full h-1 bg-gray-600 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="w-full h-2 bg-gray-600 rounded"></div>
                                                    <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                                                    <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                                                </div>
                                            </div>
                                            {/* Animated Cursor */}
                                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <p className="text-gray-400 text-sm">Live demo environment</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Demo Features Grid */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-gray-800">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Brain className="h-8 w-8 text-blue-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">AI Assistant</h4>
                            <p className="text-gray-400 text-sm">Chat with our AI to get personalized estate planning advice</p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-600/5 to-blue-500/5 border border-gray-800">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-600/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Database className="h-8 w-8 text-green-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Asset Tracking</h4>
                            <p className="text-gray-400 text-sm">See how your crypto and digital assets are organized</p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-gray-800">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8 text-purple-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Family Setup</h4>
                            <p className="text-gray-400 text-sm">Experience adding beneficiaries and guardians</p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-gray-800">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-orange-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Security Test</h4>
                            <p className="text-gray-400 text-sm">Try our multi-factor authentication and recovery options</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 leading-tight">
                        Start Today.
                        <br />
                        <span className="text-blue-600">
                            Secure Tomorrow.
                        </span>
                    </h2>

                    <button
                        onClick={onGetStarted}
                        className="group bg-blue-600 text-white px-12 py-5 rounded-full font-medium text-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-105"
                    >
                        Create Your SmartWill
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 inline" />
                    </button>
                </div>
            </section>

            {/* Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50">
                {chatOpen ? (
                    <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 w-80 h-96 flex flex-col">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Brain className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">SmartWill AI</h3>
                                    <p className="text-xs text-green-600">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setChatOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {chatMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${message.isBot
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        }`}>
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask about creating your will..."
                                    className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 py-2 hover:shadow-lg transition-all duration-300"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setChatOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                    >
                        <MessageCircle className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default LandingPage;