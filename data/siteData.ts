import { SiteHeader, SiteFooter, Product, BlogPost } from "@/types";

export const siteHeader: SiteHeader = {
  brand: {
    logo: "RealismThrift",
    name: "RealismThrift Export Co., Ltd",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "Used Clothes", href: "/used-brand-clothes" },
    { label: "Used Shoes", href: "/used-brand-shoes" },
    { label: "Used Bags", href: "/used-brand-bag" },
    { label: "How To Order", href: "/how-to-order" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  inquiryCta: "INQUIRY",
};

export const siteFooter: SiteFooter = {
  brand: {
    logo: "RealismThrift",
    description: "RealismThrift Export Co., Ltd is a leading wholesale supplier of second-hand clothes, shoes and bags from China. Export to 100+ countries with A-Grade quality.",
    address: "Guangzhou, Guangdong Province, China",
    phone: "+86 188 0000 0001",
    email: "sales@realismthrift.com",
    whatsapp: "+8618800000001"
  },
  sections: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about-us" },
        { label: "How To Order", href: "/how-to-order" },
        { label: "FAQ", href: "/#faq" },
        { label: "Contact Us", href: "/contact-us" },
      ],
    },
    {
      title: "Products",
      links: [
        { label: "Used Clothes", href: "/used-brand-clothes" },
        { label: "Used Shoes", href: "/used-brand-shoes" },
        { label: "Used Bags", href: "/used-brand-bag" },
        { label: "Brand Shoes", href: "/used-brand-shoes" },
        { label: "Brand Clothes", href: "/used-brand-clothes" },
      ],
    },
  ],
  contact: {
    whatsapp: "+8618800000001",
    email: "sales@realismthrift.com",
    inquiryTime: "Our sales team replies within 12 hours.",
  },
  bottom: {
    copyright: "© 2026 RealismThrift Export Co., Ltd. All Rights Reserved.",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
};

export const productsData: Product[] = [
  {
    id: "clothes",
    title: "Used Brand Clothes",
    category: "WHOLESALE",
    image: "/img/cat-clothes.jpg",
    href: "/used-brand-clothes",
  },
  {
    id: "shoes",
    title: "Used Brand Shoes",
    category: "WHOLESALE",
    image: "/img/cat-shoes.jpg",
    href: "/used-brand-shoes",
  },
  {
    id: "bags",
    title: "Used Brand Bags",
    category: "WHOLESALE",
    image: "/img/cat-bags.jpg",
    href: "/used-brand-bag",
  },
  {
    id: "ukay",
    title: "ukay quality bag",
    category: "WHOLESALE",
    image: "/img/cat-ukay.jpg",
    href: "#contact",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "why-wholesale-second-hand-branded-clothes-is-the-most-profitable-business-in-afr",
    title: "Why Wholesale Second Hand Branded Clothes Is the Most Profitable Business in Africa 2024",
    excerpt: "Discover why importing wholesale second hand branded clothes from China to Africa generates 200-400% profit margins for savvy importers.",
    date: "Mar 21, 2026",
    category: "Uncategorized",
    content: "Full content placeholder...", // Added content field to match BlogPost interface
  },
];

export const features = [
  {
    title: "80%+ Reorder Rate",
    icon: "📈",
    description: "Over 80% of our customers reorder because our stable quality helps them build a great reputation in their local markets.",
  },
  {
    title: "Premium Raw Materials",
    icon: "🏆",
    description: "We source from first-tier cities including Beijing, Shanghai, Guangzhou, and Chengdu for the highest quality used items.",
  },
  {
    title: "Strict Quality Control",
    icon: "✅",
    description: "Trained quality inspectors conduct random inspections on each batch to ensure A-Grade standard throughout.",
  },
  {
    title: "Fast Loading & Delivery",
    icon: "⚡",
    description: "Efficient sorting and reliable logistics allow us to load containers in as fast as 7 days after order placement.",
  },
  {
    title: "12+ Years Experience",
    icon: "🕐",
    description: "Founded in 2012, we have rich experience in used clothes, shoes, and bags wholesale export to global markets.",
  },
  {
    title: "Export to 100+ Countries",
    icon: "🌍",
    description: "Our products are well-appreciated by wholesalers in Africa, Middle East, Southeast Asia, and South America.",
  },
];

export const orderSteps = [
  {
    num: "01",
    icon: "💬",
    title: "Contact Us",
    description: "Send us your inquiry via WhatsApp, email, or the contact form with your requirements.",
  },
  {
    num: "02",
    icon: "📋",
    title: "Get Price List",
    description: "We will send you our latest wholesale price list and product catalog within 12 hours.",
  },
  {
    num: "03",
    icon: "✅",
    title: "Confirm Order",
    description: "Choose your products, confirm quantities, and pay 30% deposit to start production.",
  },
  {
    num: "04",
    icon: "🚢",
    title: "Receive Goods",
    description: "We load your container and ship to your port. Fastest delivery: 7 days after order.",
  },
];
