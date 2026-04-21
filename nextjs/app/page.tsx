import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleOff,
  Clock3,
  ClipboardList,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ship,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
import { blogPosts, features, orderSteps, productsData } from "@/data/siteData";
import { InquiryForm } from "@/components/InquiryForm";

const featureIconMap = {
  "award": Award,
  "bar-chart-3": BarChart3,
  "check-circle-2": CheckCircle2,
  "clock-3": Clock3,
  "clipboard-list": ClipboardList,
  "globe-2": Globe2,
  "message-circle": MessageCircle,
  "shield-check": ShieldCheck,
  "ship": Ship,
  "zap": Zap,
} as const;

const heroTags = [
  { label: "No Stains", icon: CircleOff },
  { label: "No Tears", icon: CircleOff },
  { label: "No Fading", icon: CircleOff },
  { label: "A-Grade Quality", icon: CheckCircle2 },
];

const trustItems = [
  { label: "A-Grade Quality Guarantee", icon: CheckCircle2 },
  { label: "12+ Years Experience", icon: Zap },
  { label: "Fast 7-Day Loading", icon: Ship },
  { label: "80%+ Reorder Rate", icon: BarChart3 },
  { label: "100+ Countries", icon: Globe2 },
];

const productQualityBadges = [
  { label: "NO Stains or Dirt", icon: CircleOff },
  { label: "NO Tears or Holes", icon: CircleOff },
  { label: "NO Fading or Overuse", icon: CircleOff },
  { label: "Fashionable & Clean", icon: CheckCircle2 },
];

const partnerRegions = [
  {
    name: "Africa",
    countries: "Nigeria, Ghana, Tanzania, Kenya, Uganda, Mozambique +5 more",
    icon: Globe2,
  },
  {
    name: "Southeast Asia",
    countries: "Philippines, Indonesia, Vietnam, Cambodia, Myanmar +4 more",
    icon: Globe2,
  },
  {
    name: "Middle East",
    countries: "UAE, Saudi Arabia, Jordan, Yemen, Iraq +4 more",
    icon: Globe2,
  },
  {
    name: "Americas",
    countries: "Brazil, Chile, Colombia, Ecuador, Peru +4 more",
    icon: Globe2,
  },
  {
    name: "Europe",
    countries: "Poland, Ukraine, Romania, Bulgaria +3 more",
    icon: Globe2,
  },
  {
    name: "Oceania",
    countries: "Papua New Guinea, Fiji, Solomon Islands +1 more",
    icon: Globe2,
  },
];

const faqs = [
  {
    question: "What is your monthly supply capacity?",
    answer:
      "Our monthly supply capacity is 1,000+ containers (20ft and 40ft). We can handle large orders efficiently with our 15,000m² facility and 300+ staff.",
  },
  {
    question: "What products do you offer?",
    answer:
      "We offer 200+ categories including used summer, winter, women’s, men’s, and brand clothes, used brand, mixed, and washed shoes, and used bags such as handbags, backpacks, and shoulder bags.",
  },
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer:
      "Minimum order is 100 bales (approx. 4,500 kg) for clothes, or 2,000 pairs for shoes. We also accept mixed orders.",
  },
  {
    question: "What are your payment methods?",
    answer:
      "We accept T/T (bank transfer), L/C (letter of credit), and Western Union. Standard terms: 30% deposit and 70% before shipment.",
  },
  {
    question: "How do you ensure quality?",
    answer:
      "We use A-Grade sorting standards. Trained quality inspectors conduct random inspections on every batch. No stains, no tears, no holes, and no fading.",
  },
  {
    question: "Can I get a sample before placing a bulk order?",
    answer:
      "Yes, we offer sample orders so you can verify quality before committing to a full container. Contact us for sample pricing.",
  },
];

const contactMethods = [
  {
    label: "EMAIL",
    value: "sales@realismthrift.com",
    href: "mailto:sales@realismthrift.com",
    icon: Mail,
  },
  {
    label: "WHATSAPP",
    value: "+8618800000001",
    href: "https://wa.me/8618800000001",
    icon: MessageCircle,
  },
  {
    label: "PHONE",
    value: "+86 188 0000 0001",
    href: "tel:+8618800000001",
    icon: Phone,
  },
  {
    label: "ADDRESS",
    value: "Guangzhou, Guangdong Province, China",
    icon: MapPin,
  },
];

export default function Home() {
  return (
    <div className="rt-home">
      <section className="rt-hero" id="home">
        <Image
          src="/img/hero-bg.png"
          alt="RealismThrift factory"
          fill
          priority
          className="rt-hero-bg"
        />
        <div className="rt-hero-overlay" />
        <div className="rt-hero-accent-line" />
        <div className="rt-container">
          <div className="rt-hero-content rt-fade-in">
            <div className="rt-hero-badge">#1 Second Hand Clothes Supplier in China</div>
            <h1 className="rt-hero-title">
              Direct Second Hand Brand Clothes, Shoes & Bags Factory
            </h1>
            <p className="rt-hero-subtitle">
              Wholesale to 100+ Countries | A-Grade Quality | Fast Delivery
            </p>
            <div className="rt-hero-tags">
              {heroTags.map(({ label, icon: Icon }) => (
                <span key={label} className="rt-hero-tag">
                  <Icon size={14} strokeWidth={2.2} />
                  {label}
                </span>
              ))}
            </div>
            <div className="rt-hero-cta">
              <Link href="#contact" className="rt-btn-primary">
                GET LATEST WHOLESALE PRICE LIST
              </Link>
              <Link href="#products" className="rt-btn-outline">
                View Products <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
            <div className="rt-hero-stats">
              <div className="rt-hero-stat">
                <span className="rt-hero-stat-value">15,000m²</span>
                <span className="rt-hero-stat-label">Modern Factory</span>
              </div>
              <div className="rt-hero-stat">
                <span className="rt-hero-stat-value">100+</span>
                <span className="rt-hero-stat-label">Countries Served</span>
              </div>
              <div className="rt-hero-stat">
                <span className="rt-hero-stat-value">80%</span>
                <span className="rt-hero-stat-label">Reorder Rate</span>
              </div>
              <div className="rt-hero-stat">
                <span className="rt-hero-stat-value">A-Grade</span>
                <span className="rt-hero-stat-label">Quality Standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="rt-trust-banner">
        <div className="rt-container">
          <div className="rt-trust-items">
            {trustItems.map(({ label, icon: Icon }) => (
              <div key={label} className="rt-trust-item">
                <Icon size={16} strokeWidth={2.2} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="rt-home-section rt-products" id="products">
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">WHOLESALE PRODUCTS</span>
            <h2 className="rt-section-title">SECOND HAND PRODUCT CATEGORIES</h2>
            <div className="rt-section-divider center" />
            <p className="rt-section-copy">
              Over 200 categories with A-Grade sorting. No stains, no tears, no fading
              {" "}
              only fashionable, bright, and clean items.
            </p>
          </div>

          <div className="rt-quality-badges">
            {productQualityBadges.map(({ label, icon: Icon }) => (
              <span key={label} className="rt-quality-badge">
                <Icon size={14} strokeWidth={2.2} />
                {label}
              </span>
            ))}
          </div>

          <div className="rt-products-grid">
            {productsData.map((product) => (
              <Link key={product.id} href={product.href} className="rt-product-card">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={260}
                  className="rt-product-card-image"
                />
                <span className="rt-product-card-badge">{product.category}</span>
                <span className="rt-product-card-overlay">
                  <span className="rt-product-card-overlay-button">
                    View Details <ArrowRight size={15} strokeWidth={2.25} />
                  </span>
                </span>
                <span className="rt-product-card-title">{product.title}</span>
              </Link>
            ))}
          </div>

          <div className="rt-products-cta">
            <Link href="#contact" className="rt-btn-primary">
              GET WHOLESALE PRICE LIST <ArrowRight size={16} strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-about" id="about">
        <div className="rt-container">
          <div className="rt-about-inner">
            <div className="rt-about-image-wrap">
              <Image
                src="/img/about-img.jpg"
                alt="RealismThrift Export Co., Ltd factory"
                width={760}
                height={560}
                className="rt-about-image"
              />
              <div className="rt-about-image-badge">15,000m² Modern Facility</div>
              <div className="rt-about-deco rt-about-deco-dark" />
              <div className="rt-about-deco rt-about-deco-red" />
            </div>

            <div className="rt-about-copy">
              <span className="rt-section-badge">ABOUT US</span>
              <h2 className="rt-section-title">WHY CHOOSE US</h2>
              <div className="rt-section-divider" />
              <p className="rt-about-subtitle">
                Your Most Reliable Partner in Used Clothing Export
              </p>
              <p className="rt-about-text">
                RealismThrift Export Co., Ltd is a world leader in recycling used fashion.
                We help businesses in Africa, Southeast Asia, the Middle East, and the
                Americas get the best second-hand clothes, shoes, and bags at wholesale
                prices.
              </p>
              <p className="rt-about-text">
                We operate from a 15,000-square-meter facility with 300+ dedicated staff
                members. Our strict quality control ensures long-term partnerships with
                clients in more than 100 countries.
              </p>
              <div className="rt-about-stats">
                <div className="rt-stat-box">
                  <span className="rt-stat-value">80%</span>
                  <span className="rt-stat-label">Reorder Rate</span>
                </div>
                <div className="rt-stat-box">
                  <span className="rt-stat-value">100+</span>
                  <span className="rt-stat-label">Countries Served</span>
                </div>
                <div className="rt-stat-box">
                  <span className="rt-stat-value">12+</span>
                  <span className="rt-stat-label">Years Experience</span>
                </div>
                <div className="rt-stat-box">
                  <span className="rt-stat-value">300+</span>
                  <span className="rt-stat-label">Staff Members</span>
                </div>
              </div>
              <Link href="#contact" className="rt-btn-primary">
                KNOW MORE <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-features" id="why-choose-us">
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">OUR ADVANTAGES</span>
            <h2 className="rt-section-title">WHY CHOOSE REALISMTHRIFT EXPORT CO., LTD</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-features-grid">
            {features.map((feature) => {
              const Icon =
                featureIconMap[feature.icon as keyof typeof featureIconMap] ?? Trophy;

              return (
                <article key={feature.title} className="rt-feature-card rt-fade-in">
                  <div className="rt-feature-icon">
                    <Icon size={22} strokeWidth={2.25} />
                  </div>
                  <h3 className="rt-feature-title">{feature.title}</h3>
                  <p className="rt-feature-desc">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-partners" id="partners">
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge light">GLOBAL REACH</span>
            <h2 className="rt-section-title light">OUR GLOBAL PARTNERS</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-partners-grid">
            {partnerRegions.map(({ name, countries, icon: Icon }) => (
              <article key={name} className="rt-partner-card">
                <div className="rt-partner-region">
                  <Icon size={24} strokeWidth={2.1} />
                </div>
                <h3 className="rt-partner-name">{name}</h3>
                <p className="rt-partner-countries">{countries}</p>
              </article>
            ))}
          </div>

          <div className="rt-partners-count">
            <span>
              <Globe2 size={16} strokeWidth={2.2} />
              100+ Countries Served Worldwide
            </span>
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-order" id="how-to-order">
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">SIMPLE PROCESS</span>
            <h2 className="rt-section-title">HOW TO ORDER</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-order-grid">
            {orderSteps.map((step) => {
              const Icon =
                featureIconMap[step.icon as keyof typeof featureIconMap] ?? ClipboardList;

              return (
                <article key={step.num} className="rt-home-order-step rt-fade-in">
                  <span className="rt-home-order-step-number">{step.num}</span>
                  <div className="rt-home-order-step-icon">
                    <Icon size={28} strokeWidth={2.25} />
                  </div>
                  <h3 className="rt-home-order-step-title">{step.title}</h3>
                  <p className="rt-home-order-step-desc">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-faq" id="faq">
        <div className="rt-container rt-faq-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">FAQ</span>
            <h2 className="rt-section-title">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-faq-list">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="rt-faq-item"
                open={index === 0}
              >
                <summary className="rt-faq-question">
                  <span>{faq.question}</span>
                  <ChevronDown className="rt-faq-arrow" size={20} strokeWidth={2.25} />
                </summary>
                <div className="rt-faq-answer">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-contact" id="contact">
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge light">CONTACT US</span>
            <h2 className="rt-section-title light">GET IN TOUCH</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-contact-inner">
            <div className="rt-contact-info">
              <h3 className="rt-contact-info-title">
                Consult your used clothing export specialist
              </h3>

              {contactMethods.map(({ label, value, href, icon: Icon }) => (
                <div key={label} className="rt-contact-info-item">
                  <span className="rt-contact-info-icon">
                    <Icon size={20} strokeWidth={2.25} />
                  </span>
                  <div>
                    <div className="rt-contact-info-label">{label}</div>
                    {href ? (
                      <a href={href} className="rt-contact-info-link">
                        {value}
                      </a>
                    ) : (
                      <span className="rt-contact-info-link static">{value}</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="rt-contact-online">
                <p>
                  <MessageCircle size={16} strokeWidth={2.2} />
                  <span>
                    <strong>Online Now</strong>
                    <br />
                    Our sales team replies within <strong>12 hours</strong>.
                  </span>
                </p>
              </div>
            </div>

            <div className="rt-contact-form-shell">
              <div className="rt-contact-form-corner" />
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      <section className="rt-seo-copy">
        <div className="rt-container">
          <div className="rt-seo-copy-inner">
            <h2>About RealismThrift Export Co., Ltd</h2>
            <p>
              RealismThrift Export Co., Ltd is a leading
              {" "}
              <strong>second hand clothes wholesale supplier</strong>
              {" "}
              based in Guangzhou, China. We specialize in exporting high-quality used
              clothes, used shoes, and used bags to wholesalers and importers worldwide.
              With over 12 years of experience in the
              {" "}
              <strong>used clothing export</strong>
              {" "}
              industry, we have built strong relationships with buyers in more than 100
              countries across Africa, Southeast Asia, the Middle East, and the Americas.
            </p>
            <p>
              Contact us today to get our latest wholesale price list and start your
              profitable second-hand clothing business. Email:
              {" "}
              <a href="mailto:sales@realismthrift.com">sales@realismthrift.com</a>
            </p>
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-news" id="news">
        <div className="rt-container">
          <div className="rt-news-header">
            <div>
              <span className="rt-section-badge">BLOG &amp; RESOURCES</span>
              <h2 className="rt-section-title">LATEST NEWS &amp; INSIGHTS</h2>
              <div className="rt-section-divider" />
              <p className="rt-news-copy">
                Industry news, wholesale tips, and market insights for second-hand
                clothing importers worldwide.
              </p>
            </div>

            <Link href="/blog" className="rt-news-view-all">
              VIEW ALL (26) ARTICLES <ArrowRight size={16} strokeWidth={2.25} />
            </Link>
          </div>

          <div className="rt-news-grid">
            {blogPosts.map((post) => (
              <article key={post.slug} className="rt-news-card">
                <Link href={`/blog/${post.slug}`} className="rt-news-card-thumb">
                  <div className="rt-news-card-thumb-fallback">
                    <ClipboardList size={36} strokeWidth={2.1} />
                  </div>
                </Link>
                <div className="rt-news-card-body">
                  <div className="rt-news-card-meta">
                    <span className="rt-news-card-category">{post.category}</span>
                    <span className="rt-news-card-date">{post.date}</span>
                  </div>
                  <h3 className="rt-news-card-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="rt-news-card-excerpt">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="rt-news-card-link">
                    READ MORE <ArrowRight size={15} strokeWidth={2.25} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="rt-news-footer">
            <p>
              Want to read more articles about the second-hand wholesale industry?
            </p>
            <Link href="/blog" className="rt-news-footer-link">
              VIEW ALL ARTICLES (26) <ArrowRight size={16} strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
