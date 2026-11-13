import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";
import { getTranslator } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/routing";

export interface CustomerAcknowledgementEmailProps {
  name: string;
  country: string;
  product: string;
  quantity: string;
  locale?: Locale;
}

const quantityLabels: Record<string, string> = {
  "100bales": "100+ bales of clothes",
  shoes: "Shoes — specify pairs below",
  bags: "Bags — specify pieces below",
  trial: "Trial order — confirm minimum",
  "20ft": "One 20ft container",
  "40ft": "One 40ft container",
  "2x40ft": "Two 40ft containers",
};

export function customerAcknowledgementSubject(name: string, locale: Locale = "en") {
  return getTranslator(locale)("Thank you for your inquiry, {name} — RealismThrift", { name });
}

function copy(props: CustomerAcknowledgementEmailProps) {
  const t = getTranslator(props.locale ?? "en");
  return {
    t,
    thanks: t("Thank you, {name}.", { name: props.name }),
    received: t("Inquiry received. Our sales team aims to reply within 12 hours."),
    product: props.product ? t(props.product) : t("Not specified"),
    quantity: props.quantity ? t(quantityLabels[props.quantity] ?? props.quantity) : t("Not specified"),
    country: props.country || t("Not specified"),
    contact: t("Reply directly to this email or contact us on WhatsApp to add details or ask questions."),
    notice: t("This automated message confirms receipt of your inquiry. Our sales team monitors replies."),
    address: t("RealismThrift Co., Ltd. · Huizhou, Guangdong, China"),
  };
}

export function CustomerAcknowledgementEmail(props: CustomerAcknowledgementEmailProps) {
  const c = copy(props);
  const t = c.t;
  return (
    <Html lang={props.locale ?? "en"} dir={props.locale === "ar" ? "rtl" : "ltr"}>
      <Head />
      <Preview>{c.received}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={brandStyle}>REALISMTHRIFT</Text>
            <Text style={brandSublineStyle}>{t("Stability · Quality · Trust")}</Text>
          </Section>
          <Section style={contentStyle}>
            <Text style={automaticStyle}>{t("AUTOMATED CONFIRMATION")}</Text>
            <Heading style={headingStyle}>{c.thanks}</Heading>
            <Text style={copyStyle}>{c.received}</Text>
            <Section style={summaryStyle}>
              <Text style={summaryTitleStyle}>{t("Your inquiry summary")}</Text>
              <Text style={summaryLineStyle}><strong>{t("Product:")}</strong> {c.product}</Text>
              <Text style={summaryLineStyle}><strong>{t("Quantity:")}</strong> {c.quantity}</Text>
              <Text style={summaryLineStyle}><strong>{t("Country:")}</strong> {c.country}</Text>
            </Section>
            <Text style={copyStyle}>{c.contact}</Text>
            <Section style={buttonRowStyle}>
              <Button href="https://wa.me/8617279444062" style={primaryButtonStyle}>{t("Contact us on WhatsApp")}</Button>
            </Section>
            <Text style={contactStyle}>
              {t("Email")}: <Link href="mailto:sales@realismthrift.com" dir="ltr" style={linkStyle}>sales@realismthrift.com</Link>
              <br />
              WhatsApp: <Link href="https://wa.me/8617279444062" dir="ltr" style={linkStyle}>+86 17279444062</Link>
            </Text>
            <Hr style={dividerStyle} />
            <Text style={noticeStyle}>{c.notice}</Text>
          </Section>
          <Section style={footerStyle}><Text style={footerTextStyle}>{c.address}</Text></Section>
        </Container>
      </Body>
    </Html>
  );
}

export function customerAcknowledgementText(props: CustomerAcknowledgementEmailProps) {
  const c = copy(props);
  return [
    c.thanks, "", c.t("AUTOMATED CONFIRMATION"), c.received, "",
    c.t("Your inquiry summary"),
    `${c.t("Product:")} ${c.product}`,
    `${c.t("Quantity:")} ${c.quantity}`,
    `${c.t("Country:")} ${c.country}`, "", c.contact,
    "sales@realismthrift.com", "https://wa.me/8617279444062", "", c.notice, "", c.address,
  ].join("\n");
}

const bodyStyle = {
  backgroundColor: "#f4f1e9",
  color: "#242424",
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: 0,
  padding: "32px 12px",
};
const containerStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4dfd2",
  borderRadius: "10px",
  margin: "0 auto",
  maxWidth: "580px",
  overflow: "hidden",
};
const headerStyle = {
  backgroundColor: "#1a1a1a",
  borderTop: "5px solid #f0b429",
  padding: "25px 32px 22px",
  textAlign: "center" as const,
};
const brandStyle = {
  color: "#ffffff",
  fontSize: "21px",
  fontWeight: "800",
  letterSpacing: "1.2px",
  margin: "0 0 4px",
};
const brandSublineStyle = { color: "#f0b429", fontSize: "11px", letterSpacing: "1px", margin: 0 };
const contentStyle = { padding: "32px 34px 28px" };
const automaticStyle = {
  color: "#a76c00",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "1.6px",
  margin: "0 0 11px",
};
const headingStyle = { color: "#1a1a1a", fontSize: "28px", lineHeight: "1.25", margin: "0 0 14px" };
const copyStyle = { color: "#4d4a44", fontSize: "15px", lineHeight: "1.7", margin: "0 0 20px" };
const summaryStyle = {
  backgroundColor: "#f8f6f0",
  borderLeft: "3px solid #f0b429",
  margin: "22px 0",
  padding: "15px 18px",
};
const summaryTitleStyle = {
  color: "#1a1a1a",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.6px",
  margin: "0 0 9px",
  textTransform: "uppercase" as const,
};
const summaryLineStyle = { color: "#4d4a44", fontSize: "14px", lineHeight: "1.55", margin: "3px 0" };
const buttonRowStyle = { margin: "24px 0 20px", textAlign: "center" as const };
const primaryButtonStyle = {
  backgroundColor: "#b11f2e",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "700",
  padding: "13px 22px",
  textDecoration: "none",
};
const contactStyle = { color: "#5b574f", fontSize: "13px", lineHeight: "1.7", margin: "0 0 18px", textAlign: "center" as const };
const linkStyle = { color: "#9a1d2b", textDecoration: "underline" };
const dividerStyle = { borderColor: "#e1dccf", margin: "22px 0 16px" };
const noticeStyle = { color: "#827c70", fontSize: "11px", lineHeight: "1.55", margin: 0, textAlign: "center" as const };
const footerStyle = { backgroundColor: "#eeeae0", padding: "15px 24px", textAlign: "center" as const };
const footerTextStyle = { color: "#706a5e", fontSize: "11px", margin: 0 };
