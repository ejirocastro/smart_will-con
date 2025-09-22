'use client';

import React, { useState, useEffect } from 'react';
import {
    Shield,
    ArrowRight,
    Check,
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
    Database,
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
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
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

        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleMotionPreferenceChange);

        const NAVBAR_BLUR_THRESHOLD = 50;

        // Debounced scroll handler for better performance
        let scrollTimeout: NodeJS.Timeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setScrollY(window.scrollY);
                setNavbarBlur(window.scrollY > NAVBAR_BLUR_THRESHOLD);
            }, 10);
        };        // Initialize blockchain nodes
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

        // Initialize particles with performance optimization
        const initParticles = () => {
            const newParticles = [];
            // Reduce particles for mobile and when reduced motion is preferred
            const baseCount = window.innerWidth < 768 ? 10 : 30;
            const particleCount = mediaQuery.matches ? 5 : baseCount;
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

        // Only start animations if user doesn't prefer reduced motion
        let animationInterval: NodeJS.Timeout | null = null;
        if (!mediaQuery.matches) {
            animationInterval = setInterval(() => {
                animateNodes();
                animateParticles();
            }, 100); // Reduced frequency for better performance
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            initNodes();
            initParticles();
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
            if (animationInterval) {
                clearInterval(animationInterval);
            }
        };
    }, []);

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    // Handle keyboard navigation for mobile menu
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when mobile menu is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

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
        <>
            {/* SEO Meta Tags - These should typically be in the Head component */}
            <div style={{ display: 'none' }}>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "SmartWill",
                        "description": "Protect what matters most to your family. Secure, simple estate planning that's always there when they need it.",
                        "url": "https://smartwill.com",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://smartwill.com/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "SmartWill",
                        "description": "Family-focused digital estate planning platform",
                        "url": "https://smartwill.com",
                        "logo": "https://smartwill.com/logo.png",
                        "foundingDate": "2024",
                        "sameAs": [
                            "https://twitter.com/smartwill",
                            "https://linkedin.com/company/smartwill"
                        ],
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+1-555-123-4567",
                            "contactType": "customer service",
                            "email": "hello@smartwill.com"
                        }
                    })}
                </script>
            </div>

            <main className="min-h-screen bg-white">
                {/* Skip Links for Accessibility */}
                <a
                    href="#features"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
                >
                    Skip to main content
                </a>
                {/* Custom CSS for animations with reduced motion support */}
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

                /* Accessibility: Respect reduced motion preference */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
                
                /* Performance optimizations */
                .animate-pulse {
                    will-change: opacity;
                }
                
                .transform {
                    will-change: transform;
                }
            `}</style>

                {/* Sticky Navigation */}
                <nav
                    role="navigation"
                    aria-label="Main navigation"
                    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBlur ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200' : 'bg-transparent'
                        }`}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <button
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
                                aria-label="SmartWill home"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-gray-900 font-semibold text-xl">SmartWill</span>
                            </button>

                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center space-x-10">
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
                                <div className="flex items-center space-x-3 ml-8">
                                    <button
                                        onClick={onSignInClick}
                                        className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium px-4 py-2"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={onSignUpClick}
                                        className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 shadow-sm hover:shadow-md"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="md:hidden flex items-center space-x-3">
                                <button
                                    onClick={onSignUpClick}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Get Started
                                </button>
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
                                    aria-label="Toggle navigation menu"
                                    aria-expanded={mobileMenuOpen}
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div
                                className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
                                role="dialog"
                                aria-label="Mobile navigation menu"
                            >
                                <div className="px-6 py-4 space-y-1">
                                    <button
                                        onClick={() => {
                                            scrollToSection('features');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 font-medium py-3 px-3 rounded-lg"
                                    >
                                        Features
                                    </button>
                                    <button
                                        onClick={() => {
                                            scrollToSection('about');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 font-medium py-3 px-3 rounded-lg"
                                    >
                                        About us
                                    </button>
                                    <button
                                        onClick={() => {
                                            scrollToSection('contact');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 font-medium py-3 px-3 rounded-lg"
                                    >
                                        Contact
                                    </button>
                                    <button
                                        onClick={() => {
                                            scrollToSection('support');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 font-medium py-3 px-3 rounded-lg"
                                    >
                                        Support
                                    </button>

                                    {/* Mobile Auth Section */}
                                    <div className="pt-4 border-t border-gray-200 mt-4">
                                        <button
                                            onClick={() => {
                                                onSignInClick?.();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="block w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 font-medium py-3 px-3 rounded-lg"
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <section
                    role="banner"
                    aria-labelledby="hero-title"
                    className="relative min-h-screen flex items-center justify-center overflow-hidden"
                >
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

                                <h1
                                    id="hero-title"
                                    className="text-6xl md:text-8xl lg:text-9xl font-light text-gray-900 leading-[0.85] tracking-tighter"
                                >
                                    Your Legacy.
                                    <br />
                                    <span className="text-blue-600 font-thin">
                                        Secured Forever.
                                    </span>
                                </h1>

                                <p className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto mt-8">
                                    Protect what matters most to your family.
                                    <br className="hidden md:block" />
                                    Secure, simple, and always there when they need it.
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
                        <div
                            className={!prefersReducedMotion ? "animate-bounce" : ""}
                            role="img"
                            aria-label="Scroll down indicator"
                        >
                            <ChevronDown className="h-6 w-6 text-gray-400" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    role="main"
                    aria-labelledby="features-title"
                    className="py-32 bg-white"
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-white/10 border border-blue-500/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
                                <Heart className="h-4 w-4 text-blue-500" />
                                <span className="text-blue-600 text-sm font-medium">Made for Families</span>
                            </div>
                            <h2
                                id="features-title"
                                className="text-5xl md:text-6xl font-light text-gray-900 mb-6"
                            >
                                Peace of Mind for
                                <br />
                                <span className="text-blue-600">
                                    Every Family
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Simple tools that help you organize, protect, and share what's important
                                with the people you love most.
                            </p>
                        </div>

                        {/* Interactive Product Showcase */}
                        <div className="space-y-32">
                            {/* Blockchain Security - Modern Redesign */}
                            <div className="group relative rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100">
                                <div className="p-8 md:p-12">
                                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                                        {/* Content Section */}
                                        <div className="space-y-6">
                                            {/* Badge */}
                                            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                <span className="text-blue-700 text-sm font-medium">Bank-Level Security</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                                Your Family's
                                                <span className="block text-blue-600">Information is Safe</span>
                                            </h3>

                                            {/* Description */}
                                            <p className="text-lg text-gray-600 leading-relaxed">
                                                We use the same security standards as major banks to keep your family's information private and protected, giving you confidence that your legacy is in safe hands.
                                            </p>

                                            {/* Feature Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm font-medium">Bank-Grade Protection</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm font-medium">Permanent Records</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm font-medium">Two-Person Verification</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm font-medium">Private & Confidential</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* STX Trading Chart Visualization */}
                                        <div className="relative">
                                            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100 group-hover:border-blue-200 transition-colors duration-300">
                                                {/* Chart Header */}
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                                            <span className="text-white font-bold text-xs">STX</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-900 font-semibold text-sm">Stacks (STX)</p>
                                                            <p className="text-emerald-600 font-medium text-xs">+12.5% ↗</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-900 font-bold">$2.45</p>
                                                        <p className="text-gray-500 text-xs">24h</p>
                                                    </div>
                                                </div>

                                                {/* Animated Chart */}
                                                <div className="relative h-32 mb-4">
                                                    <svg className="w-full h-full" viewBox="0 0 300 128">
                                                        {/* Grid Lines */}
                                                        <defs>
                                                            <pattern id="grid" width="30" height="32" patternUnits="userSpaceOnUse">
                                                                <path d="M 30 0 L 0 0 0 32" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                                                            </pattern>
                                                            <linearGradient id="stxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                                                                <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect width="100%" height="100%" fill="url(#grid)" />

                                                        {/* Price Line */}
                                                        <path
                                                            d="M0,80 Q50,70 100,65 T200,45 T300,35"
                                                            fill="none"
                                                            stroke="#f97316"
                                                            strokeWidth="3"
                                                            className="animate-pulse"
                                                        />

                                                        {/* Fill Area */}
                                                        <path
                                                            d="M0,80 Q50,70 100,65 T200,45 T300,35 L300,128 L0,128 Z"
                                                            fill="url(#stxGradient)"
                                                        />

                                                        {/* Data Points */}
                                                        <circle cx="100" cy="65" r="3" fill="#f97316" className="animate-pulse" />
                                                        <circle cx="200" cy="45" r="3" fill="#f97316" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                                                        <circle cx="300" cy="35" r="3" fill="#f97316" className="animate-pulse" style={{ animationDelay: '1s' }} />
                                                    </svg>

                                                    {/* Floating Price Indicator */}
                                                    <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-lg border border-orange-200 animate-bounce">
                                                        <span className="text-orange-600 font-bold text-xs">LIVE</span>
                                                    </div>
                                                </div>

                                                {/* Stack Visualization */}
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[1, 2, 3, 4].map((stack, i) => (
                                                        <div key={stack} className="space-y-1">
                                                            {[1, 2, 3].map((block, j) => (
                                                                <div
                                                                    key={block}
                                                                    className="h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded animate-pulse"
                                                                    style={{
                                                                        animationDelay: `${(i * 3 + j) * 0.2}s`,
                                                                        opacity: 1 - (j * 0.2)
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Intelligence - Modern Redesign */}
                            <div className="group relative rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100">
                                <div className="p-8 md:p-12">
                                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                                        {/* Visual Section */}
                                        <div className="relative order-2 md:order-1">
                                            <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-10 border border-indigo-100 group-hover:border-indigo-200 transition-colors duration-300">
                                                {/* Main AI Brain Icon with Modern Styling */}
                                                <div className="relative flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl scale-150"></div>
                                                    <div className="relative bg-white rounded-2xl p-6 shadow-lg">
                                                        <Brain className="h-16 w-16 text-indigo-600" />
                                                    </div>
                                                </div>

                                                {/* Floating Data Points - Conditional Animation */}
                                                <div className={`absolute top-4 right-4 w-3 h-3 bg-indigo-400 rounded-full ${!prefersReducedMotion ? 'animate-pulse' : ''}`}></div>
                                                <div className={`absolute bottom-6 left-6 w-2 h-2 bg-purple-400 rounded-full ${!prefersReducedMotion ? 'animate-pulse' : ''}`} style={{ animationDelay: '1s' }}></div>
                                                <div className={`absolute top-1/2 right-8 w-1.5 h-1.5 bg-blue-400 rounded-full ${!prefersReducedMotion ? 'animate-pulse' : ''}`} style={{ animationDelay: '2s' }}></div>

                                                {/* Connection Lines */}
                                                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
                                                    <path d="M50,50 Q100,25 150,50" stroke="url(#aiGradient)" strokeWidth="1" fill="none" className="animate-pulse" />
                                                    <path d="M50,150 Q100,175 150,150" stroke="url(#aiGradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
                                                    <defs>
                                                        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#6366f1" />
                                                            <stop offset="100%" stopColor="#a855f7" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="space-y-6 order-1 md:order-2">
                                            {/* Badge */}
                                            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                                <span className="text-indigo-700 text-sm font-medium">Smart Guidance</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                                Helpful
                                                <span className="block text-indigo-600">Suggestions</span>
                                            </h3>

                                            {/* Description */}
                                            <p className="text-lg text-gray-600 leading-relaxed">
                                                Get personalized suggestions to help organize your family's important information
                                                and make the best decisions for your unique situation.
                                            </p>

                                            {/* Feature List */}
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors duration-200">
                                                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Heart className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-gray-700 text-sm font-medium">Family-focused recommendations</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors duration-200">
                                                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Clock className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-gray-700 text-sm font-medium">Important date reminders</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Users className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-gray-700 text-sm font-medium">Beneficiary guidance</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Feature Grid - Modern Redesign */}
                        <div className="grid md:grid-cols-3 gap-8 mt-32">
                            {/* Bank-Grade Security Card */}
                            <div className="group relative rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Lock className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Bank-Grade Security</h3>
                                            <p className="text-emerald-600 text-sm font-medium">99.99% Protected</p>
                                        </div>
                                    </div>

                                    {/* Family Protection Visualization */}
                                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 mb-4 border border-emerald-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                    <Heart className="h-3 w-3 text-white" />
                                                </div>
                                                <span className="text-gray-900 font-semibold text-sm">Family Trust</span>
                                            </div>
                                            <span className="text-emerald-600 font-bold text-sm">Protected</span>
                                        </div>

                                        <div className="h-16 relative">
                                            <svg className="w-full h-full" viewBox="0 0 200 64">
                                                <defs>
                                                    <linearGradient id="btcSecurityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                                                    </linearGradient>
                                                </defs>

                                                <path
                                                    d="M0,50 Q40,45 80,40 T160,25 T200,20"
                                                    fill="none"
                                                    stroke="#10b981"
                                                    strokeWidth="2"
                                                    className="animate-pulse"
                                                />

                                                <path
                                                    d="M0,50 Q40,45 80,40 T160,25 T200,20 L200,64 L0,64 Z"
                                                    fill="url(#btcSecurityGradient)"
                                                />

                                                <circle cx="80" cy="40" r="2" fill="#10b981" className="animate-pulse" />
                                                <circle cx="160" cy="25" r="2" fill="#10b981" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                                            </svg>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        Every byte of data is protected with the same security standards used by major financial institutions.
                                    </p>

                                    <div className="flex items-center text-emerald-600 text-sm font-medium group-hover:text-emerald-700 transition-colors">
                                        <span>Learn more</span>
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            {/* Global Access Card */}
                            <div className="group relative rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Globe className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Global Access</h3>
                                            <p className="text-blue-600 text-sm font-medium">24/7 Available</p>
                                        </div>
                                    </div>

                                    {/* Global Bitcoin Trading Visualization */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">₿</span>
                                                </div>
                                                <span className="text-gray-900 font-semibold text-sm">Global</span>
                                            </div>
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                                            </div>
                                        </div>

                                        {/* World Map Dots */}
                                        <div className="relative h-16 bg-blue-100 rounded-lg overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="grid grid-cols-6 gap-2 opacity-30">
                                                    {[...Array(18)].map((_, i) => (
                                                        <div key={i} className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Active Trading Points */}
                                            <div className="absolute top-3 left-6 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                            <div className="absolute top-8 right-8 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                                            <div className="absolute bottom-4 left-1/2 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        Access your digital legacy from anywhere in the world with enterprise-grade infrastructure and 99.99% uptime.
                                    </p>

                                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                                        <span>Learn more</span>
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            {/* Family First Card */}
                            <div className="group relative rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Heart className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Family First</h3>
                                            <p className="text-purple-600 text-sm font-medium">Legacy Protected</p>
                                        </div>
                                    </div>

                                    {/* Family Portfolio Visualization */}
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border border-purple-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-gray-900 font-semibold text-sm">Family Portfolio</span>
                                            <span className="text-purple-600 font-bold text-sm">$125K</span>
                                        </div>

                                        {/* Portfolio Stacks */}
                                        <div className="flex space-x-2 items-end h-16">
                                            <div className="flex-1 space-y-1">
                                                <div className="bg-purple-400 h-8 rounded-t animate-pulse"></div>
                                                <div className="bg-purple-300 h-6 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="bg-purple-200 h-4 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="bg-pink-400 h-10 rounded-t animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="bg-pink-300 h-4 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                                <div className="bg-pink-200 h-2 rounded animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="bg-indigo-400 h-12 rounded-t animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="bg-indigo-300 h-3 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                <div className="bg-indigo-200 h-1 rounded animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="bg-violet-400 h-6 rounded-t animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                                <div className="bg-violet-300 h-8 rounded animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                                <div className="bg-violet-200 h-2 rounded animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        Designed with families in mind. Easy onboarding, guardian systems, and emotional support resources.
                                    </p>

                                    <div className="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700 transition-colors">
                                        <span>Learn more</span>
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* About Section */}
                <section id="about" className="py-32 bg-white">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                            <div>
                                <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8">
                                    <Heart className="h-4 w-4 text-blue-600" />
                                    <span className="text-blue-700 text-sm font-medium">For Families Like Yours</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-8">
                                    Your Legacy
                                    <br />
                                    <span className="text-blue-600">
                                        Lives On
                                    </span>
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                    We understand that planning for the future can feel overwhelming. That's why we've made
                                    it simple to protect what matters most - your family's security and peace of mind.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Your information stays private and secure</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Personalized guidance every step of the way</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
                                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Built with families in mind, always</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200 shadow-lg">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="text-center">
                                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">$2.5B+</div>
                                            <div className="text-gray-600 text-sm font-medium">Assets Protected</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">10K+</div>
                                            <div className="text-gray-600 text-sm font-medium">Families</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">99.99%</div>
                                            <div className="text-gray-600 text-sm font-medium">Uptime SLA</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">24/7</div>
                                            <div className="text-gray-600 text-sm font-medium">Support</div>
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
                            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8">
                                <Zap className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-700 text-sm font-medium">Simple, Transparent Pricing</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
                                Choose Your
                                <br />
                                <span className="text-blue-600">
                                    Legacy Plan
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Start free and upgrade as your digital estate grows. All plans include military-grade security.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Starter Plan */}
                            <div className="relative p-8 rounded-3xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Starter</h3>
                                    <p className="text-gray-600 mb-6">Perfect for getting started</p>
                                    <div className="text-5xl font-light text-gray-900 mb-2">$0</div>
                                    <p className="text-gray-600">per month</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Basic will creation</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Up to 3 beneficiaries</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Basic asset tracking</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Email support</span>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-300">
                                    Get Started Free
                                </button>
                            </div>

                            {/* Professional Plan - Featured */}
                            <div className="relative p-8 rounded-3xl bg-white border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300 transform scale-105">
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                </div>
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Professional</h3>
                                    <p className="text-gray-600 mb-6">Advanced features for families</p>
                                    <div className="text-5xl font-light text-gray-900 mb-2">$29</div>
                                    <p className="text-gray-600">per month</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-blue-600" />
                                        <span className="text-gray-700">Everything in Starter</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-blue-600" />
                                        <span className="text-gray-700">Unlimited beneficiaries</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-blue-600" />
                                        <span className="text-gray-700">AI advisor insights</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-blue-600" />
                                        <span className="text-gray-700">Memory vault (10GB)</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-blue-600" />
                                        <span className="text-gray-700">Guardian system</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-blue-600" />
                                        <span className="text-gray-700">Priority support</span>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                                    Start 14-Day Trial
                                </button>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="relative p-8 rounded-3xl bg-white border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                                    <p className="text-gray-600 mb-6">For high-net-worth individuals</p>
                                    <div className="text-5xl font-light text-gray-900 mb-2">$99</div>
                                    <p className="text-gray-600">per month</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-purple-600" />
                                        <span className="text-gray-700">Everything in Professional</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-purple-600" />
                                        <span className="text-gray-700">Unlimited memory vault</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-purple-600" />
                                        <span className="text-gray-700">White-glove onboarding</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-purple-600" />
                                        <span className="text-gray-700">Legal document review</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-purple-600" />
                                        <span className="text-gray-700">24/7 dedicated support</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-purple-600" />
                                        <span className="text-gray-700">Custom integrations</span>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300">
                                    Contact Sales
                                </button>
                            </div>
                        </div>

                        {/* Feature Comparison */}
                        <div className="mt-20 text-center">
                            <p className="text-gray-600 mb-8">All plans include 256-bit encryption, blockchain security, and our happiness guarantee</p>
                            <div className="flex flex-wrap items-center justify-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    <span>Enterprise Security</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Globe className="h-4 w-4 text-emerald-600" />
                                    <span>Global Access</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Heart className="h-4 w-4 text-purple-600" />
                                    <span>99.99% Uptime</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-32 bg-white">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                        <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-8">
                            Get in Touch
                        </h2>
                        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                            Have questions? Our team is here to help you secure your digital legacy.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                            <a
                                href="mailto:hello@smartwill.com"
                                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                            >
                                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Email Us</h3>
                                <p className="text-gray-600">hello@smartwill.com</p>
                            </a>

                            <a
                                href="tel:+15551234567"
                                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300"
                            >
                                <Phone className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Call Us</h3>
                                <p className="text-gray-600">(555) 123-4567</p>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Support/FAQ Section */}
                <section id="support" className="py-32 bg-white">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-8">
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
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                                    >
                                        <h3 className="text-xl font-medium text-gray-900">{faq.question}</h3>
                                        {expandedFaq === index ? (
                                            <Minus className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <Plus className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="px-8 pb-6 border-t border-gray-100">
                                            <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
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
                            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8">
                                <Eye className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-700 text-sm font-medium">See It In Action</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
                                Experience the
                                <br />
                                <span className="text-blue-600">
                                    Future of Legacy
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Take a guided tour through SmartWill's powerful features and see how easy
                                it is to secure your digital legacy.
                            </p>
                        </div>

                        {/* Interactive Demo Preview */}
                        <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-200 mb-16">
                            <div className="p-8 md:p-16">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-8">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                                                <MousePointer className="h-6 w-6 text-white" />
                                            </div>
                                            <span className="text-blue-600 font-medium">Interactive Demo</span>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                                            Try Before
                                            <br />
                                            <span className="text-blue-600">You Buy</span>
                                        </h3>
                                        <p className="text-xl text-gray-600 leading-relaxed">
                                            Explore every feature, test the AI advisor, and see how your
                                            digital estate would look - all without signing up.
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">1</span>
                                                </div>
                                                <span className="text-gray-700">Create a sample will in 60 seconds</span>
                                            </div>
                                            <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
                                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">2</span>
                                                </div>
                                                <span className="text-gray-700">Add digital assets and beneficiaries</span>
                                            </div>
                                            <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">3</span>
                                                </div>
                                                <span className="text-gray-700">See AI recommendations in real-time</span>
                                            </div>
                                        </div>
                                        <button className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                                            <Play className="h-5 w-5" />
                                            <span>Start Interactive Demo</span>
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-colors duration-500">
                                            <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-300">
                                                {/* Mock Dashboard Preview */}
                                                <div className="absolute inset-0 p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex space-x-2">
                                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                                        </div>
                                                        <div className="text-xs text-gray-300">SmartWill Dashboard</div>
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
                                                <p className="text-gray-600 text-sm">Live demo environment</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Demo Features Grid */}
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Brain className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h4>
                                <p className="text-gray-600 text-sm">Chat with our AI to get personalized estate planning advice</p>
                            </div>

                            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Database className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Asset Tracking</h4>
                                <p className="text-gray-600 text-sm">See how your crypto and digital assets are organized</p>
                            </div>

                            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Family Setup</h4>
                                <p className="text-gray-600 text-sm">Experience adding beneficiaries and guardians</p>
                            </div>

                            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Security Test</h4>
                                <p className="text-gray-600 text-sm">Try our multi-factor authentication and recovery options</p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Chat Widget */}
                <div className="fixed bottom-6 right-6 z-50">
                    {chatOpen ? (
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col">
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Brain className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 font-medium">SmartWill AI</h3>
                                        <p className="text-xs text-emerald-600">Online</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setChatOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                                {chatMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[80%] p-3 rounded-2xl ${message.isBot
                                            ? 'bg-white border border-gray-200 text-gray-700'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                            }`}>
                                            <p className="text-sm">{message.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask about creating your will..."
                                        className="flex-1 bg-white text-gray-900 rounded-lg px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-blue-500"
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
            </main>
        </>
    );
};

export default LandingPage;