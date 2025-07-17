'use client';

import Script from 'next/script';

interface GoogleAdSenseProps {
  publisherId: string;
}

export default function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

// 使用示例:
// <GoogleAdSense publisherId="ca-pub-4372695356377122" />
