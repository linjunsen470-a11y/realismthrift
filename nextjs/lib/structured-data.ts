/** A CMS title containing </script> must stay data inside an HTML script element. */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
