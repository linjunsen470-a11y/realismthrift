import React from "react";

type JsonLdData = Record<string, unknown>;

/**
 * A simple component to inject JSON-LD structured data into the page.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
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
    "@type": ["Organization", "LocalBusiness"],
    "@id": "https://www.realismthrift.com/#organization",
    "name": "RealismThrift Export Co., Ltd.",
    "alternateName": "RealismThrift",
    "url": "https://www.realismthrift.com",
    "logo": "https://www.realismthrift.com/img/logo.webp",
    "image": "https://www.realismthrift.com/images/hero-main.webp",
    "description": "RealismThrift Export Co., Ltd. supplies sorted used clothes, shoes, and bags from China for wholesale importers and resale markets.",
    "foundingDate": "2012",
    "telephone": "+86-133-6748-1710",
    "email": "sales@realismthrift.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Fuyida Industrial Park, No. 52 Yida Road",
      "addressLocality": "Boluo County, Huizhou City",
      "addressRegion": "Guangdong Province",
      "addressCountry": "CN"
    },
    "areaServed": [
      "Africa",
      "Middle East",
      "Southeast Asia",
      "South America",
      "Europe",
      "Oceania"
    ],
    "knowsAbout": [
      "used clothes wholesale",
      "second hand clothes export",
      "used brand shoes wholesale",
      "used bags wholesale",
      "container loading",
      "used goods sorting and grading"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+86-133-6748-1710",
        "contactType": "sales",
        "email": "sales@realismthrift.com",
        "availableLanguage": ["English", "French", "Spanish", "Swahili"],
        "areaServed": "Worldwide"
      },
      {
        "@type": "ContactPoint",
        "url": "https://wa.me/8613367481710",
        "contactType": "customer support",
        "availableLanguage": ["English", "French", "Spanish", "Swahili"],
        "areaServed": "Worldwide"
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Wholesale used brand clothes"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Wholesale used brand shoes"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Wholesale used brand bags"
        }
      }
    ],
    "sameAs": [
      "https://wa.me/8613367481710"
    ]
  };
}

/**
 * Generates WebSite Schema with site search.
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.realismthrift.com/#website",
    "name": "RealismThrift",
    "url": "https://www.realismthrift.com",
    "publisher": {
      "@id": "https://www.realismthrift.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.realismthrift.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
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
    "category": "Used goods wholesale",
    "offers": {
      "@type": "AggregateOffer",
      "url": url,
      "priceCurrency": "USD",
      ...(lowPrice ? { "lowPrice": lowPrice } : {}),
      ...(highPrice ? { "highPrice": highPrice } : {}),
      ...(offerCount ? { "offerCount": offerCount } : {}),
      "availability": "https://schema.org/InStock",
      "seller": {
        "@id": "https://www.realismthrift.com/#organization"
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
      "@type": "Organization",
      "name": authorName
    },
    "publisher": {
      "@id": "https://www.realismthrift.com/#organization",
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

/**
 * Generates CollectionPage + ItemList Schema for listing pages.
 */
export function getCollectionPageSchema({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: {
    name: string;
    url: string;
    datePublished?: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": item.url,
        "name": item.name,
        ...(item.datePublished ? { "datePublished": item.datePublished } : {}),
      })),
    },
  };
}

/**
 * Generates BreadcrumbList Schema.
 */
export function getBreadcrumbSchema(
  items: {
    name: string;
    url: string;
  }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
