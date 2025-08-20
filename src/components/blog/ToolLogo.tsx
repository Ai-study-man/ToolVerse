'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ToolLogoProps {
  src?: string;
  alt: string;
  toolName: string;
  className?: string;
}

export default function ToolLogo({ src, alt, toolName, className = "w-full h-full object-contain rounded-lg" }: ToolLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
        <span className="text-white font-bold text-lg">AI</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={60}
      height={60}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
