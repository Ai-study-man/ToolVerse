'use client';

import React from 'react';

const Hero3DImage: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        width="500" 
        height="400" 
        viewBox="0 0 500 400" 
        className="w-full h-auto max-w-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background elements */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          
          <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>

          {/* Filter for glowing effect */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Floating particles */}
        <circle cx="80" cy="80" r="3" fill="#a855f7" opacity="0.6">
          <animate attributeName="cy" values="80;70;80" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="420" cy="120" r="2" fill="#6366f1" opacity="0.8">
          <animate attributeName="cy" values="120;110;120" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="450" cy="300" r="2.5" fill="#8b5cf6" opacity="0.7">
          <animate attributeName="cy" values="300;290;300" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Main laptop/computer */}
        <g transform="translate(150, 120)">
          {/* Laptop base */}
          <ellipse cx="100" cy="180" rx="120" ry="15" fill="#374151" opacity="0.3" />
          
          {/* Laptop bottom */}
          <rect x="20" y="165" width="160" height="20" rx="8" fill="#6b7280" />
          <rect x="25" y="170" width="150" height="10" rx="3" fill="#9ca3af" />
          
          {/* Laptop screen */}
          <rect x="30" y="40" width="140" height="125" rx="8" fill="#1f2937" />
          <rect x="35" y="45" width="130" height="115" rx="4" fill="url(#screenGradient)" />
          
          {/* Screen content - Code lines */}
          <g filter="url(#glow)">
            <rect x="45" y="55" width="80" height="3" rx="1" fill="#10b981" opacity="0.9">
              <animate attributeName="width" values="80;90;80" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="45" y="65" width="60" height="3" rx="1" fill="#3b82f6" opacity="0.8">
              <animate attributeName="width" values="60;70;60" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <rect x="45" y="75" width="100" height="3" rx="1" fill="#8b5cf6" opacity="0.9">
              <animate attributeName="width" values="100;110;100" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="45" y="85" width="40" height="3" rx="1" fill="#f59e0b" opacity="0.8">
              <animate attributeName="width" values="40;50;40" dur="1.8s" repeatCount="indefinite" />
            </rect>
            <rect x="45" y="95" width="85" height="3" rx="1" fill="#ef4444" opacity="0.7">
              <animate attributeName="width" values="85;95;85" dur="2.2s" repeatCount="indefinite" />
            </rect>
            
            {/* Cursor */}
            <rect x="130" y="95" width="2" height="3" fill="#fff">
              <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
            </rect>
          </g>
          
          {/* Screen reflection */}
          <rect x="35" y="45" width="60" height="115" rx="4" fill="url(#bgGradient)" opacity="0.1" />
        </g>

        {/* Floating UI elements */}
        <g transform="translate(50, 60)">
          {/* Chat bubble */}
          <rect x="0" y="0" width="80" height="40" rx="20" fill="#a855f7" opacity="0.8">
            <animate attributeName="y" values="0;-5;0" dur="3s" repeatCount="indefinite" />
          </rect>
          <circle cx="20" cy="20" r="3" fill="#fff" opacity="0.9" />
          <circle cx="35" cy="20" r="3" fill="#fff" opacity="0.7" />
          <circle cx="50" cy="20" r="3" fill="#fff" opacity="0.9" />
        </g>

        <g transform="translate(320, 50)">
          {/* Settings gear */}
          <circle cx="25" cy="25" r="20" fill="#6366f1" opacity="0.8">
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              values="0 25 25;360 25 25" 
              dur="8s" 
              repeatCount="indefinite" 
            />
          </circle>
          <circle cx="25" cy="25" r="8" fill="#1f2937" />
          <rect x="22" y="5" width="6" height="8" fill="#6366f1" />
          <rect x="22" y="37" width="6" height="8" fill="#6366f1" />
          <rect x="5" y="22" width="8" height="6" fill="#6366f1" />
          <rect x="37" y="22" width="8" height="6" fill="#6366f1" />
        </g>

        <g transform="translate(370, 200)">
          {/* Graph/chart */}
          <rect x="0" y="0" width="60" height="40" rx="8" fill="#10b981" opacity="0.8">
            <animate attributeName="y" values="0;-3;0" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="8" y="25" width="6" height="10" fill="#fff" opacity="0.9" />
          <rect x="18" y="20" width="6" height="15" fill="#fff" opacity="0.9" />
          <rect x="28" y="15" width="6" height="20" fill="#fff" opacity="0.9" />
          <rect x="38" y="10" width="6" height="25" fill="#fff" opacity="0.9" />
          <rect x="48" y="18" width="6" height="17" fill="#fff" opacity="0.9" />
        </g>

        {/* Connecting lines/network */}
        <g opacity="0.3">
          <line x1="130" y1="140" x2="370" y2="220" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="320" y1="75" x2="250" y2="160" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Additional floating elements */}
        <g transform="translate(80, 280)">
          <rect x="0" y="0" width="50" height="30" rx="15" fill="#8b5cf6" opacity="0.7">
            <animate attributeName="y" values="0;-4;0" dur="3.5s" repeatCount="indefinite" />
          </rect>
          <text x="25" y="20" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">AI</text>
        </g>
      </svg>
    </div>
  );
};

export default Hero3DImage;
