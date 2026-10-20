export {};

interface FacebookPixel {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: FacebookPixel;
  loaded?: boolean;
  version?: string;
  disablePushState?: boolean;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: FacebookPixel;
    _fbq?: FacebookPixel;
    __rtMetaPixelInit?: boolean;
    /** Pathname already counted by the head snippet on this document. */
    __rtMetaPixelDocumentPath?: string;
    /** Current-document click fallback; never persisted with the inquiry or sent to GA4. */
    __rtMetaFbc?: string;
    __rtMetaClickId?: string;
    __rtCaptureMetaClick?: () => string | undefined;
  }
}
