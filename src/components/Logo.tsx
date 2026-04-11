import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', showTagline = false, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-xl', tagline: 'text-[8px]' },
    md: { icon: 48, text: 'text-3xl', tagline: 'text-[10px]' },
    lg: { icon: 120, text: 'text-6xl', tagline: 'text-sm' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-3">
        {/* SVG Icon part of the logo */}
        <svg 
          width={currentSize.icon} 
          height={currentSize.icon} 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Capsule Background */}
          <rect x="40" y="80" width="120" height="60" rx="30" fill="url(#capsule_grad)" />
          
          {/* Leaves */}
          <path d="M45 85C45 85 30 60 50 40C70 20 85 45 85 45C85 45 110 30 130 50C150 70 125 85 125 85" stroke="#10B981" strokeWidth="8" strokeLinecap="round" />
          <path d="M85 45L85 80" stroke="#10B981" strokeWidth="8" strokeLinecap="round" />
          
          {/* Magnifying Glass */}
          <circle cx="130" cy="70" r="40" fill="white" stroke="#10B981" strokeWidth="8" />
          <path d="M158 98L180 120" stroke="#10B981" strokeWidth="12" strokeLinecap="round" />
          
          {/* Checkmark */}
          <path d="M115 70L125 80L145 60" stroke="#10B981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Plus signs */}
          <path d="M170 30V50M160 40H180" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
          <path d="M130 160V170M125 165H135" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />

          <defs>
            <linearGradient id="capsule_grad" x1="40" y1="110" x2="160" y2="110" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A7F3D0" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex flex-col">
          <h1 className={`font-bold tracking-tight ${currentSize.text} leading-none`}>
            <span className="text-slate-800">Gen</span>
            <span className="text-emerald-500">Meds</span>
          </h1>
        </div>
      </div>
      
      {showTagline && (
        <div className={`mt-2 flex items-center gap-2 w-full ${currentSize.tagline} font-medium text-slate-500 whitespace-nowrap`}>
          <div className="h-px flex-1 bg-slate-200" />
          <span>Find Safer</span>
          <span className="text-emerald-500">•</span>
          <span>Cheaper</span>
          <span className="text-emerald-500">•</span>
          <span>Smarter Medicine</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      )}
    </div>
  );
}
