/**
 * Modal Component
 * Accessible modal dialog with backdrop, keyboard navigation, and customizable sizing
 */
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    /** Whether the modal is open or closed */
    isOpen: boolean;
    /** Callback function to close the modal */
    onClose: () => void;
    /** Content to be displayed inside the modal */
    children: React.ReactNode;
    /** Optional title displayed in the modal header */
    title?: string;
    /** Maximum width of the modal */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, maxWidth = 'md' }) => {
    /**
     * Set up keyboard navigation and body scroll prevention
     */
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md sm:max-w-lg',
        lg: 'max-w-lg sm:max-w-xl lg:max-w-2xl',
        xl: 'max-w-xl sm:max-w-2xl lg:max-w-4xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6">
                <div 
                    className={`relative w-full ${maxWidthClasses[maxWidth]} transform rounded-xl sm:rounded-2xl bg-white shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    {title && (
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-xl sm:rounded-t-2xl">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate pr-2">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                    )}
                    
                    {/* Close button (when no title) */}
                    {!title && (
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    )}
                    
                    {/* Modal Content */}
                    <div className={title ? 'p-4 sm:p-6' : 'p-4 sm:p-6'}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;