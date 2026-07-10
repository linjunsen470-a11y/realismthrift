import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface SalesInquiryEmailProps {
  inquiryId: string;
  submittedAt: string;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  sourcePath: string;
}

function display(value: string) {
  return value || "Not provided";
}

export function SalesInquiryEmail({
  inquiryId,
  submittedAt,
  name,
  email,
  whatsapp,
  country,
  product,
  quantity,
  message,
  sourcePath,
}: SalesInquiryEmailProps) {
  const submittedLabel = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Shanghai",
  }).format(new Date(submittedAt));

  const rows = [
    ["Name", name],
    ["Email", email],
    ["WhatsApp", whatsapp],
    ["Country", display(country)],
    ["Product", display(product)],
    ["Quantity", display(quantity)],
    ["Source page", sourcePath],
    ["Submitted", `${submittedLabel} (China time)`],
  ];

  return (
    <Html lang="en">
      <Head />
      <Preview>New wholesale inquiry from {name}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={eyebrowStyle}>REALISMTHRIFT WEBSITE</Text>
            <Heading style={headingStyle}>New wholesale inquiry</Heading>
            <Text style={headerCopyStyle}>
              Reply to this email to contact the buyer directly.
            </Text>
          </Section>

          <Section style={contentStyle}>
            {rows.map(([label, value]) => (
              <Section key={label} style={rowStyle}>
                <Text style={labelStyle}>{label}</Text>
                <Text style={valueStyle}>{value}</Text>
              </Section>
            ))}

            <Hr style={dividerStyle} />
            <Text style={labelStyle}>Buyer message</Text>
            <Text style={messageStyle}>{display(message)}</Text>

            <Section style={metaStyle}>
              <Text style={metaTextStyle}>Inquiry ID: {inquiryId}</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function salesInquiryText(props: SalesInquiryEmailProps) {
  return [
    "NEW WHOLESALE INQUIRY",
    "",
    `Name: ${props.name}`,
    `Email: ${props.email}`,
    `WhatsApp: ${props.whatsapp}`,
    `Country: ${display(props.country)}`,
    `Product: ${display(props.product)}`,
    `Quantity: ${display(props.quantity)}`,
    `Message: ${display(props.message)}`,
    `Source page: ${props.sourcePath}`,
    `Submitted: ${props.submittedAt}`,
    `Inquiry ID: ${props.inquiryId}`,
    "",
    "Reply to this email to contact the buyer directly.",
  ].join("\n");
}

const bodyStyle = {
  backgroundColor: "#f4f1e9",
  color: "#202020",
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: 0,
  padding: "32px 12px",
};

const containerStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4dfd2",
  borderRadius: "10px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
};

const headerStyle = {
  backgroundColor: "#1a1a1a",
  borderTop: "5px solid #f0b429",
  padding: "30px 34px 26px",
};

const eyebrowStyle = {
  color: "#f0b429",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "1.8px",
  margin: "0 0 10px",
};

const headingStyle = {
  color: "#ffffff",
  fontSize: "27px",
  lineHeight: "1.25",
  margin: "0 0 8px",
};

const headerCopyStyle = {
  color: "#cfcfcf",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: 0,
};

const contentStyle = { padding: "26px 34px 30px" };
const rowStyle = { borderBottom: "1px solid #eeeae1", padding: "5px 0" };
const labelStyle = {
  color: "#7a7468",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.7px",
  margin: "5px 0 2px",
  textTransform: "uppercase" as const,
};
const valueStyle = { color: "#202020", fontSize: "15px", lineHeight: "1.5", margin: "0 0 6px" };
const dividerStyle = { borderColor: "#ded8ca", margin: "22px 0" };
const messageStyle = {
  backgroundColor: "#f8f6f0",
  borderLeft: "3px solid #f0b429",
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.65",
  margin: "7px 0 20px",
  padding: "14px 16px",
  whiteSpace: "pre-wrap" as const,
};
const metaStyle = { backgroundColor: "#f3f0e8", borderRadius: "5px", padding: "10px 14px" };
const metaTextStyle = { color: "#6f695d", fontSize: "11px", margin: 0 };

