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

/** Canonical factory address — single source of truth for site + structured data. */
export const companyAddress =
  "RealismThrift (Baisha Alley Weilitang), County Road 193, Yuanzhou Town, Boluo County, Huizhou City, Guangdong Province, China";

/** Visitor-facing addresses and the shared factory map. */
export const companyLocation = {
  addressChinese: "广东惠州博罗县园洲镇193县道RealismThrift（白沙巷尾礼堂）",
  didiAddress: "Baisha Elementary School, County Road 193, Yuanzhou Town, Boluo County, Huizhou City, Guangdong Province, China",
  didiAddressChinese: "广东省惠州市博罗县园洲镇193县道白沙小学",
  mapsUrl: "https://www.google.com/maps/d/viewer?mid=1tQMcpDr1wCiqu03ci3gFUnP7RlUudME",
  mapsEmbedUrl: "https://www.google.com/maps/d/embed?mid=1tQMcpDr1wCiqu03ci3gFUnP7RlUudME&ehbc=2E312F",
} as const;

/** Structured postal fields for schema.org / maps query strings. */
export const companyPostalAddress = {
  streetAddress: "RealismThrift (Baisha Alley Weilitang), County Road 193, Yuanzhou Town",
  addressLocality: "Boluo County, Huizhou City",
  addressRegion: "Guangdong",
  addressCountry: "CN",
  mapsQuery: companyAddress,
} as const;

export const siteHeader: SiteHeader = {
  brand: {
    logo: "RealismThrift",
    name: "Dongguan Huihe Realismthrift Trading Co., Ltd.",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "Used Clothes", href: "/used-brand-clothes" },
    { label: "Used Bags", href: "/used-brand-bag" },
    { label: "Used Shoes", href: "/used-brand-shoes" },
    { label: "Blog", href: "/blog" },
    { label: "How To Order", href: "/how-to-order" },
    { label: "About Us", href: "/about-us" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  inquiryCta: "INQUIRY",
};

export const siteFooter: SiteFooter = {
  brand: {
    logo: "RealismThrift",
    description:
      "Dongguan Huihe Realismthrift Trading Co., Ltd. supplies sorted second-hand clothes, shoes and bags from China for wholesale buyers and importers.",
    address: companyAddress,
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
        { label: "FAQ", href: "/faq" },
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
    inquiryTime: "We aim to reply within 12 hours. Urgent? Contact via WhatsApp.",
  },
  bottom: {
    copyright: "© 2026 Dongguan Huihe Realismthrift Trading Co., Ltd. All Rights Reserved.",
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
    title: "Ukay Quality Bags",
    category: "WHOLESALE",
    image: "/img/cat-ukay.webp",
    alt: "RealismThrift Ukay Quality Bags - Sorted Used Bags for Wholesale Export Markets",
    href: "/used-brand-bag",
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
    title: "Export Experience Since 2012",
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
      "Request our latest wholesale price list and product catalog. We aim to reply within 12 hours.",
  },
  {
    num: "03",
    icon: "check-circle-2",
    title: "Confirm Order",
    description:
      "Choose your products, confirm quantities, and confirm the deposit and payment schedule in your pro forma invoice.",
  },
  {
    num: "04",
    icon: "ship",
    title: "Receive Goods",
    description:
      "We arrange container loading and shipment to your port. Transit time depends on the route and sailing schedule.",
  },
];
