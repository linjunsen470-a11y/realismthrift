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

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  category: string;
  content: string;
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
