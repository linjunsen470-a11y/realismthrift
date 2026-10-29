/** Marketing labels only: no arbitrary query strings, click IDs, or free text.
 * Keep self-contained: this function also runs in the pre-config inline bootstrap.
 */
export function campaignParameters(search: string): Record<string, string> {
  const query = new URLSearchParams(search);
  const fields = {
    utm_source: "campaign_source",
    utm_medium: "campaign_medium",
    utm_campaign: "campaign_name",
    utm_id: "campaign_id",
    utm_content: "campaign_content",
  };
  const result: Record<string, string> = {};
  for (const [key, field] of Object.entries(fields)) {
    const values = query.getAll(key);
    const value = values.length === 1 ? values[0] : "";
    // Require short campaign slugs; reject email, URL, phone-like and encoded values.
    if (/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(value) && !/\d{7}/.test(value)) {
      result[field] = value;
    }
  }
  if (!Object.keys(result).length) return result;
  // Replace the whole campaign when a new tagged URL arrives; don't retain an
  // earlier creative/name when the next campaign omits those optional labels.
  return Object.fromEntries(Object.values(fields).map(field => [field, result[field] ?? ""]));
}
