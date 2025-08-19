// src/hooks/useStacksPrice.ts
import { useState, useEffect, useRef } from 'react';
import { StacksPricePoint } from '@/types';

interface UseStacksPriceReturn {
  stacksPrice: number;
  stacksChange: number;
  stacksHistory: StacksPricePoint[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const useStacksPrice = (): UseStacksPriceReturn => {
  const [stacksPrice, setStacksPrice] = useState<number>(2.45);
  const [stacksChange, setStacksChange] = useState<number>(0.12);
  const [stacksHistory, setStacksHistory] = useState<StacksPricePoint[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Initialize price history
  useEffect(() => {
    const initialHistory: StacksPricePoint[] = [];
    let basePrice = 2.33;
    
    for (let i = 0; i < 50; i++) {
      basePrice += (Math.random() - 0.5) * 0.03;
      initialHistory.push({
        price: Math.max(0.1, basePrice),
        timestamp: Date.now() - (50 - i) * 30000,
      });
    }
    
    setStacksHistory(initialHistory);
  }, []);

  // Animate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStacksPrice(prev => {
        const change = (Math.random() - 0.5) * 0.015;
        const newPrice = Math.max(0.1, prev + change);
        
        setStacksChange(newPrice - prev);

        // Update price history
        setStacksHistory(prevHistory => {
          const newHistory = [...prevHistory.slice(-49), {
            price: newPrice,
            timestamp: Date.now(),
          }];
          return newHistory;
        });

        return newPrice;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Canvas chart animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stacksHistory.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (): void => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      if (stacksHistory.length < 2) return;

      const prices = stacksHistory.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice || 0.01;

      // Draw gradient area
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(249, 115, 22, 0.3)');
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');

      ctx.beginPath();
      stacksHistory.forEach((point, index) => {
        const x = (index / (stacksHistory.length - 1)) * width;
        const y = height - ((point.price - minPrice) / priceRange) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw price line
      ctx.beginPath();
      ctx.strokeStyle = stacksChange >= 0 ? '#10B981' : '#EF4444';
      ctx.lineWidth = 2;
      
      stacksHistory.forEach((point, index) => {
        const x = (index / (stacksHistory.length - 1)) * width;
        const y = height - ((point.price - minPrice) / priceRange) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw current price point
      if (stacksHistory.length > 0) {
        const lastPoint = stacksHistory[stacksHistory.length - 1];
        const x = width - 1;
        const y = height - ((lastPoint.price - minPrice) / priceRange) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = stacksChange >= 0 ? '#10B981' : '#EF4444';
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stacksHistory, stacksChange]);

  return {
    stacksPrice,
    stacksChange,
    stacksHistory,
    canvasRef
  };
};