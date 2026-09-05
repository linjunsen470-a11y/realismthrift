import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface CustomerAcknowledgementEmailProps {
  name: string;
  country: string;
  product: string;
  quantity: string;
}

function display(value: string) {
  return value || "Not specified";
}

export function CustomerAcknowledgementEmail({
  name,
  country,
  product,
  quantity,
}: CustomerAcknowledgementEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>We received your wholesale inquiry and aim to reply within 12 hours.</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={brandStyle}>REALISMTHRIFT</Text>
            <Text style={brandSublineStyle}>Stability · Quality · Trust</Text>
          </Section>

          <Section style={contentStyle}>
            <Text style={automaticStyle}>AUTOMATED CONFIRMATION</Text>
            <Heading style={headingStyle}>Thank you, {name}.</Heading>
            <Text style={copyStyle}>
              We have received your wholesale inquiry. Our sales team will review your requirements.
              We aim to reply within 12 hours.
            </Text>

            <Section style={summaryStyle}>
              <Text style={summaryTitleStyle}>Your inquiry summary</Text>
              <Text style={summaryLineStyle}><strong>Product:</strong> {display(product)}</Text>
              <Text style={summaryLineStyle}><strong>Quantity:</strong> {display(quantity)}</Text>
              <Text style={summaryLineStyle}><strong>Country:</strong> {display(country)}</Text>
            </Section>

            <Text style={copyStyle}>
              Need a faster response or want to add more details? Reply directly to this email or
              message us on WhatsApp.
            </Text>

            <Section style={buttonRowStyle}>
              <Button href="https://wa.me/8613367481710?text=Hi%2C%20I%20submitted%20a%20wholesale%20inquiry" style={primaryButtonStyle}>
                Contact us on WhatsApp
              </Button>
            </Section>

            <Text style={contactStyle}>
              Email: <Link href="mailto:sales@realismthrift.com" style={linkStyle}>sales@realismthrift.com</Link>
              <br />
              WhatsApp: <Link href="https://wa.me/8613367481710" style={linkStyle}>+86 133 6748 1710</Link>
            </Text>

            <Hr style={dividerStyle} />
            <Text style={noticeStyle}>
              This message was generated automatically to confirm receipt. Replies are monitored by
              our sales team.
            </Text>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              RealismThrift Co., Ltd. · Huizhou, Guangdong, China
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function customerAcknowledgementText({
  name,
  country,
  product,
  quantity,
}: CustomerAcknowledgementEmailProps) {
  return [
    `Thank you, ${name}.`,
    "",
    "This is an automated confirmation that we received your wholesale inquiry.",
    "Our sales team will review your requirements. We aim to reply within 12 hours.",
    "",
    "YOUR INQUIRY SUMMARY",
    `Product: ${display(product)}`,
    `Quantity: ${display(quantity)}`,
    `Country: ${display(country)}`,
    "",
    "You may reply directly to this email, email sales@realismthrift.com, or contact us on WhatsApp:",
    "https://wa.me/8613367481710",
    "",
    "RealismThrift Co., Ltd. · Huizhou, Guangdong, China",
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
