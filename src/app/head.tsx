import Script from 'next/script'

export default function Head() {
  return (
    <>
      {/* Google AdSense - 高优先级加载 */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4372695356377122"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-TTK01C8NN5"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TTK01C8NN5');
          `,
        }}
      />
    </>
  );
}
