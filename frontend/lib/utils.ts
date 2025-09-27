/**
 * Utility Functions
 * Collection of common helper functions for formatting, validation, and performance optimization
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and resolves Tailwind CSS conflicts
 * @param {...ClassValue} inputs - Class names, objects, or arrays to combine
 * @returns {string} Combined and optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number or string as USD currency
 * @param {number | string} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Formats a date as a human-readable string
 * @param {string | Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Formats a date as relative time from now
 * @param {string | Date} date - Target date to compare against current time
 * @returns {string} Relative time description (e.g., "In 3 days", "Past due")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = (dateObj.getTime() - now.getTime()) / 1000;
  
  // Handle past dates
  if (diffInSeconds < 0) {
    return 'Past due';
  }
  
  const diffInDays = Math.ceil(diffInSeconds / (60 * 60 * 24));
  
  // Format relative time based on duration
  if (diffInDays === 1) {
    return 'Tomorrow';
  } else if (diffInDays < 7) {
    return `In ${diffInDays} days`;
  } else if (diffInDays < 30) {
    const weeks = Math.ceil(diffInDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else if (diffInDays < 365) {
    const months = Math.ceil(diffInDays / 30);
    return `In ${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.ceil(diffInDays / 365);
    return `In ${years} year${years > 1 ? 's' : ''}`;
  }
}

/**
 * Generates a random alphanumeric ID
 * @returns {string} Random 9-character ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validates email address format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Stacks blockchain wallet address format
 * @param {string} address - Wallet address to validate
 * @returns {boolean} True if address format is valid (starts with SP or SM)
 */
export function validateWalletAddress(address: string): boolean {
  // Basic Stacks address validation (starts with SP or SM)
  const stacksRegex = /^S[PM][0-9A-HJ-NP-Z]{39}$/;
  return stacksRegex.test(address);
}

/**
 * Calculates percentage distribution from an array of amounts
 * @param {number[]} amounts - Array of numeric amounts
 * @returns {number[]} Array of percentages (rounded to whole numbers)
 */
export function calculatePercentageDistribution(amounts: number[]): number[] {
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  if (total === 0) return amounts.map(() => 0);
  
  return amounts.map(amount => Math.round((amount / total) * 100));
}

/**
 * Creates a debounced version of a function that delays execution
 * @template T
 * @param {T} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {(...args: Parameters<T>) => void} Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Creates a throttled version of a function that limits execution frequency
 * @template T
 * @param {T} func - Function to throttle
 * @param {number} delay - Minimum delay between executions in milliseconds
 * @returns {(...args: Parameters<T>) => void} Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}