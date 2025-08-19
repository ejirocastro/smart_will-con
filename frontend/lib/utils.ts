// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = (dateObj.getTime() - now.getTime()) / 1000;
  
  if (diffInSeconds < 0) {
    return 'Past due';
  }
  
  const diffInDays = Math.ceil(diffInSeconds / (60 * 60 * 24));
  
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

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateWalletAddress(address: string): boolean {
  // Basic Stacks address validation (starts with SP or SM)
  const stacksRegex = /^S[PM][0-9A-HJ-NP-Z]{39}$/;
  return stacksRegex.test(address);
}

export function calculatePercentageDistribution(amounts: number[]): number[] {
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  if (total === 0) return amounts.map(() => 0);
  
  return amounts.map(amount => Math.round((amount / total) * 100));
}

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