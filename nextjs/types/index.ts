export interface NavItem {
  label: string;
  href: string;
}

export interface SiteHeader {
  brand: {
    logo: string;
    name: string;
  };
  navItems: NavItem[];
  inquiryCta: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SiteFooter {
  brand: {
    logo: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    whatsapp?: string;
  };
  sections: {
    title: string;
    links: FooterLink[];
  }[];
  contact: {
    whatsapp: string;
    email: string;
    inquiryTime: string;
  };
  bottom: {
    copyright: string;
    links: FooterLink[];
  };
}

export interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  description?: string;
  href: string;
}

export interface SanityImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface SanityImageAsset {
  _ref?: string;
  url?: string;
  metadata?: {
    dimensions?: SanityImageDimensions;
  };
}

export interface SanityImage {
  alt?: string;
  caption?: string;
  asset?: SanityImageAsset;
}

export interface BlogCategory {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
}

export interface BlogAuthor {
  name: string;
  role?: string;
  bio?: string;
  avatar?: SanityImage;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
}

export interface BlogPostCard {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  _updatedAt: string;
  coverImage?: SanityImage;
  category?: BlogCategory;
  author?: BlogAuthor;
}

export interface BlogPostDetail extends BlogPostCard {
  body: unknown[];
  seo?: BlogSeo;
}

export interface HomePageData {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    bgImage: string;
  };
  features: {
    title: string;
    icon: string;
    description: string;
  }[];
  sections: {
    title: string;
    subtitle?: string;
    content?: string;
    image?: string;
    buttonText?: string;
    buttonHref?: string;
  }[];
}
