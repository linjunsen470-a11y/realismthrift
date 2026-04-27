import React from "react";

/**
 * A simple component to inject JSON-LD structured data into the page.
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generates Organization Schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RealismThrift Export Co., Ltd.",
    "url": "https://www.realismthrift.com",
    "logo": "https://www.realismthrift.com/img/logo.webp",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+86-133-6748-1710",
      "contactType": "sales",
      "email": "sales@realismthrift.com",
      "availableLanguage": ["English", "French", "Spanish", "Swahili"]
    },
    "sameAs": [
      "https://wa.me/8613367481710"
    ]
  };
}

/**
 * Generates Product Schema
 */
export function getProductSchema({ 
  name, 
  description, 
  image, 
  url,
  lowPrice,
  highPrice,
  offerCount,
}: { 
  name: string; 
  description: string; 
  image: string; 
  url: string;
  lowPrice?: string;
  highPrice?: string;
  offerCount?: number;
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": name,
    "image": image,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "RealismThrift"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": url,
      "priceCurrency": "USD",
      ...(lowPrice ? { "lowPrice": lowPrice } : {}),
      ...(highPrice ? { "highPrice": highPrice } : {}),
      ...(offerCount ? { "offerCount": offerCount } : {}),
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "RealismThrift Export Co., Ltd."
      }
    }
  };
}

/**
 * Generates FAQ Schema
 */
export function getFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
}

/**
 * Generates Article Schema
 */
export function getArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName,
  publisherLogo,
  url
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogo
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
}
