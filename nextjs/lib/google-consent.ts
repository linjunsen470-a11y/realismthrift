export type MeasurementChoice = "granted" | "denied";

// EEA member states, the United Kingdom and Switzerland (ISO 3166-1).
export const optInRegions = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE", "GB", "CH",
];

// These two functions also execute in the inline bootstrap, before either config.
export function measurementConsent(choice: MeasurementChoice) {
  return {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: "denied",
  };
}

export function savedMeasurementChoice(): MeasurementChoice | null {
  try {
    const value = localStorage.getItem("rt-google-measurement");
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}
