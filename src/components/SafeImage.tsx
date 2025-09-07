'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill, 
  className,
  fallbackSrc = '/placeholder-logo.svg'
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 60}
      height={height || 60}
      className={className}
      onError={handleError}
    />
  );
}
