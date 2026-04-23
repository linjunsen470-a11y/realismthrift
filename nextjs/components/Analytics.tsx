"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Analytics() {
  const pathname = usePathname();
  
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  useEffect(() => {
    // Track page views for FB Pixel manually since it's a SPA-like navigation in Next.js
    if (FB_PIXEL_ID && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname, FB_PIXEL_ID]);

  if (!GA_ID && !FB_PIXEL_ID) return null;

  return (
    <>
      {/* Google Analytics (GA4) */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {FB_PIXEL_ID && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              className="hidden"
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}

/**
 * Utility function to track custom events (like inquiry submissions)
 */
export const trackEvent = (eventName: string, params?: object) => {
  if (typeof window === "undefined") return;

  // Track in GA4
  if ((window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }

  // Track in FB Pixel
  if ((window as any).fbq) {
    (window as any).fbq("track", eventName, params);
  }
};
