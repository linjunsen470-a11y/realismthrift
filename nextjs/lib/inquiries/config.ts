import { InquiryConfigurationError } from "./clients";
import { emailPattern, normalizeText } from "./validation";

export type InquiryEmailSettings = {
  salesTo: string;
  salesFrom: string;
  customerFrom: string;
};

function readEmail(name: string, fallback: string) {
  const value = normalizeText(process.env[name] || fallback, 120).toLowerCase();
  if (!emailPattern.test(value)) {
    throw new InquiryConfigurationError(`Invalid email address in ${name}`);
  }
  return value;
}

export function getInquiryEmailSettings(): InquiryEmailSettings {
  return {
    salesTo: readEmail("CONTACT_EMAIL", "sales@realismthrift.com"),
    salesFrom: readEmail("CONTACT_FROM_EMAIL", "website@realismthrift.com"),
    customerFrom: readEmail("AUTO_REPLY_FROM_EMAIL", "sales@realismthrift.com"),
  };
}

