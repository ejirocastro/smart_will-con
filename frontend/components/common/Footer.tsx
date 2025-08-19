// src/components/common/Footer.tsx
import React from 'react';
import { Shield } from 'lucide-react';

interface FooterSection {
    title: string;
    links: string[];
}

const Footer: React.FC = () => {
    const sections: FooterSection[] = [
        { title: 'Product', links: ['Features', 'Security', 'Pricing', 'API'] },
        { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'Documentation'] },
        { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance'] }
    ];

    return (
        <footer className="bg-black/50 backdrop-blur-xl border-t border-gray-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Shield className="h-6 w-6 text-blue-500" />
                            <span className="text-white font-bold text-lg">SmartWill</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Secure your digital legacy with blockchain technology.
                        </p>
                    </div>

                    {sections.map((section, index) => (
                        <div key={index}>
                            <h4 className="text-white font-medium mb-4">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href="#"
                                            className="text-gray-400 text-sm hover:text-white transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 SmartWill. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;