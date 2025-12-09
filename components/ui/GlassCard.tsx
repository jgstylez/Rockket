import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`glass-panel rounded-xl p-6 transition-all duration-300 ${hoverEffect ? 'glass-panel-hover cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};