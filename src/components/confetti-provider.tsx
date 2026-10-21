
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

const ConfettiParticle = ({ style, shape }: { style: React.CSSProperties, shape: 'star' | 'rect' }) => {
    const className = cn("absolute animate-confetti-burst", shape === 'star' ? 'text-primary' : '');
    
    if (shape === 'star') {
        return (
            <svg
                className={className}
                style={style}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
            >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
        );
    }
    return <div className={className} style={style} />;
};

const colors = ['#ffd700', '#ff8c00', '#ff4500', '#4682b4', '#1e90ff'];

type ConfettiContextType = {
  triggerConfetti: () => void;
};

const ConfettiContext = createContext<ConfettiContextType | undefined>(undefined);

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  if (context === undefined) {
    throw new Error('useConfetti must be used within a ConfettiProvider');
  }
  return context;
};

export const ConfettiProvider = ({ children }: { children: React.ReactNode }) => {
  const [confetti, setConfetti] = useState<{ id: number; style: React.CSSProperties; shape: 'star' | 'rect' }[]>([]);

  const triggerConfetti = useCallback(() => {
    const newConfetti = Array.from({ length: 150 }).map((_, i) => {
      const shape = Math.random() > 0.2 ? 'rect' : 'star';
      const size = Math.random() * 8 + 6;
      const angle = Math.random() * 360;
      const radius = Math.random() * 300 + 100;
      
      const tx = `${Math.cos(angle * Math.PI / 180) * radius}px`;
      const ty = `${Math.sin(angle * Math.PI / 180) * radius + 150}px`;
      
      return {
          id: i,
          shape: shape as 'star' | 'rect',
          style: {
              top: '50%',
              left: '50%',
              width: `${size}px`,
              height: `${shape === 'rect' ? size * 0.7 : size}px`,
              backgroundColor: shape === 'rect' ? colors[Math.floor(Math.random() * colors.length)] : 'transparent',
              '--tx': tx,
              '--ty': ty,
              '--angle': `${Math.random() * 720}deg`,
              animationDuration: `${Math.random() * 1 + 1}s`,
              animationDelay: `${Math.random() * 0.1}s`,
              animationTimingFunction: 'cubic-bezier(0.1, 0.5, 0, 1)',
          } as React.CSSProperties,
      };
    });
    setConfetti(newConfetti);

    const timer = setTimeout(() => setConfetti([]), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ConfettiContext.Provider value={{ triggerConfetti }}>
      {children}
      {confetti.length > 0 && (
        <div className="fixed inset-0 w-full h-full z-[200] pointer-events-none">
          {confetti.map(particle => (
            <ConfettiParticle key={particle.id} style={particle.style} shape={particle.shape} />
          ))}
        </div>
      )}
    </ConfettiContext.Provider>
  );
};
