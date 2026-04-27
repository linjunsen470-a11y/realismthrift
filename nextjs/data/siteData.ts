import { Product, SiteFooter, SiteHeader } from "@/types";

export const companyStats = {
  foundedYear: 2012,
  staffCount: "80+",
  countriesCount: "100+",
  facilitySize: "15,000 m²",
  monthlyCapacity: "200 tonnes",
  reorderRate: "Repeat",
  buyersCount: "Wholesale",
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
      "RealismThrift Export Co., Ltd supplies sorted second-hand clothes, shoes and bags from China for wholesale buyers and importers.",
    address: "Fuyida Industrial Park, No. 52 Yida Road, Boluo County, Huizhou City, Guangdong Province, China",
    phone: "+86 133 6748 1710",
    email: "sales@realismthrift.com",
    whatsapp: "+86 133 6748 1710",
    socials: {
      facebook: "https://facebook.com/realismthrift",
      instagram: "https://instagram.com/realismthrift",
      youtube: "https://youtube.com/@realismthrift",
      twitter: "https://x.com/realismthrift",
    },
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
    image: "/images/clothes/adidas-kelme-athletic-shorts-pants-pile.webp",
    alt: "RealismThrift Wholesale Used Brand Clothes - Sorted Second Hand Clothing Bulk Supply from China",
    href: "/used-brand-clothes",
  },
  {
    id: "shoes",
    title: "Used Brand Shoes",
    category: "WHOLESALE",
    image: "/images/shoes/designer-sneakers-assorted-wholesale-display.webp",
    alt: "RealismThrift Wholesale Used Brand Shoes - Branded Sneakers and Footwear Bulk Export Service from Huizhou Factory",
    href: "/used-brand-shoes",
  },
  {
    id: "bags",
    title: "Used Brand Bags",
    category: "WHOLESALE",
    image: "/images/bags/designer-handbags-backpacks-mixed-collection-display.webp",
    alt: "RealismThrift Wholesale Used Brand Bags - Designer Handbags and Backpacks Second Hand Bulk Inventory China Supplier",
    href: "/used-brand-bag",
  },
  {
    id: "ukay",
    title: "Ukay Quality Bag",
    category: "WHOLESALE",
    image: "/img/cat-ukay.webp",
    alt: "RealismThrift Ukay Quality Bags - Sorted Used Bags for Wholesale Export Markets",
    href: "/#contact",
  },
];

export const features = [
  {
    title: "Repeat Buyer Support",
    icon: "bar-chart-3",
    description:
      "We support returning buyers with stable sorting standards, order photos, and practical loading advice.",
  },
  {
    title: "Urban Sourcing Network",
    icon: "award",
    description:
      "We source from collection networks in major Chinese cities including Beijing, Shanghai, Guangzhou, and Chengdu.",
  },
  {
    title: "Strict Quality Control",
    icon: "shield-check",
    description:
      "Trained quality inspectors conduct batch checks so buyers receive clearly graded merchandise.",
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
