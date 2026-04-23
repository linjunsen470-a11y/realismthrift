import { Product, SiteFooter, SiteHeader } from "@/types";

export const companyStats = {
  foundedYear: 2012,
  staffCount: "200+",
  countriesCount: "100+",
  facilitySize: "15,000 m²",
  monthlyCapacity: "500 tonnes",
  reorderRate: "80%+",
  buyersCount: "1,000+",
};

export const siteHeader: SiteHeader = {
  brand: {
    logo: "RealismThrift",
    name: "RealismThrift Export Co., Ltd",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "Used Clothes", href: "/used-brand-clothes" },
    { label: "Used Bags", href: "/used-brand-bag" },
    { label: "Used Shoes", href: "/used-brand-shoes" },
    { label: "Blog", href: "/blog" },
    { label: "How To Order", href: "/how-to-order" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  inquiryCta: "INQUIRY",
};

export const siteFooter: SiteFooter = {
  brand: {
    logo: "RealismThrift",
    description:
      `RealismThrift Export Co., Ltd is a leading wholesale supplier of second-hand clothes, shoes and bags from China. Export to ${companyStats.countriesCount} countries with A-Grade quality.`,
    address: "Fuyida Industrial Park, No. 52 Yida Road, Boluo County, Huizhou City, Guangdong Province, China",
    phone: "+86 133 6748 1710",
    email: "sales@realismthrift.com",
    whatsapp: "+86 133 6748 1710",
  },
  sections: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
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
      ],
    },
  ],
  contact: {
    whatsapp: "+86 133 6748 1710",
    email: "sales@realismthrift.com",
    inquiryTime: "Reply within 12 hours. Urgent? Contact via WhatsApp.",
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
    image: "/images/v2/clothes/adidas-kelme-athletic-shorts-pants-pile.webp",
    href: "/used-brand-clothes",
  },
  {
    id: "shoes",
    title: "Used Brand Shoes",
    category: "WHOLESALE",
    image: "/images/v2/shoes/designer-sneakers-assorted-wholesale-display.webp",
    href: "/used-brand-shoes",
  },
  {
    id: "bags",
    title: "Used Brand Bags",
    category: "WHOLESALE",
    image: "/images/v2/bags/designer-handbags-backpacks-mixed-collection-display.webp",
    href: "/used-brand-bag",
  },
  {
    id: "ukay",
    title: "Ukay Quality Bag",
    category: "WHOLESALE",
    image: "/img/cat-ukay.jpg",
    href: "/#contact",
  },
];

export const features = [
  {
    title: `${companyStats.reorderRate} Reorder Rate`,
    icon: "bar-chart-3",
    description:
      `Over ${companyStats.reorderRate} of our customers reorder because our stable quality helps them build a great reputation in their local markets.`,
  },
  {
    title: "Premium Raw Materials",
    icon: "award",
    description:
      "We source from first-tier cities including Beijing, Shanghai, Guangzhou, and Chengdu for the highest quality used items.",
  },
  {
    title: "Strict Quality Control",
    icon: "shield-check",
    description:
      "Trained quality inspectors conduct random inspections on each batch to ensure A-Grade standard throughout.",
  },
  {
    title: "Fast Loading & Delivery",
    icon: "zap",
    description:
      "Efficient sorting and reliable logistics allow us to load containers in as fast as 7 days after order placement.",
  },
  {
    title: "12+ Years Experience",
    icon: "clock-3",
    description:
      `Founded in ${companyStats.foundedYear}, we have rich experience in used clothes, shoes, and bags wholesale export to global markets.`,
  },
  {
    title: `Export to ${companyStats.countriesCount} Countries`,
    icon: "globe-2",
    description:
      "Our products are well-appreciated by wholesalers in Africa, Middle East, Southeast Asia, and South America.",
  },
];

export const orderSteps = [
  {
    num: "01",
    icon: "message-circle",
    title: "Contact Us",
    description:
      "Send us your inquiry via WhatsApp, email, or the contact form with your requirements.",
  },
  {
    num: "02",
    icon: "clipboard-list",
    title: "Get Price List",
    description:
      "We will send you our latest wholesale price list and product catalog within 12 hours.",
  },
  {
    num: "03",
    icon: "check-circle-2",
    title: "Confirm Order",
    description:
      "Choose your products, confirm quantities, and pay 30% deposit to start production.",
  },
  {
    num: "04",
    icon: "ship",
    title: "Receive Goods",
    description:
      "We load your container and ship to your port. Fastest delivery: 7 days after order.",
  },
];
